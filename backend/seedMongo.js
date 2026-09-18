import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.js";
import Pricing from "./models/Pricing.js";
import Review from "./models/Review.js";
import Contact from "./models/Contact.js";
import { readJsonFile } from "./utils/fileDb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://mantujak_db_user:yzR4ioMUH2rZV8uR@vmsolutiions.wl3o15i.mongodb.net/vmsolutiions?retryWrites=true&w=majority";

async function seedDatabase() {
  console.log("🚀 Initializing MongoDB Atlas Seeding Script...");
  console.log(`Connecting to: ${MONGO_URI.replace(/:[^:@]+@/, ":****@")}`);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`🍃 Connected to MongoDB Atlas! Database Name: "${mongoose.connection.name}"`);

    // 1. Seed Products
    const productsData = readJsonFile("products.json", []);
    if (productsData.length > 0) {
      console.log(`📦 Found ${productsData.length} products in backend/products.json`);
      await Product.deleteMany({});
      const insertedProducts = await Product.insertMany(productsData);
      console.log(`✅ Successfully seeded ${insertedProducts.length} products into MongoDB Atlas!`);
    } else {
      console.log("ℹ️ No products found in products.json");
    }

    // 2. Seed Pricing Matrix
    const pricingData = readJsonFile("pricing.json", { busy: [], tally: [] });
    if (pricingData && (pricingData.busy?.length > 0 || pricingData.tally?.length > 0)) {
      console.log("💰 Found pricing charts in backend/pricing.json");
      await Pricing.deleteMany({});
      await Pricing.create(pricingData);
      console.log("✅ Successfully seeded Tally & BUSY pricing matrix into MongoDB Atlas!");
    }

    // 3. Seed Reviews
    const reviewsData = readJsonFile("reviews.json", []);
    if (reviewsData.length > 0) {
      console.log(`⭐ Found ${reviewsData.length} customer reviews in backend/reviews.json`);
      await Review.deleteMany({});
      await Review.insertMany(reviewsData);
      console.log(`✅ Successfully seeded ${reviewsData.length} reviews into MongoDB Atlas!`);
    }

    // 4. Seed Contacts
    const contactsData = readJsonFile("contacts.json", []);
    if (contactsData.length > 0) {
      console.log(`✉️ Found ${contactsData.length} contact submissions in backend/contacts.json`);
      await Contact.deleteMany({});
      await Contact.insertMany(contactsData);
      console.log(
        `✅ Successfully seeded ${contactsData.length} contact records into MongoDB Atlas!`,
      );
    }

    console.log(
      "\n🎉 ALL JSON DATA HAS BEEN MIGRATED AND CONNECTED TO MONGODB ATLAS SUCCESSFULLY!",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB Atlas Seeding Error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
