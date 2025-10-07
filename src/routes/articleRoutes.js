import express from "express";
import {
  createArticle,
  getArticles,
  getArticleWithComments,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { createComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all articles (public)
router.get("/", getArticles);

// ✅ Get single article with its comments (public)
router.get("/:id", getArticleWithComments);

// ✅ Create a new article (requires login)
router.post("/", protect, createArticle);

// ✅ Update an article (only author)
router.put("/:id", protect, updateArticle);

// ✅ Delete an article (only author)
router.delete("/:id", protect, deleteArticle);

// ✅ Add a comment to an article (requires login)
router.post("/:id/comments", protect, createComment);

export default router;
