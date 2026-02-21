import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, address, notes, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Customer details and at least one item are required" });
    }

    const hasProductIds = items.every((item) => typeof item.product === "string" && item.product.trim().length > 0);

    let products = [];
    if (hasProductIds) {
      const productIds = items.map((item) => item.product);
      products = await Product.find({ _id: { $in: productIds } }).lean();

      if (products.length !== productIds.length) {
        return res.status(400).json({ message: "One or more products were not found" });
      }

      for (const item of items) {
        const product = products.find((p) => p._id.toString() === item.product);
        if (!product) {
          return res.status(400).json({ message: "Product not found for one of the items" });
        }
        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
        }
      }
    }

    const orderItems = items.map((item) => {
      if (hasProductIds) {
        const product = products.find((p) => p._id.toString() === item.product);
        return {
          product: product ? product._id : undefined,
          name: product ? product.name : item.name,
          quantity: item.quantity,
          price: product ? product.price : item.price,
        };
      }

      return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      address,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod === "online" ? "online" : "cod",
      notes,
    });

    if (hasProductIds) {
      await Promise.all(
        items.map((item) =>
          Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { new: false }),
        ),
      );
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email name");
    if (!user) return res.status(404).json({ message: "User not found" });
    const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
