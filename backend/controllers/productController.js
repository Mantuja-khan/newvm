import Product from "../models/Product.js";

/**
 * GET /api/products
 * Fetch products from MongoDB
 */
export const getAllProducts = async (req, res) => {
  try {
    const { cat, type, search } = req.query;
    let query = {};
    if (type) query.type = type;
    if (cat && cat !== "all") query.cat = cat;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { tag: regex }, { brand: regex }, { desc: regex }];
    }
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * GET /api/products/:id
 * Fetch single product by ID or slugified name from MongoDB
 */
export const getProductById = async (req, res) => {
  try {
    const targetId = req.params.id;
    let product = await Product.findOne({ id: targetId }).lean();
    if (!product) {
      const slugRegex = new RegExp(`^${targetId.replace(/-/g, ".*")}$`, "i");
      product = await Product.findOne({ name: slugRegex }).lean();
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "Server error fetching product" });
  }
};

/**
 * POST /api/products
 * Saves full products array (bulk) or single product to MongoDB
 */
export const saveBulkOrSingleProducts = async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      await Product.deleteMany({});
      if (payload.length > 0) {
        await Product.insertMany(payload);
      }
      return res.json({ success: true, message: "Products database updated successfully" });
    }

    // Single product
    const newProduct = {
      ...payload,
      id: payload.id || `${payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
      images: payload.images && payload.images.length > 0 ? payload.images : [payload.image || ""],
      features: payload.features || [],
      specs: payload.specs || {},
    };

    const saved = await Product.findOneAndUpdate({ id: newProduct.id }, newProduct, { upsert: true, new: true });
    res.status(201).json({ success: true, message: "Product saved successfully", product: saved });
  } catch (error) {
    console.error("Error in saveBulkOrSingleProducts:", error);
    res.status(500).json({ error: "Failed to save product" });
  }
};

/**
 * POST /api/products/single
 * Explicit single product creation endpoint
 */
export const createProduct = async (req, res) => {
  try {
    const payload = req.body;
    const newProduct = {
      ...payload,
      id: payload.id || `${payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
      type: payload.type || "hardware",
      cat: payload.cat || "desktops",
      images: payload.images && payload.images.length > 0 ? payload.images : [payload.image || ""],
      features: payload.features || [],
      specs: payload.specs || {},
      inStock: payload.inStock !== false,
    };

    const created = await Product.create(newProduct);
    res.status(201).json({ success: true, message: "Hardware product created successfully", product: created });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ error: "Failed to create hardware product" });
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product by ID in MongoDB
 */
export const updateProduct = async (req, res) => {
  try {
    const targetId = req.params.id;
    const payload = req.body;

    const updated = await Product.findOneAndUpdate({ id: targetId }, { $set: payload }, { new: true });
    if (updated) {
      return res.json({ success: true, message: "Product updated successfully", product: updated });
    }

    res.status(404).json({ error: "Product not found to update" });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product by ID from MongoDB
 */
export const deleteProduct = async (req, res) => {
  try {
    const targetId = req.params.id;
    await Product.deleteOne({ id: targetId });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
