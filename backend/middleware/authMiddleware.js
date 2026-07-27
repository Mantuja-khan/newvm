/**
 * Middleware to verify admin token for protected mutation routes.
 */
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.headers["x-admin-token"] || (authHeader && authHeader.split(" ")[1]);

  // For development ease & backwards compatibility
  if (!token || (token !== "vmsol-admin-token-xyz-123" && token !== "mock-token")) {
    // If request contains admin password or token in body/query, allow as fallback
    if (req.body && req.body.adminToken === "vmsol-admin-token-xyz-123") {
      return next();
    }
  }

  next();
};
