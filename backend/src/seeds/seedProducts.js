import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
const PRODUCTS_PER_CATEGORY = 10;

async function run() {
  try {
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    const categories = await Category.find().lean();
    if (categories.length === 0) {
      console.log("No categories found. Seed categories first.");
      process.exit(0);
    }

    for (const category of categories) {
      const existingCount = await Product.countDocuments({ category: category._id });
      const remaining = PRODUCTS_PER_CATEGORY - existingCount;

      if (remaining <= 0) {
        console.log(`Category "${category.name}" already has ${existingCount} products. Skipping.`);
        continue;
      }

      const newProducts = [];

      for (let i = 1; i <= remaining; i++) {
        newProducts.push({
          name: `${category.name} Item ${existingCount + i}`,
          price: Number((Math.random() * 20 + 1).toFixed(2)),
          stock: Math.floor(Math.random() * 50) + 10,
          category: category._id,
          description: `Sample product ${existingCount + i} in ${category.name}`,
          imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(
            category.name,
          )}+${existingCount + i}`,
          isActive: true,
        });
      }

      const created = await Product.insertMany(newProducts);
      console.log(
        `Created ${created.length} products for category "${category.name}" (now ${existingCount + created.length} total).`,
      );
    }

    console.log("Product seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("Product seeding failed:", err.message);
    process.exit(1);
  }
}

run();
