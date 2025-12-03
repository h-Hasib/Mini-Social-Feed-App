import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById
} from "../services/post.services";

const router = Router();

router.post("/", createPost);      // Create a text-only post
router.get("/", getPosts);         // Paginated posts
router.get("/:id", getPostById);   // Single post detail

export default router;
