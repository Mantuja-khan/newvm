import Pricing from "../models/Pricing.js";

export const getPricing = async (req, res) => {
  try {
    const pricing = await Pricing.findOne().lean();
    if (pricing) return res.json({ busy: pricing.busy || [], tally: pricing.tally || [] });
    res.json({ busy: [], tally: [] });
  } catch (error) {
    console.error("Error in getPricing:", error);
    res.status(500).json({ error: "Failed to fetch pricing data" });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const pricing = req.body;
    if (!pricing || typeof pricing !== "object" || (!pricing.busy && !pricing.tally)) {
      return res.status(400).json({ error: "Invalid pricing schema" });
    }

    await Pricing.deleteMany({});
    await Pricing.create(pricing);

    res.json({ success: true, message: "Pricing charts updated successfully" });
  } catch (error) {
    console.error("Error in updatePricing:", error);
    res.status(500).json({ error: "Failed to update pricing" });
  }
};
