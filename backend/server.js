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

const allowedOrigins = [
  "https://vmsolutions.com",
  "https://www.vmsolutions.com",
  "https://vmsolutiions.com",
  "https://www.vmsolutiions.com",
  "http://localhost:8081",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-token", "Origin", "Accept", "X-Requested-With"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static frontend build and public asset paths
const outputPublicPath = path.join(__dirname, "..", ".output", "public");
const distPath = path.join(__dirname, "..", "dist");
const publicPath = path.join(__dirname, "..", "public");

// Favicon Explicit Safe Handler (Prevents 500 Internal Server Errors)
app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
  const candidates = [
    path.join(outputPublicPath, "favicon.ico"),
    path.join(distPath, "favicon.ico"),
    path.join(publicPath, "favicon.ico"),
    path.join(outputPublicPath, "favicon.png"),
    path.join(distPath, "favicon.png"),
    path.join(publicPath, "favicon.png"),
  ];

  for (const fav of candidates) {
    if (fs.existsSync(fav)) {
      return res.sendFile(fav);
    }
  }
  return res.status(204).end();
});

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

// Register static file directories
if (fs.existsSync(outputPublicPath)) {
  app.use(express.static(outputPublicPath));
}

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Fallback SPA routing for frontend URLs (Express 5 compatible)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();

  const candidates = [
    path.join(outputPublicPath, "index.html"),
    path.join(distPath, "index.html"),
    path.join(__dirname, "..", "index.html"),
  ];

  for (const indexPath of candidates) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
          return res
            .status(200)
            .send(
              "<!DOCTYPE html><html><head><title>VM Solutiions</title></head><body><div id='root'></div></body></html>",
            );
        }
      });
    }
  }

  return res
    .status(200)
    .send(
      "<!DOCTYPE html><html><head><title>VM Solutiions</title></head><body><div id='root'></div></body></html>",
    );
});

// Error Handler
app.use(errorHandler);

// Start Server with MongoDB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 VM Solutiions Backend running on port ${PORT}`);
    console.log(`🌐 API Domain: https://api.vmsolutiions.com/api`);
    console.log(
      `🍃 MongoDB Connection: ${mongoose.connection.readyState === 1 ? "CONNECTED (Active)" : "Connecting..."}`,
    );
  });
});
