import express from "express";
import User from "../models/User.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

router.get("/admin/stats", requireRole("admin"), async (req, res) => {
  const countUsers = await User.countDocuments();
  const admins = await User.countDocuments({ role: "admin" });
  res.json({ stats: { users: countUsers, admins } });
});

export default router;
