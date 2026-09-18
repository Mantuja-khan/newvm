import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vmsolutiions";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(
      `⚠️ Primary MONGO_URI connection error (${error.message}). Connecting to local MongoDB...`,
    );
    try {
      await mongoose.disconnect();
      const conn = await mongoose.connect("mongodb://127.0.0.1:27017/vmsolutiions", {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`🍃 Local MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`❌ MongoDB Connection Failed: ${fallbackErr.message}`);
      return null;
    }
  }
};
