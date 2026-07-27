import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for local development and production VPS (vmsolutiions.com & api.vmsolutiions.com)
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5001",
  "http://localhost:3000",
  "http://vmsolutiions.com",
  "https://vmsolutiions.com",
  "http://www.vmsolutiions.com",
  "https://www.vmsolutiions.com",
  "http://api.vmsolutiions.com",
  "https://api.vmsolutiions.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman, or same-domain production requests)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for seamless production deployment
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB Connection Status Route
app.get("/api/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "Disconnected",
    1: "Connected (Active)",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.json({
    connected: state === 1,
    readyState: state,
    statusText: states[state] || "Unknown",
    dbName: mongoose.connection.name || "vmsolutiions",
    host: mongoose.connection.host || "127.0.0.1",
    mongoUri: process.env.MONGO_URI ? "Configured in .env" : "Default Local",
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    dbConnected: mongoose.connection.readyState === 1,
    domain: "api.vmsolutiions.com",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);

// Static frontend build serving (for standalone VPS single-port hosting)
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Error Handler
app.use(errorHandler);

// Start Server with MongoDB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 VM Solutiions Backend running on port ${PORT}`);
    console.log(`🌐 API Domain: https://api.vmsolutiions.com/api`);
    console.log(`🍃 MongoDB Connection: ${mongoose.connection.readyState === 1 ? "CONNECTED (Active)" : "Connecting..."}`);
  });
});
