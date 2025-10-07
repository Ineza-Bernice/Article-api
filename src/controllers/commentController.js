import pool from '../../db/db.js';

// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const author_id = req.user.id; // from JWT protect middleware
    const article_id = req.params.id; // from the URL (/articles/:id/comments)

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Check if article exists
    const articleCheck = await pool.query(
      "SELECT * FROM articles WHERE id = $1",
      [article_id]
    );
    if (articleCheck.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Insert comment
    const result = await pool.query(
      "INSERT INTO comments (content, author_id, article_id) VALUES ($1, $2, $3) RETURNING *",
      [content, author_id, article_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// GET COMMENTS BY ARTICLE
export const getCommentsByArticle = async (req, res) => {
  try {
    const { article_id } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.username AS author
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.article_id = $1
       ORDER BY c.created_at ASC`,
      [article_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
