import express from "express";
import {
  getAllProducts,
  getProductById,
  saveBulkOrSingleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { validateProductPayload } from "../middleware/productValidator.js";

const router = express.Router();

// GET all products or filter by query (type, cat, search)
router.get("/", getAllProducts);

// GET single product by ID or slug
router.get("/:id", getProductById);

// POST bulk or single product save
router.post("/", verifyAdmin, validateProductPayload, saveBulkOrSingleProducts);

// POST explicit single hardware/software product creation for admin
router.post("/single", verifyAdmin, validateProductPayload, createProduct);

// PUT update product by ID
router.put("/:id", verifyAdmin, validateProductPayload, updateProduct);

// DELETE product by ID
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
