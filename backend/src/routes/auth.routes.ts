// routes/auth.routes.ts
import { Router } from "express";
import { Request, Response } from "express";
import { refresh, login, logout, signup, logoutAllDevices } from "../services/auth.services";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login); // LOGIN - sample: expects { email, password }, & existing user collection (with hashed password)
router.post("/signup", signup); //SIGNUP - Create a new user and immediate login
router.post("/refresh", authenticateToken, refresh); //Accepts refresh token from cookie or body. Rotates the refresh token.
router.post("/logout", authenticateToken, logout) //LOGOUT route - revoke session detected via cookie or body token
router.post("/logout-all", authenticateToken, logoutAllDevices);

export default router;
