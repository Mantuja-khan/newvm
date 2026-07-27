/**
 * Validates single product payload for hardware or software products.
 */
export const validateProductPayload = (req, res, next) => {
  const product = req.body;

  if (Array.isArray(product)) {
    // Bulk list save request
    return next();
  }

  if (!product || typeof product !== "object") {
    return res.status(400).json({ error: "Invalid product payload" });
  }

  if (!product.name || typeof product.name !== "string" || !product.name.trim()) {
    return res.status(400).json({ error: "Product name is required." });
  }

  if (!product.price || typeof product.price !== "string") {
    return res.status(400).json({ error: "Product selling price is required." });
  }

  // Ensure default arrays and objects exist
  if (!Array.isArray(product.images)) {
    product.images = product.image ? [product.image] : [];
  }
  if (!Array.isArray(product.features)) {
    product.features = [];
  }
  if (!product.specs || typeof product.specs !== "object") {
    product.specs = {};
  }

  next();
};
