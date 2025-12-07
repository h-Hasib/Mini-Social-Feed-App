import express from "express";
import admin from "firebase-admin";
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import rateLimiter from "./middleware/rateLimiter";
import cookieParser from "cookie-parser";
import cors from 'cors';

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

export default app;