import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import Category from "../models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

const DEFAULT_CATEGORIES = [
  {
    name: "Fruits & Vegetables",
    description: "Fresh fruits and vegetables for everyday cooking",
    isActive: true,
    icon: "🥬",
    color: "hsl(120, 50%, 92%)",
  },
  {
    name: "Dairy & Eggs",
    description: "Milk, yogurt, cheese, and eggs",
    isActive: true,
    icon: "🥛",
    color: "hsl(45, 80%, 92%)",
  },
  {
    name: "Snacks",
    description: "Quick bites, chips, and munchies",
    isActive: true,
    icon: "🍿",
    color: "hsl(15, 80%, 92%)",
  },
  {
    name: "Beverages",
    description: "Juices, soft drinks, and more",
    isActive: true,
    icon: "🥤",
    color: "hsl(200, 70%, 92%)",
  },
  {
    name: "Personal Care",
    description: "Daily personal and hygiene essentials",
    isActive: true,
    icon: "🧴",
    color: "hsl(300, 50%, 92%)",
  },
  {
    name: "Household",
    description: "Home cleaning and household supplies",
    isActive: true,
    icon: "🏠",
    color: "hsl(30, 60%, 92%)",
  },
  {
    name: "Bakery",
    description: "Breads, buns, and baked treats",
    isActive: true,
    icon: "🍞",
    color: "hsl(35, 80%, 92%)",
  },
  {
    name: "Meat & Fish",
    description: "Fresh meat, poultry, and seafood",
    isActive: true,
    icon: "🥩",
    color: "hsl(0, 60%, 92%)",
  },
];

async function run() {
  try {
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    for (const cat of DEFAULT_CATEGORIES) {
      const existing = await Category.findOne({ name: cat.name });
      if (existing) {
        console.log(`Category already exists: ${cat.name}`);
        continue;
      }
      const created = await Category.create(cat);
      console.log("Category created:", created.name);
    }

    console.log("Category seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("Category seeding failed:", err.message);
    process.exit(1);
  }
}

run();
