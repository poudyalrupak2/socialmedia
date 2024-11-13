import express from 'express'
import { createComment, getCommentsByPostId } from   '../controllers/CommentController.js';
const router = express.Router();
import authMiddleWare from "../middleware/AuthMiddleware.js"; // Assuming you have an auth middleware

// Route to create a comment (protected route)
router.post("/", authMiddleWare, createComment);

// Route to get all comments for a specific post
router.get("/:postId", getCommentsByPostId);

export default router