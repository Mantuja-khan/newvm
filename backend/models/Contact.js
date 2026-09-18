import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "New Contact Inquiry" },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true },
);

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
