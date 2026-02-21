import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ categories });
});

router.post("/", async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ message: "Category name already exists" });
    const category = await Category.create({ name, description, isActive });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive },
      { new: true, runValidators: true },
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
