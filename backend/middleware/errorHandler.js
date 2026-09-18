/**
 * Centralized error handler middleware.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Backend Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    success: false,
  });
};
