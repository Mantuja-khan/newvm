import express from "express";
import { getPricing, updatePricing } from "../controllers/pricingController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPricing);
router.post("/", verifyAdmin, updatePricing);

export default router;
