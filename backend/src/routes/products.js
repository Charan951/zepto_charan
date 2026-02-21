import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate("category", "name").sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product || !product.isActive) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

