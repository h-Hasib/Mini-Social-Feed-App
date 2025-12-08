import { Router } from "express";
import {
  getUser,
  savePushToken,
  updateUser
} from "../services/user.services";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticateToken, getUser);       // Get single
router.put("/:id", authenticateToken, updateUser);    // Update
router.post("/push-token", authenticateToken, savePushToken);
export default router;
