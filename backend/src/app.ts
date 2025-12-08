import express from "express";
import admin from "firebase-admin";
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import rateLimiter from "./middleware/rateLimiter";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { Expo } from 'expo-server-sdk';

// Initialize Firebase Admin with environment variable
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require("./config/serviceAccountKey.json"); // Fallback for local development

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export const db = admin.firestore();
const expo = new Expo();
const app = express();

//Middleware
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cookieParser());          
app.use(cors({ origin: true, credentials: true })); // if using cookies across domains

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

//PUSH NOTIFICATION 

app.get("/", (req, res) => {
  res.send("Expo Notification Backend!");
});

app.post("/api/push-notification", async(req, res) => {
  const { token, title, body, metadata } = req.body;
  if(!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ message: "Invalid push token" });
  }

  const message = {
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: metadata,
  };
  try {
    const tickets = await expo.sendPushNotificationsAsync([message]);
    return res.status(200).json({ message: "Notification sent successfully", tickets });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ message: "Error sending notification" });
  }
})

export default app;