import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

const router = express.Router();
const hasCloudinaryConfig =
  !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;

router.get("/", async (req, res) => {
  const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
  res.json({ products });
});

router.post("/", async (req, res) => {
  try {
    const { name, price, originalPrice, stock, category, description, imageUrl, imageData, isActive } = req.body;
    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: "Name, price and stock are required" });
    }

    let finalImageUrl = imageUrl;

    if (imageData) {
      if (hasCloudinaryConfig) {
        try {
          const uploadResult = await cloudinary.uploader.upload(imageData, {
            folder: "products",
          });
          finalImageUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error("Product image upload failed:", uploadErr);
          finalImageUrl = imageData;
        }
      } else {
        finalImageUrl = imageData;
      }
    }

    const product = await Product.create({
      name,
      price,
      originalPrice,
      stock,
      category,
      description,
      imageUrl: finalImageUrl,
      isActive,
    });
    res.status(201).json({ product });
  } catch (err) {
    console.error("Create product failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, price, originalPrice, stock, category, description, imageUrl, imageData, isActive } = req.body;

    let finalImageUrl = imageUrl;

    if (imageData) {
      if (hasCloudinaryConfig) {
        try {
          const uploadResult = await cloudinary.uploader.upload(imageData, {
            folder: "products",
          });
          finalImageUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error("Product image upload failed (update):", uploadErr);
          finalImageUrl = imageData;
        }
      } else {
        finalImageUrl = imageData;
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, originalPrice, stock, category, description, imageUrl: finalImageUrl, isActive },
      { new: true, runValidators: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    console.error("Update product failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
