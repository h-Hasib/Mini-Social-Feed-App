import { db } from "../app";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({ error: "Email, password and username required" });
    }

    const usersRef = db.collection("users");
    const existing = await usersRef.where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const docRef = await usersRef.add({
      userName,
      email,
      password: passwordHash,  
      createdAt: new Date(),
      theme: "coffee"
    });

    const userId = docRef.id;

    // Create session ID first
    const sessionRef = db.collection('sessions').doc();
    const sessionId = sessionRef.id;

    // Generate tokens with sessionId included
    const refreshToken = jwt.sign(
      { 
        sub: userId,
        sessionId: sessionId,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    const accessToken = jwt.sign(
      { 
        sub: userId,
        sessionId: sessionId,
        type: 'access'
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: 7200 }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save session to Firestore
    await sessionRef.set({
      userId: userId,
      refreshToken: refreshToken,
      ip: req.ip || null,
      userAgent: req.get("User-Agent") || null,
      createdAt: new Date(),
      expiresAt: expiresAt,
      revokedAt: null
    });

    // Send refresh token in httpOnly cookie
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax" as "lax",
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
      expires: expiresAt
    };
    res.cookie("refreshToken", refreshToken, cookieOpts);

    return res.status(201).json({
      message: "Signup successful",
      accessToken,
      sessionId,
      user: {
        id: userId,
        email: email,
        userName: userName
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Validate user credentials
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    // Get password hash (handle both field names for backwards compatibility)
    const storedPasswordHash = user.password || user.passwordHash;
    
    if (!storedPasswordHash) {
      return res.status(500).json({ 
        error: "User account is corrupted. Please contact support." 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, storedPasswordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Delete all existing sessions for this user
    try {
      const existingSessionsSnapshot = await db.collection('sessions')
        .where('userId', '==', userId)
        .get();
      
      if (!existingSessionsSnapshot.empty) {
        // Use batch delete for better performance
        const batch = db.batch();
        existingSessionsSnapshot.docs.forEach(doc => {
          console.log(`Marking session ${doc.id} for deletion`);
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      } else {
        console.log(`No existing sessions found for user ${userId}`);
      }
    } catch (sessionDeleteErr) {
      console.error("Error deleting previous sessions:", sessionDeleteErr);
    }

    // Create new session in Firestore
    const sessionRef = db.collection('sessions').doc();
    const sessionId = sessionRef.id;

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        sub: userId, 
        sessionId: sessionId,
        type: 'refresh' 
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Generate access token with sessionId
    const accessToken = jwt.sign(
      { 
        sub: userId,
        sessionId: sessionId,
        type: 'access'
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '30m' }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7D

    // Save new session to Firestore
    await sessionRef.set({
      userId: userId,
      refreshToken: refreshToken,
      ip: req.ip || null,
      userAgent: req.get("User-Agent") || null,
      createdAt: new Date(),
      expiresAt: expiresAt,
      revokedAt: null
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    // Return access token
    return res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      sessionId,
      user: {
        id: userId,
        email: user.email,
        userName: user.userName
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      message: "Login failed",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    const { allDevices } = req.body || true;

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", { 
      path: "/",
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax" as "lax",
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    if (!user?.userId) {
      return res.status(200).json({ 
        message: "Logged out successfully" 
      });
    }

    // If allDevices is true, logout from all sessions
    if (allDevices === true) {
      const deletedCount = await revokeAllUserSessions(user.userId);
      
      return res.status(200).json({ 
        message: "Logged out from all devices successfully",
        sessionsDeleted: deletedCount
      });
    }

    // Otherwise, just logout from current session
    if (user.sessionId) {
      const sessionRef = db.collection('sessions').doc(user.sessionId);
      const sessionSnap = await sessionRef.get();
      
      if (sessionSnap.exists) {
        await sessionRef.delete();
      } else {
        console.log(`⚠️ Session ${user.sessionId} was already deleted`);
      }
    }

    return res.status(200).json({ 
      message: "Logged out successfully" 
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ 
      message: "Logout failed",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

// Logout from all devices
export const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    
    if (!user?.userId) {
      return res.status(401).json({ 
        message: "User not authenticated" 
      });
    }

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", { 
      path: "/",
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax" as "lax",
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    // Delete all sessions for this user
    const deletedCount = await revokeAllUserSessions(user.userId);

    return res.status(200).json({ 
      message: "Logged out from all devices successfully",
      sessionsDeleted: deletedCount
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Logout from all devices failed",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

// REFRESH TOKEN
export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log("EMPTY", refreshToken)
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if session exists
    const sessionDoc = await db.collection('sessions').doc(decoded.sessionId).get();

    if (!sessionDoc.exists) {
      return res.status(401).json({ message: "Session not found" });
    }

    const session = sessionDoc.data();

    if (session?.revokedAt) {
      return res.status(401).json({ message: "Session revoked" });
    }

    // Generate new access token with sessionId
    const newAccessToken = jwt.sign(
      { 
        sub: decoded.sub,
        sessionId: decoded.sessionId,
        type: 'access'
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '30m' }
    );

    return res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ 
      message: "Token refresh failed"
    });
  }
};

// ==================== HELPER FUNCTIONS ====================

export const createSessionAndTokens = async ({
  userId,
  ip,
  userAgent
}: {
  userId: string;
  ip?: string;
  userAgent?: string;
}) => {
  // Create session ID
  const sessionRef = db.collection('sessions').doc();
  const sessionId = sessionRef.id;

  // Generate tokens with sessionId
  const refreshToken = jwt.sign(
    { 
      sub: userId,
      sessionId: sessionId,  
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  const accessToken = jwt.sign(
    { 
      sub: userId,
      sessionId: sessionId,  
      type: 'access'
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: 7200 }
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Save session to Firestore
  await sessionRef.set({
    userId: userId,
    refreshToken: refreshToken,
    ip: ip || null,
    userAgent: userAgent || null,
    createdAt: new Date(),
    expiresAt: expiresAt,
    revokedAt: null
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresAt
  };
};

// Revoke all sessions for a specific user
export const revokeAllUserSessions = async (userId: string) => {
  try {
    // Query all sessions for this user
    const sessionsSnapshot = await db.collection('sessions')
      .where('userId', '==', userId)
      .get();
    
    if (sessionsSnapshot.empty) {
      return 0;
    }

    // Use batch delete for better performance
    const batch = db.batch();
    
    sessionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Commit the batch
    await batch.commit();
  
    return sessionsSnapshot.size;
  } catch (err) {
    console.error(`Error deleting sessions for user ${userId}:`, err);
    throw err;
  }
};