import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: "Verified Customer" },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    slug: { type: String, default: "general" },
    date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true },
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
