import express from "express";
import admin from "firebase-admin";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import rateLimiter from "./middleware/rateLimiter";

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

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

export default app;