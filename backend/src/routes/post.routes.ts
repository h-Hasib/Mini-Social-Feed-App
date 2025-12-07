import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
  likePost,
  commentPost,
  getCommentsByPost,
  getPostsByCategory,
  getPostsByUserName
} from "../services/post.services";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Posts
router.post("/", authenticateToken, createPost);           // Create post
router.get("/", authenticateToken, getPosts);              // Feed with counts
router.get("/:id", authenticateToken, getPostById);        // Single post detail
router.put("/:id", authenticateToken, updatePost);         // Update post (only creator)
router.delete("/:id", authenticateToken, deletePost);      // Delete post (only creator)

// Filtered posts
router.get("/user/id/:userId", authenticateToken, getPostsByUser); // Posts by user
router.get("/user/name/:userName", authenticateToken, getPostsByUserName);
router.get("/category/:category", authenticateToken, getPostsByCategory);      // Posts by tag

// Interactions
router.post("/like/:id", authenticateToken, likePost);           // Like/unlike post
router.post("/comment/:id", authenticateToken, commentPost);     // Add comment
router.get("/comment/:id", authenticateToken, getCommentsByPost); // Get comments for a post

export default router;
