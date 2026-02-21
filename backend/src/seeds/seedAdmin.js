import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@quickglow.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists:", ADMIN_EMAIL);
      process.exit(0);
    }
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });
    console.log("Admin seeded:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

run();
