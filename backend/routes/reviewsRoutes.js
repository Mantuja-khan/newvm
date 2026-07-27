import express from "express";
import { getReviews, addReview } from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", addReview);

export default router;
