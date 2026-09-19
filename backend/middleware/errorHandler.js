/**
 * Centralized error handler middleware.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Backend Error:", err);
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    success: false,
  });
};

