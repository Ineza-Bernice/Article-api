import jwt from "jsonwebtoken";
import pool from "../../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [decoded.id]);

      if (user.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request
      req.user = user.rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
