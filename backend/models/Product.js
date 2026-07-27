import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["hardware", "software", "cloud"], default: "hardware" },
    cat: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String, default: "" },
    discount: { type: String, default: "" },
    rating: { type: String, default: "4.6" },
    reviewsCount: { type: String, default: "100" },
    tag: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    condition: { type: String, default: "" },
    warranty: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
