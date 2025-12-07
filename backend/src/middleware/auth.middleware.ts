import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { db } from '../app'; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
        email?: string;
        userName?: string;
        [key: string]: any;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Get access token from Authorization header
    const authHeader = req.headers.authorization;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({ 
        message: "Access token required",
        code: "TOKEN_MISSING"
      });
    }

    // Verify JWT signature and expiration
    let decoded: any;
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      
      if (!secret) {
        return res.status(500).json({ 
          message: "Server configuration error",
          code: "CONFIG_ERROR"
        });
      }

      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ 
        message: "Invalid or expired access token",
        code: "TOKEN_INVALID",
        error: err instanceof Error ? err.message : "Unknown error"
      });
    }

    // Check if sessionId exists in decoded token
    if (!decoded.sessionId) {
      return res.status(401).json({ 
        message: "Invalid token structure",
        code: "TOKEN_INVALID_STRUCTURE"
      });
    }

    // Check if session exists in Firestore
    let sessionDoc;
    try {
      sessionDoc = await db.collection('sessions').doc(decoded.sessionId).get();
    } catch (err) {
      throw new Error(`Firestore session fetch error: ${err}`);
    }

    if (!sessionDoc.exists) {
      return res.status(401).json({ 
        message: "Session has been terminated. Please login again.",
        code: "SESSION_TERMINATED"
      });
    }

    const session = sessionDoc.data();

    // Session was explicitly revoked
    if (session?.revokedAt) {
      return res.status(401).json({ 
        message: "Session has been revoked. Please login again.",
        code: "SESSION_REVOKED"
      });
    }

    // Session expired
    if (session?.expiresAt) {
      const expiresAt = session.expiresAt.toDate ? session.expiresAt.toDate() : new Date(session.expiresAt);
      
      if (expiresAt < new Date()) {
        return res.status(401).json({ 
          message: "Session has expired. Please login again.",
          code: "SESSION_EXPIRED"
        });
      }
    }

    // Check if userId exists
    if (!session?.userId) {
      return res.status(401).json({ 
        message: "Invalid session structure",
        code: "INVALID_SESSION"
      });
    }

    // Get user info
    let userDoc;
    try {
      userDoc = await db.collection('users').doc(session.userId).get();
    } catch (err) {
      throw new Error(`Firestore user fetch error: ${err}`);
    }

    if (!userDoc.exists) {
      return res.status(401).json({ 
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    const user = userDoc.data();

    // Attach user info to request
    req.user = {
      userId: session.userId,
      sessionId: sessionDoc.id,
      email: user?.email,
      userName: user?.userName,
      ...decoded
    };

    next();
  } catch (err) {
    return res.status(500).json({ 
      message: "Authentication failed",
      code: "AUTH_ERROR",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
};