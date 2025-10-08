import express from "express";
import { getCommentsByArticle } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:article_id", getCommentsByArticle);

export default router;
