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

router.get("/", getArticles);
router.get("/:id", getArticleWithComments);
router.post("/", protect, createArticle);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);
router.post("/:id/comments", protect, createComment);

export default router;
