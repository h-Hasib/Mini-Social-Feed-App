import { Router } from "express";
import {
  getUser,
  updateUser
} from "../services/user.services";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticateToken, getUser);       // Get single
router.put("/:id", authenticateToken, updateUser);    // Update

export default router;
