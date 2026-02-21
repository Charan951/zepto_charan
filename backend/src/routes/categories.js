import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

