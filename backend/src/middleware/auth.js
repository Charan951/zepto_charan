import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(role) {
  return async function (req, res, next) {
    try {
      const user = await User.findById(req.user.id).select("role");
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role !== role) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  };
}
