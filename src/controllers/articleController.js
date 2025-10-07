import pool from '../../db/db.js';

// CREATE ARTICLE
export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user_id = req.user.id; // from middleware

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO articles (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // GET ALL ARTICLES
export const getArticles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.username AS author
       FROM articles a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ARTICLE WITH COMMENTS
export const getArticleWithComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch article with author info
    const articleResult = await pool.query(
      `SELECT a.*, u.username AS author
       FROM articles a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (articleResult.rows.length === 0)
      return res.status(404).json({ message: "Article not found" });

    const article = articleResult.rows[0];

    // Fetch comments with author info
    const commentsResult = await pool.query(
      `SELECT c.*, u.username AS author
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.article_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );

    article.comments = commentsResult.rows;

    res.json(article);
  } catch (error) {
    console.error("Error fetching article with comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ONE ARTICLE
// export const getArticleById = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT a.*, u.username AS author
//        FROM articles a
//        JOIN users u ON a.user_id = u.id
//        WHERE a.id = $1`,
//       [req.params.id]
//     );

//     if (result.rows.length === 0)
//       return res.status(404).json({ message: "Article not found" });

//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// UPDATE ARTICLE
export const updateArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    // Check ownership
    const check = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);
    if (check.rows.length === 0)
      return res.status(404).json({ message: "Article not found" });
    if (check.rows[0].user_id !== user_id)
      return res.status(403).json({ message: "Not authorized" });

    const result = await pool.query(
      `UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
      [title || check.rows[0].title, content || check.rows[0].content, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ARTICLE
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const check = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);
    if (check.rows.length === 0)
      return res.status(404).json({ message: "Article not found" });
    if (check.rows[0].user_id !== user_id)
      return res.status(403).json({ message: "Not authorized" });

    await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
