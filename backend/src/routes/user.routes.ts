import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from "../services/user.services";

const router = Router();

router.post("/", createUser);      // Create
router.get("/", getUsers);         // Get all
router.get("/:id", getUser);       // Get single
router.put("/:id", updateUser);    // Update
router.delete("/:id", deleteUser); // Delete

export default router;
