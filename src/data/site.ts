import { FaLaptopCode, FaCloud, FaLaptop, FaCalculator, FaHeadset } from "react-icons/fa";
import type { IconType } from "react-icons";
import imgWeb from "@/assets/web-design-hero.png";
import imgBusy from "@/assets/svc-image-3.png.asset.json";
import imgCloud from "@/assets/cloud-services-hero.png";
import imgLaptop from "@/assets/laptop-hero.png";
import imgNiraajPack from "@/assets/niraaj-pack-hero.png";
import imgGarvEnterprises from "@/assets/garv-enterprises-hero.png";
import imgBombayDryCleaners from "@/assets/bombay-dry-cleaners-hero.png";
import imgSunStar from "@/assets/sun-star-hero.png";
import imgIasGroups from "@/assets/ias-groups-hero.png";
import imgTrivoxoToys from "@/assets/trivoxo-toys.png";
import imgSukohTech from "@/assets/sukoh-tech.png";
import imgOjasPharma from "@/assets/ojas-pharma.png";
import imgJalvinderComputer from "@/assets/jalvinder-computer.png";
import imgRengoAutomotives from "@/assets/rengo-automotives.png";
import imgDsEngg from "@/assets/ds-engg.png";
import imgShreeEnterprises from "@/assets/shree-enterprises.png";
import imgTallyLogo from "@/assets/tally-logo.png";

export const BRAND = {
  name: "VM Solutiions",
  full: "VM Solutiions",
  tagline: "Empowering Business Through Technology",
  phone: "93588-53990",
  phoneRaw: "919358853990",
  email: "vishalvmsolutiions@gmail.com",
  address: "F-GF, 70,71 , Capital High Street , Phool Bagh , Bhiwadi ,Alwar-(Raj.)",
  hours: "Mon – Sat  •  10:00 AM – 6:00 PM",
  foundedDate: "19 Feb 2026",
  socials: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: IconType;
  image?: string;
  images?: string[];
  features: string[];
  benefits: { title: string; text: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "web-development",
    title: "Website Designing & Development",
    short: "Modern, responsive websites and web apps engineered for growth.",
    image: imgWeb,
    description:
      "From marketing sites to full-scale web applications, we design and build fast, secure, SEO-friendly experiences that convert visitors into customers.",
    icon: FaLaptopCode,
    features: [
      "Custom UI/UX Design",
      "Responsive & Mobile-first",
      "E-commerce Solutions",
      "CMS (WordPress, Headless)",
      "SEO & Performance Optimized",
      "Ongoing Maintenance & Support",
    ],
    benefits: [
      { title: "Conversion-driven Design", text: "Layouts crafted around clear goals and measurable outcomes." },
      { title: "Blazing Fast Loading", text: "Optimized assets, CDN delivery and Core Web Vitals scores." },
      { title: "Scalable Architecture", text: "Codebases that grow with your business without rewrites." },
    ],
  },
  {
    slug: "tally-busy",
    title: "Tally & BUSY Software",
    short: "Sales, installation, training and priority support for Tally & BUSY.",
    description:
      "End-to-end accounting solutions — from licensing and installation to customization, GST compliance, migration and hands-on training for your team.",
    icon: FaCalculator,
    image: imgTallyLogo,
    images: [imgTallyLogo, imgBusy.url],
    features: [
      "Genuine Tally Prime & BUSY Licenses",
      "Installation & Configuration",
      "Data Migration & Backup",
      "GST, TDS & E-invoice Setup",
      "On-site & Remote Training",
      "Priority Tech Support",
    ],
    benefits: [
      { title: "Accounting Experts", text: "Priority support channels and complete setup assistance." },
      { title: "Faster Book Closure", text: "Streamlined workflows and automated reconciliations." },
      { title: "Compliance Ready", text: "Always up-to-date with GST and statutory changes." },
    ],
  },
  {
    slug: "cloud-services",
    title: "Cloud Services & Tally on AWS",
    short: "Cloud hosting, Tally on AWS, backup, email, VPS and dedicated servers.",
    description:
      "Enterprise-grade cloud infrastructure — hosted email, secure backups, high-availability VPS and fully-managed dedicated Tally on AWS servers with 99.9% uptime SLA.",
    icon: FaCloud,
    image: imgCloud,
    features: [
      "Tally on AWS Cloud Hosting",
      "Managed VPS & Dedicated Servers",
      "Business Email Hosting",
      "Automated Cloud Backups",
      "SSL, CDN & DDoS Protection",
      "Migration Without Downtime",
    ],
    benefits: [
      { title: "99.9% Uptime SLA", text: "Reliable infrastructure monitored around the clock." },
      { title: "Indian & AWS Data Centers", text: "Low-latency hosting with data residency compliance." },
      { title: "Predictable Billing", text: "Transparent plans with no hidden overage charges." },
    ],
  },
  {
    slug: "laptops-desktops",
    title: "Laptop & Desktop Sales",
    short: "New and refurbished laptops, desktops and workstations.",
    description:
      "Quality-tested new and refurbished laptops and desktops from leading brands, backed by warranty, professional refurbishment and on-site service.",
    icon: FaLaptop,
    image: imgLaptop,
    features: [
      "Commercial Laptops & Desktops",
      "Certified Refurbished Devices",
      "1-Year Comprehensive Warranty",
      "Upgrade Services (RAM/SSD)",
      "On-site Repair & Servicing",
      "Data Recovery & Wipe",
    ],
    benefits: [
      { title: "Up to 60% Savings", text: "Enterprise-grade hardware at a fraction of the cost." },
      { title: "6-Point Quality Check", text: "Every device tested, cleaned and certified." },
      { title: "Free On-site Delivery", text: "Doorstep delivery and setup across NCR." },
    ],
  },
  {
    slug: "support",
    title: "24×7 Priority Support",
    short: "Round-the-clock helpdesk for critical business systems.",
    description:
      "Priority phone, chat and remote support with guaranteed response times — because your business can't wait.",
    icon: FaHeadset,
    features: [
      "15-Minute Response SLA",
      "Remote Desktop Support",
      "Emergency On-site Visits",
      "System Health Checks",
      "Data Backup Monitoring",
      "User Training & Onboarding",
    ],
    benefits: [
      { title: "Peace of Mind", text: "Experts standing by 24/7/365." },
      { title: "Faster Resolution", text: "85%+ issues resolved on first contact." },
      { title: "Flexible Plans", text: "Pay-as-you-go or monthly retainer options." },
    ],
  },
];

export const CLIENT_PORTFOLIO = [
  {
    title: "Niraaj Pack Tech",
    category: "Packaging Industry Web Application",
    image: imgNiraajPack,
    url: "https://niraajpacktech.com/",
  },
  {
    title: "Trivoxo Toys",
    category: "E-Commerce & Toy Manufacturing Site",
    image: imgTrivoxoToys,
    url: "https://trivoxotoys.com/",
  },
  {
    title: "Sukoh Tech",
    category: "IT Solutions & Software Development Portal",
    image: imgSukohTech,
    url: "https://sukoh-tech.com/",
  },
  {
    title: "Garv Enterprises",
    category: "Industrial Equipment & Hardware Site",
    image: imgGarvEnterprises,
    url: "https://garventerprises.com/",
  },
  {
    title: "Ojas Pharma",
    category: "Pharmaceutical Distribution & ERP Site",
    image: imgOjasPharma,
    url: "https://ojaspharma.com/",
  },
  {
    title: "Jalvinder Computers",
    category: "IT Retail & Hardware Hardware Store",
    image: imgJalvinderComputer,
    url: "https://jalvindercomputers.com/",
  },
  {
    title: "Rengo Automotives",
    category: "Automotive Parts & Services Site",
    image: imgRengoAutomotives,
    url: "https://rengoautomotives.com/",
  },
  {
    title: "IAS Groups",
    category: "Consulting & Corporate Website",
    image: imgIasGroups,
    url: "https://www.iasgroups.com/",
  },
  {
    title: "Sunstar Packers",
    category: "Packers & Movers Business Site",
    image: imgSunStar,
    url: "https://sunstarpackers.com/",
  },
  {
    title: "Bombay Dry Cleaners",
    category: "Laundry & Dry Cleaning Service Portal",
    image: imgBombayDryCleaners,
    url: "https://bombaydrycleaners.com/",
  },
  {
    title: "DS Engineering Works",
    category: "Engineering & Fabrication Site",
    image: imgDsEngg,
    url: "https://dsengineeringworks.com/",
  },
  {
    title: "Shree Enterprises",
    category: "Supplier & Trading Enterprise Site",
    image: imgShreeEnterprises,
    url: "https://shreeenterprises29.com/",
  },
];

export const PROJECTS = CLIENT_PORTFOLIO;

export type Product = {
  id?: string;
  type?: "software" | "hardware" | "cloud";
  cat: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: string;
  reviewsCount?: string;
  tag: string;
  desc: string;
  image?: string;
  images?: string[];
  features?: string[];
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  inStock?: boolean;
  specs?: Record<string, any>;
};

export const HARDWARE_CATEGORIES = [
  { id: "all", name: "All Hardware" },
  { id: "laptops", name: "Laptops" },
  { id: "desktops", name: "Desktops" },
  { id: "workstations", name: "Workstations" },
  { id: "accessories", name: "Printers & Accessories" },
];

export const SOFTWARE_CATEGORIES = [
  { id: "all", name: "All Software" },
  { id: "tally", name: "Tally Software" },
  { id: "busy", name: "BUSY Software" },
  { id: "cloud", name: "Cloud & Hosting" },
];

export const CATEGORIES = [
  { id: "software", name: "Software" },
  { id: "hardware", name: "Hardware (Laptops & Desktops)" },
  { id: "cloud", name: "Cloud Solutions" },
];

export const PRODUCTS: Product[] = [
  {
    id: "tally-prime-silver",
    type: "software",
    cat: "software",
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
      "Support": "On-site & Remote Desktop Assistance"
    }
  },
  {
    id: "tally-prime-gold",
    type: "software",
    cat: "software",
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
      "Support": "Priority Remote & On-site Support"
    }
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
      "Backup": "Daily Automated Snapshot"
    }
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
      "Security": "RDP SSL Encryption & Firewall"
    }
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
      "Performance": "High IOPS NVMe SSD"
    }
  },
  {
    id: "busy-standard-21",
    type: "software",
    cat: "software",
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
      "Renewal": "₹6,500 + GST"
    }
  },
  {
    id: "busy-enterprise-edition",
    type: "software",
    cat: "software",
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
      "Edition": "Enterprise 21",
      "Features": "Payroll, Access Control, Voucher Approval, Multi-Branch",
      "OS": "Windows 10/11 / Server",
      "Renewal": "₹7,500 + GST"
    }
  }
];
