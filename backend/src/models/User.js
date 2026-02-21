import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
export default User;
