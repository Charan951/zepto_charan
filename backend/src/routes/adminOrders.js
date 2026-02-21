import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ order });
});

router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount, customerPhone, address, paymentMethod, notes } = req.body;
    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Customer and items are required" });
    }
    const order = await Order.create({
      customerName,
      customerEmail,
      items,
      totalAmount,
      customerPhone,
      address,
      paymentMethod: paymentMethod === "online" ? "online" : "cod",
      notes,
    });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, notes },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
