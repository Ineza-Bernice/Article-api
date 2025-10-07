// import express from "express";
// import { createComment, getCommentsByArticle } from "../controllers/commentController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Create comment (protected)
// router.post("/", protect, createComment);

// // Get all comments for an article (public)
// router.get("/:article_id", getCommentsByArticle);
// // 
// export default router;
import express from "express";
import { getCommentsByArticle } from "../controllers/commentController.js";

const router = express.Router();

// ✅ Get all comments for a specific article (public)
router.get("/:article_id", getCommentsByArticle);

export default router;
