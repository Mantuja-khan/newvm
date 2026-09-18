import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaCloud, FaSearch, FaTable } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { PRODUCTS, BRAND } from "@/data/site";
import { API_BASE } from "@/config/api";
export const Route = createFileRoute("/software")({
  head: () => ({
    meta: [
      { title: "Software Products & Tally on AWS Cloud Pricing — VM Solutiions" },
      {
        name: "description",
        content:
          "Check complete Tally Prime, BUSY software editions, and Tally on AWS Cloud user-based pricing plans with 1 year upgrade and support.",
      },
    ],
  }),
  component: SoftwareProductsPage,
});
const TALLY_PRICING_TABLE = [
  {
    variant: "Tally Prime Silver (Single User)",
    activation: "₹22,500 + 18% GST",
    renewal: "₹4,500 + 18% GST",
    desc: "Single PC license for standalone accounting & GST invoicing.",
  },
  {
    variant: "Tally Prime Gold (Multi-User / LAN)",
    activation: "₹67,500 + 18% GST",
    renewal: "₹13,500 + 18% GST",
    desc: "Unlimited LAN multi-user license for multi-accountant offices.",
  },
];
const AWS_CLOUD_PRICING_TABLE = [
  {
    users: "1 User Plan",
    price: "₹600 / month (+ GST)",
    desc: "1 User cloud hosting on AWS with fast SSD & automated daily backups.",
  },
  {
    users: "2 Users Plan",
    price: "₹1,200 / month (+ GST)",
    desc: "2 Concurrent users cloud server with RDP printing & SSL security.",
  },
  {
    users: "4 Users Plan",
    price: "₹1,800 / month (+ GST)",
    desc: "4 Concurrent users cloud server with high IOPS NVMe SSD storage.",
  },
  {
    users: "Enterprise (5+ Users)",
    price: "From ₹450 / user / mo",
    desc: "Dedicated AWS cloud instance tailored for enterprise accounting teams.",
  },
];
const BUSY_PRICING_TABLE = [
  {
    edition: "Basic",
    variant: "Basic — Single User",
    activation: "₹11,000 + 18% GST",
    renewal: "₹4,000 + 18% GST",
  },
  {
    edition: "Basic",
    variant: "Basic — Multiple User",
    activation: "₹25,000 + 18% GST",
    renewal: "₹8,500 + 18% GST",
  },
  {
    edition: "Standard",
    variant: "Standard — Single User",
    activation: "₹16,500 + 18% GST",
    renewal: "₹6,500 + 18% GST",
  },
  {
    edition: "Standard",
    variant: "Standard — Multiple User",
    activation: "₹40,000 + 18% GST",
    renewal: "₹14,000 + 18% GST",
  },
  {
    edition: "Standard",
    variant: "Standard — Additional Count",
    activation: "₹10,500 + 18% GST",
    renewal: "₹4,000 + 18% GST",
  },
  {
    edition: "Enterprise",
    variant: "Enterprise — Single User",
    activation: "₹22,000 + 18% GST",
    renewal: "₹7,500 + 18% GST",
  },
  {
    edition: "Enterprise",
    variant: "Enterprise — Multiple User",
    activation: "₹58,000 + 18% GST",
    renewal: "₹17,000 + 18% GST",
  },
  {
    edition: "Enterprise",
    variant: "Enterprise — Additional Count",
    activation: "₹14,500 + 18% GST",
    renewal: "₹4,500 + 18% GST",
  },
  {
    edition: "Subscription",
    variant: "Blue — Single User (Annual)",
    activation: "₹5,000 + 18% GST / yr",
    renewal: "₹5,000 + 18% GST / yr",
  },
  {
    edition: "Subscription",
    variant: "Blue — Multiple User (Annual)",
    activation: "₹12,500 + 18% GST / yr",
    renewal: "₹12,500 + 18% GST / yr",
  },
  {
    edition: "Subscription",
    variant: "Saffron — Single User (Annual)",
    activation: "₹8,000 + 18% GST / yr",
    renewal: "₹8,000 + 18% GST / yr",
  },
  {
    edition: "Subscription",
    variant: "Saffron — Multiple User (Annual)",
    activation: "₹18,000 + 18% GST / yr",
    renewal: "₹18,000 + 18% GST / yr",
  },
  {
    edition: "Subscription",
    variant: "Emerald — Single User (Annual)",
    activation: "₹10,000 + 18% GST / yr",
    renewal: "₹10,000 + 18% GST / yr",
  },
  {
    edition: "Subscription",
    variant: "Emerald — Multiple User (Annual)",
    activation: "₹25,000 + 18% GST / yr",
    renewal: "₹25,000 + 18% GST / yr",
  },
];
function SoftwareProductsPage() {
  const defaultSw = PRODUCTS.filter(
    (p) => p.type === "software" || p.type === "cloud" || ["software", "cloud"].includes(p.cat),
  );
  const [productList, setProductList] = useState(defaultSw);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("catalog");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const combinedMap = new Map();
            defaultSw.forEach((p) => combinedMap.set(p.id || p.name, p));
            data.forEach((p) => {
              if (
                p.type === "software" ||
                p.type === "cloud" ||
                ["software", "cloud"].includes(p.cat)
              ) {
                combinedMap.set(p.id || p.name, p);
              }
            });
            setProductList(Array.from(combinedMap.values()));
          }
        }
      } catch (err) {
        console.log("Could not load software products from backend, using defaults.");
      }
    };
    fetchProducts();
  }, []);
  const filteredProducts = productList.filter((p) => {
    let matchesCategory = true;
    if (selectedCategory === "tally") {
      matchesCategory =
        p.name.toLowerCase().includes("tally") && !p.name.toLowerCase().includes("aws");
    } else if (selectedCategory === "busy") {
      matchesCategory = p.name.toLowerCase().includes("busy");
    } else if (selectedCategory === "aws") {
      matchesCategory = p.name.toLowerCase().includes("aws");
    } else if (selectedCategory === "cloud") {
      matchesCategory = p.cat === "cloud" || p.name.toLowerCase().includes("cloud");
    }
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <>
      <PageHero title="Software Licenses & Tally on AWS Cloud" crumb="Software & Cloud Products" />

      <section className="reveal py-16 bg-slate-50/50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Authorized Sales & Cloud Partner"
            title={
              <>
                Tally Prime, BUSY & <span className="text-primary">Tally on AWS Cloud</span>
              </>
            }
            subtitle="Genuine accounting software"
          />
          {/* Toggle View Tabs: Catalog Grid vs Full Price Matrix */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm inline-flex gap-2">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "catalog"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                Products Catalog ({filteredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab("pricing-tables")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "pricing-tables"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <FaTable className="text-emerald-400" /> Full Price Matrix (Tally / BUSY / AWS)
              </button>
            </div>
          </div>

          {activeTab === "catalog" ? (
            <>
              {/* Search & Filter Bar */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                  {[
                    { id: "all", name: "All Solutions" },
                    { id: "tally", name: "Tally Prime" },
                    { id: "aws", name: "Tally on AWS Cloud" },
                    { id: "busy", name: "BUSY Accounting" },
                    { id: "cloud", name: "Web & VPS Cloud" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === c.id
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Tally, AWS 1 User, BUSY..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 bg-slate-100/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all select-text cursor-text pointer-events-auto"
                  />
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="mt-12 text-center py-16 bg-white rounded-2xl shadow-sm">
                  <p className="text-slate-500 font-medium">
                    No software products match your search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 btn-outline py-1.5 px-4 text-xs font-semibold rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => {
                    const prodId = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const whatsappMsg = encodeURIComponent(
                      `Hello VM Solutiions, I am interested in purchasing:\n\n*Product:* ${p.name}\n*Price:* ${p.price}\n*Tag:* ${p.tag}\n\nPlease share details & assistance.`,
                    );
                    return (
                      <div
                        key={prodId}
                        className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] transition-all flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          {/* Header Image / Tag Clickable Link to Product Details */}
                          <Link to="/software/$id" params={{ id: prodId }} className="block">
                            <div className="relative h-44 w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  loading="lazy"
                                  className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="text-slate-300 text-xs font-semibold">
                                  Genuine License
                                </div>
                              )}
                              <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md shadow-sm">
                                {p.tag}
                              </span>
                              {p.discount && (
                                <span className="absolute top-3 right-3 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                  {p.discount}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-snug font-display uppercase line-clamp-2">
                              {p.name}
                            </h3>
                          </Link>
                        </div>

                        <div className="mt-5 pt-4 flex items-center justify-between gap-2">
                          {/* Price Section */}
                          <Link to="/software/$id" params={{ id: prodId }} className="block">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase">
                              License / Cloud Price
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-emerald-600">{p.price}</span>
                              {p.originalPrice && (
                                <span className="text-xs text-red-400 line-through">
                                  {p.originalPrice}
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* Enquire Button */}
                          <a
                            href={`https://wa.me/${BRAND.phoneRaw}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1cd466] hover:bg-[#18c35b] text-white py-2.5 px-4 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                          >
                            <FaWhatsapp className="text-base" /> SEND ENQUIRY
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* FULL PRICING MATRIX TABLES */
            <div className="mt-8 space-y-10">
              {/* Tally Prime Official Pricing */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg font-bold">
                    T
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      Tally Prime License Pricing Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official license activation & annual TSS renewal rates
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Tally Edition</th>
                        <th className="py-3 px-4">New License Activation</th>
                        <th className="py-3 px-4">Annual TSS Renewal</th>
                        <th className="py-3 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {TALLY_PRICING_TABLE.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{t.variant}</td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                            {t.activation}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{t.renewal}</td>
                          <td className="py-3.5 px-4 text-slate-500">{t.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tally on AWS Cloud User-Based Pricing */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-lg">
                    <FaCloud />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      Tally on AWS Cloud Pricing (Per User Base)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Access Tally from anywhere on Mac, PC or Mobile with 99.9% uptime
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">User Base Tier</th>
                        <th className="py-3 px-4">Monthly Cloud Pricing</th>
                        <th className="py-3 px-4">Included Features & Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {AWS_CLOUD_PRICING_TABLE.map((aws, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{aws.users}</td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                            {aws.price}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{aws.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BUSY Accounting Software Full Pricing Table */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-lg font-bold">
                    B
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      BUSY Accounting Full Price Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Complete rates for Basic, Standard, Enterprise, Blue, Saffron & Emerald
                      editions
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Edition</th>
                        <th className="py-3 px-4">Variant & User Base</th>
                        <th className="py-3 px-4">New Activation Price</th>
                        <th className="py-3 px-4">Annual Renewal Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {BUSY_PRICING_TABLE.map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-500">{b.edition}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{b.variant}</td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                            {b.activation}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">{b.renewal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
