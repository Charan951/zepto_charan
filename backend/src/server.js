import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminCategoryRoutes from "./routes/adminCategories.js";
import adminProductRoutes from "./routes/adminProducts.js";
import adminOrderRoutes from "./routes/adminOrders.js";
import orderRoutes from "./routes/orders.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quickglow";
const NODE_ENV = process.env.NODE_ENV || "development";

const corsOptions = {
  origin(origin, callback) {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/api/health", (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.json({ status: "ok", dbConnected: dbReady });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/admin/categories", requireAuth, requireRole("admin"), adminCategoryRoutes);
app.use("/api/admin/products", requireAuth, requireRole("admin"), adminProductRoutes);
app.use("/api/admin/orders", requireAuth, requireRole("admin"), adminOrderRoutes);
app.use("/api/orders", orderRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
