import jwt from "jsonwebtoken";
import pool from "../../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database, include is_verified
    const { rows } = await pool.query(
      "SELECT id, username, email, is_verified FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before performing this action." });
    }

    // Attach user to request and proceed
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
