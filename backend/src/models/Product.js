import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
