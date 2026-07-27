import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    busy: { type: [mongoose.Schema.Types.Mixed], default: [] },
    tally: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Pricing || mongoose.model("Pricing", pricingSchema);
