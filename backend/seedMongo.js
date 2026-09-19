import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.js";
import Pricing from "./models/Pricing.js";
import Review from "./models/Review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGO_URI;

const initialProducts = [
  {
    id: "tally-prime-silver",
    type: "software",
    cat: "tally",
    name: "Tally Prime — Silver",
    price: "₹22,500",
    originalPrice: "₹25,000",
    discount: "10% off",
    rating: "4.6",
    reviewsCount: "184",
    tag: "Single User",
    desc: "Genuine Tally Prime Silver license for single desktop user with 1 year TSS upgrade and priority support.",
    image: "/tally-logo.png",
    images: ["/tally-logo.png"],
    brand: "Tally Solutions",
    warranty: "1 Year Free TSS & Support",
    inStock: true,
    specs: {
      "User License": "Single User (1 PC)",
      "OS Compatibility": "Windows 7/8/10/11",
      "GST Ready": "Yes (E-invoicing, E-way bill, GSTR-1, GSTR-3B)",
      "Updates": "1 Year Free TSS (Tally Software Service)",
      "Support": "On-site & Remote Desktop Assistance",
    },
  },
  {
    id: "tally-prime-gold",
    type: "software",
    cat: "tally",
    name: "Tally Prime — Gold",
    price: "₹67,500",
    originalPrice: "₹75,000",
    discount: "10% off",
    rating: "4.8",
    reviewsCount: "320",
    tag: "Multi User",
    desc: "Unlimited multi-user license for LAN environment with priority support and TSS updates.",
    image: "/tally-logo.png",
    images: ["/tally-logo.png"],
    brand: "Tally Solutions",
    warranty: "1 Year Free TSS & Support",
    inStock: true,
    specs: {
      "User License": "Unlimited Multi-User (LAN)",
      "OS Compatibility": "Windows Server / 10 / 11",
      "GST Ready": "Yes (Multi-location & Multi-branch)",
      "Updates": "1 Year Free TSS",
      "Support": "Priority Remote & On-site Support",
    },
  },
  {
    id: "tally-aws-1user",
    type: "cloud",
    cat: "cloud",
    name: "Tally on AWS Cloud — 1 User Plan",
    price: "₹600 / mo",
    originalPrice: "₹800 / mo",
    discount: "25% Off",
    rating: "4.9",
    reviewsCount: "95",
    tag: "1 User AWS Cloud",
    desc: "High-performance Tally on AWS cloud hosting for 1 user. Access Tally from anywhere, anytime on any device. Includes automated daily backups.",
    image: "/tally-aws-logo.png",
    images: ["/tally-aws-logo.png"],
    brand: "Amazon Web Services",
    warranty: "99.9% Uptime Guarantee",
    inStock: true,
    specs: {
      "User Limit": "1 User Base",
      "Cloud Provider": "Amazon Web Services (AWS)",
      "Pricing": "₹600 / month per user + GST",
      "Backup": "Daily Automated Snapshot",
    },
  },
  {
    id: "tally-aws-2users",
    type: "cloud",
    cat: "cloud",
    name: "Tally on AWS Cloud — 2 Users Plan",
    price: "₹1,200 / mo",
    originalPrice: "₹1,600 / mo",
    discount: "25% Off",
    rating: "4.9",
    reviewsCount: "112",
    tag: "2 Users AWS Cloud",
    desc: "Tally on AWS cloud hosting plan for 2 simultaneous users. Instant printing, local drive integration, and ultra-fast Tally report loading speed.",
    image: "/tally-aws-logo.png",
    images: ["/tally-aws-logo.png"],
    brand: "Amazon Web Services",
    warranty: "99.9% Uptime Guarantee",
    inStock: true,
    specs: {
      "User Limit": "2 Users Base",
      "Cloud Provider": "AWS Cloud",
      "Pricing": "₹1,200 / month (+ GST)",
      "Security": "RDP SSL Encryption & Firewall",
    },
  },
  {
    id: "tally-aws-4users",
    type: "cloud",
    cat: "cloud",
    name: "Tally on AWS Cloud — 4 Users Plan",
    price: "₹1,800 / mo",
    originalPrice: "₹2,400 / mo",
    discount: "25% Off",
    rating: "4.9",
    reviewsCount: "88",
    tag: "4 Users AWS Cloud",
    desc: "Special multi-user Tally on AWS cloud bundle for 4 accountants/users. Dedicated RAM & vCPU allocation for heavy transaction volumes.",
    image: "/tally-aws-logo.png",
    images: ["/tally-aws-logo.png"],
    brand: "Amazon Web Services",
    warranty: "99.9% Uptime Guarantee",
    inStock: true,
    specs: {
      "User Limit": "4 Users Base",
      "Cloud Provider": "AWS Cloud",
      "Pricing": "₹1,800 / month (+ GST)",
      "Performance": "High IOPS NVMe SSD",
    },
  },
  {
    id: "busy-standard-21",
    type: "software",
    cat: "busy",
    name: "BUSY Standard Edition",
    price: "₹16,500",
    originalPrice: "₹18,500",
    discount: "11% off",
    rating: "4.7",
    reviewsCount: "165",
    tag: "Standard Edition",
    desc: "Advanced GST invoicing, inventory management, e-way bill generation and order processing.",
    image: "/busy-logo.png",
    images: ["/busy-logo.png"],
    brand: "BUSY Accounting",
    warranty: "1 Year Support",
    inStock: true,
    specs: {
      "Edition": "Standard 21",
      "Features": "Inventory, Multi-location, GST, E-way Bill",
      "OS": "Windows 10/11",
      "Renewal": "₹6,500 + GST",
    },
  },
  {
    id: "busy-enterprise-edition",
    type: "software",
    cat: "busy",
    name: "BUSY Enterprise Edition",
    price: "₹22,000",
    originalPrice: "₹25,000",
    discount: "12% off",
    rating: "4.9",
    reviewsCount: "180",
    tag: "Enterprise Edition",
    desc: "Full-featured enterprise accounting with payroll, approval workflow and advanced audit control.",
    image: "/busy-logo.png",
    images: ["/busy-logo.png"],
    brand: "BUSY Accounting",
    warranty: "1 Year Support",
    inStock: true,
    specs: {
      "Edition": "Enterprise",
      "Features": "Payroll, Multi-branch, Audit Trial, Mobile App",
      "OS": "Windows 10/11/Server",
    },
  },
  {
    id: "dell-latitude-laptop",
    type: "hardware",
    cat: "laptops",
    name: "Dell Latitude Business Laptop",
    price: "₹54,999",
    originalPrice: "₹65,000",
    discount: "15% off",
    rating: "4.8",
    reviewsCount: "92",
    tag: "Commercial Series",
    desc: "Intel Core i5 13th Gen, 16GB RAM, 512GB NVMe SSD, Windows 11 Pro, 14 inch FHD Anti-Glare Display.",
    image: "/laptop-hero.png",
    images: ["/laptop-hero.png"],
    brand: "Dell",
    warranty: "3 Years Onsite ProSupport",
    inStock: true,
    specs: {
      "Processor": "Intel Core i5-1335U (10 Cores, up to 4.60 GHz)",
      "RAM": "16GB DDR5 4800MHz",
      "Storage": "512GB M.2 PCIe NVMe SSD",
      "OS": "Windows 11 Professional 64-bit",
      "Display": "14.0\" FHD (1920 x 1080) Anti-Glare",
    },
  },
  {
    id: "hp-prodesk-desktop",
    type: "hardware",
    cat: "desktops",
    name: "HP ProDesk Commercial Desktop",
    price: "₹46,500",
    originalPrice: "₹52,000",
    discount: "10% off",
    rating: "4.7",
    reviewsCount: "74",
    tag: "Office Desktop",
    desc: "Intel Core i5 12th Gen, 16GB RAM, 512GB SSD + 1TB HDD, 21.5\" FHD Monitor, Keyboard & Mouse Included.",
    image: "/laptop-hero.png",
    images: ["/laptop-hero.png"],
    brand: "HP",
    warranty: "3 Years Next Business Day Onsite",
    inStock: true,
    specs: {
      "Processor": "Intel Core i5-12400 (6 Cores, up to 4.40 GHz)",
      "RAM": "16GB DDR4",
      "Storage": "512GB SSD + 1TB HDD",
      "Form Factor": "Microtower / Small Form Factor",
      "Included": "21.5\" HP Borderless Monitor, Wired USB KB/Mouse",
    },
  },
];

const initialPricing = {
  busy: [
    { variant: "Basic Edition (Single User)", activation: "₹9,000 + 18% GST", renewal: "₹3,500 + 18% GST / yr" },
    { variant: "Standard Edition (Single User)", activation: "₹16,500 + 18% GST", renewal: "₹6,500 + 18% GST / yr" },
    { variant: "Enterprise Edition (Single User)", activation: "₹22,000 + 18% GST", renewal: "₹8,500 + 18% GST / yr" },
    { variant: "Standard Multi-User (LAN)", activation: "₹39,000 + 18% GST", renewal: "₹14,000 + 18% GST / yr" },
    { variant: "Enterprise Multi-User (LAN)", activation: "₹52,000 + 18% GST", renewal: "₹19,000 + 18% GST / yr" },
  ],
  tally: [
    { variant: "Tally Prime Silver (Single User)", activation: "₹22,500 + 18% GST", renewal: "₹5,400 + 18% GST / yr (TSS)" },
    { variant: "Tally Prime Gold (Multi User)", activation: "₹67,500 + 18% GST", renewal: "₹16,200 + 18% GST / yr (TSS)" },
    { variant: "Tally on AWS Cloud (1 User)", activation: "₹600 / mo + GST", renewal: "₹7,200 / yr + GST" },
    { variant: "Tally on AWS Cloud (2 Users)", activation: "₹1,200 / mo + GST", renewal: "₹14,400 / yr + GST" },
    { variant: "Tally on AWS Cloud (4 Users)", activation: "₹1,800 / mo + GST", renewal: "₹21,600 / yr + GST" },
    { variant: "Tally on Dedicated Server (10+ Users)", activation: "₹4,500 / mo + GST", renewal: "Custom SLA Support Included" },
  ],
};

const initialReviews = [
  {
    id: "rev-1",
    name: "Rajesh Sharma",
    role: "Director, Shree Enterprises Bhiwadi",
    rating: 5,
    text: "VM Solutiions handled our Tally Prime multi-user deployment and AWS cloud setup seamlessly. Zero downtime and super responsive support whenever we need assistance!",
    slug: "general",
    date: new Date().toISOString(),
  },
  {
    id: "rev-2",
    name: "Sunil Verma",
    role: "Finance Manager, Aurevia Organics",
    rating: 5,
    text: "Best IT partner in NCR for accounting software and IT hardware. They set up our entire office network and Dell workstations at very competitive pricing.",
    slug: "general",
    date: new Date().toISOString(),
  },
  {
    id: "rev-3",
    name: "Manoj Goyal",
    role: "Managing Director, DS Engineering Works",
    rating: 5,
    text: "Excellent web development and corporate IT support. Highly recommend Vishal ji and the VM Solutiions team for any business IT infrastructure needs.",
    slug: "general",
    date: new Date().toISOString(),
  },
];

async function seedDatabase() {
  console.log("🚀 Initializing MongoDB Atlas Seeding directly from .env...");

  if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing in environment variables!");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "vmsolutiions",
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`🍃 Connected to MongoDB Atlas! Database: "${mongoose.connection.name}"`);

    // 1. Seed Products
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(initialProducts);
    console.log(`✅ Seeded ${insertedProducts.length} live products into MongoDB Atlas!`);

    // 2. Seed Pricing
    await Pricing.deleteMany({});
    await Pricing.create(initialPricing);
    console.log("✅ Seeded live pricing matrix into MongoDB Atlas!");

    // 3. Seed Reviews
    await Review.deleteMany({});
    const insertedReviews = await Review.insertMany(initialReviews);
    console.log(`✅ Seeded ${insertedReviews.length} customer reviews into MongoDB Atlas!`);

    console.log("\n🎉 LIVE MONGODB ATLAS POPULATED WITH REAL TIME DATA SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB Atlas Seeding Error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
