import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCloud, FaSearch, FaTable } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { PRODUCTS, BRAND } from "@/data/site";
import { API_BASE } from "@/config/api";

const TALLY_PRICING_TABLE = [
  { variant: "Tally Prime Silver (Single User)", activation: "₹22,500 + 18% GST", renewal: "₹4,500 + 18% GST", desc: "Single PC license for standalone accounting & GST invoicing." },
  { variant: "Tally Prime Gold (Multi-User / LAN)", activation: "₹67,500 + 18% GST", renewal: "₹13,500 + 18% GST", desc: "Unlimited LAN multi-user license for multi-accountant offices." },
];

const AWS_CLOUD_PRICING_TABLE = [
  { users: "1 User Plan", price: "₹600 / month (+ GST)", desc: "1 User cloud hosting on AWS with fast SSD & automated daily backups." },
  { users: "2 Users Plan", price: "₹1,200 / month (+ GST)", desc: "2 Concurrent users cloud server with RDP printing & SSL security." },
  { users: "4 Users Plan", price: "₹1,800 / month (+ GST)", desc: "4 Concurrent users cloud server with high IOPS NVMe SSD storage." },
  { users: "Enterprise (5+ Users)", price: "From ₹450 / user / mo", desc: "Dedicated AWS cloud instance tailored for enterprise accounting teams." },
];

const BUSY_PRICING_TABLE = [
  { edition: "Basic", variant: "Basic — Single User", activation: "₹11,000 + 18% GST", renewal: "₹4,000 + 18% GST" },
  { edition: "Basic", variant: "Basic — Multiple User", activation: "₹25,000 + 18% GST", renewal: "₹8,500 + 18% GST" },
  { edition: "Standard", variant: "Standard — Single User", activation: "₹16,500 + 18% GST", renewal: "₹6,500 + 18% GST" },
  { edition: "Standard", variant: "Standard — Multiple User", activation: "₹40,000 + 18% GST", renewal: "₹14,000 + 18% GST" },
  { edition: "Standard", variant: "Standard — Additional Count", activation: "₹10,500 + 18% GST", renewal: "₹4,000 + 18% GST" },
  { edition: "Enterprise", variant: "Enterprise — Single User", activation: "₹22,000 + 18% GST", renewal: "₹7,500 + 18% GST" },
  { edition: "Enterprise", variant: "Enterprise — Multiple User", activation: "₹58,000 + 18% GST", renewal: "₹17,000 + 18% GST" },
  { edition: "Enterprise", variant: "Enterprise — Additional Count", activation: "₹14,500 + 18% GST", renewal: "₹4,500 + 18% GST" },
  { edition: "Subscription", variant: "Blue — Single User (Annual)", activation: "₹5,000 + 18% GST / yr", renewal: "₹5,000 + 18% GST / yr" },
  { edition: "Subscription", variant: "Blue — Multiple User (Annual)", activation: "₹12,500 + 18% GST / yr", renewal: "₹12,500 + 18% GST / yr" },
  { edition: "Subscription", variant: "Saffron — Single User (Annual)", activation: "₹8,000 + 18% GST / yr", renewal: "₹8,000 + 18% GST / yr" },
  { edition: "Subscription", variant: "Saffron — Multiple User (Annual)", activation: "₹18,000 + 18% GST / yr", renewal: "₹18,000 + 18% GST / yr" },
  { edition: "Subscription", variant: "Emerald — Single User (Annual)", activation: "₹10,000 + 18% GST / yr", renewal: "₹10,000 + 18% GST / yr" },
  { edition: "Subscription", variant: "Emerald — Multiple User (Annual)", activation: "₹25,000 + 18% GST / yr", renewal: "₹25,000 + 18% GST / yr" },
];

export function SoftwarePage() {
  const [productList, setProductList] = useState(
    PRODUCTS.filter((p) => p.type === "software" || p.type === "cloud" || ["software", "cloud"].includes(p.cat))
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("catalog");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const sw = data.filter((p) => p.type === "software" || p.type === "cloud" || ["software", "cloud"].includes(p.cat));
            if (sw.length > 0) {
              setProductList(sw);
            }
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
      matchesCategory = p.name.toLowerCase().includes("tally") && !p.name.toLowerCase().includes("aws");
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

      {/* Navigation Tabs Bar */}
      <section className="bg-slate-900 text-white py-4 border-y border-slate-800">
        <div className="container-x flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "catalog"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Software Products Catalog
            </button>
            <button
              onClick={() => setActiveTab("pricing-tables")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === "pricing-tables"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <FaTable className="text-xs" /> Complete Pricing Rate Card
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Authorized Partner: <strong className="text-white">Tally Prime & BUSY Accounting</strong>
          </div>
        </div>
      </section>

      {activeTab === "catalog" ? (
        <section className="reveal py-16 bg-slate-50/50">
          <div className="container-x">
            <SectionHeading
              eyebrow="Software & Cloud"
              title={<>Tally Prime, BUSY & <span className="text-primary">AWS Cloud Hosting</span></>}
              subtitle="Official software licenses, renewals, and secure Tally on AWS Cloud server hosting solutions."
            />

            {/* Controls Bar */}
            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search Tally Silver, BUSY Enterprise, Cloud..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {[
                  { id: "all", label: "All Software & Cloud" },
                  { id: "tally", label: "Tally Prime" },
                  { id: "busy", label: "BUSY Accounting" },
                  { id: "aws", label: "Tally on AWS Cloud" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 bg-slate-900/95 p-6 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
                      {p.badge && (
                        <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-full border border-slate-700">
                          {p.badge}
                        </span>
                      )}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="relative z-10 max-h-36 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {p.tag || "Software License"}
                        </span>
                        {p.renewalPrice && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Renewal: {p.renewalPrice}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">New License Price</div>
                      <div className="text-xl font-black text-slate-900">{p.price}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${BRAND.whatsappRaw}?text=Hi%20VM%20Solutiions,%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Enquire on WhatsApp"
                      >
                        <FaWhatsapp className="text-base" />
                      </a>
                      <Link
                        to={`/software/${p.id}`}
                        className="btn-primary text-xs py-2.5 px-4 font-bold rounded-xl"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* PRICING RATE TABLES SECTION */
        <section className="reveal py-16 bg-white">
          <div className="container-x space-y-16">
            {/* Tally Pricing Table */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-4 w-1.5 bg-primary rounded-full" />
                <h3 className="text-2xl font-black text-slate-900 font-display">Tally Prime Official Pricing</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Edition / Product</th>
                      <th className="p-4">New License (Activation)</th>
                      <th className="p-4">Annual TSS Renewal</th>
                      <th className="p-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {TALLY_PRICING_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 font-extrabold text-slate-900">{row.variant}</td>
                        <td className="p-4 font-bold text-slate-900">{row.activation}</td>
                        <td className="p-4 font-semibold text-slate-700">{row.renewal}</td>
                        <td className="p-4 text-slate-500">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AWS Cloud Pricing Table */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-4 w-1.5 bg-sky-500 rounded-full" />
                <h3 className="text-2xl font-black text-slate-900 font-display flex items-center gap-2">
                  <FaCloud className="text-sky-500" /> Tally on AWS Cloud User Plans
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {AWS_CLOUD_PRICING_TABLE.map((plan, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-100 px-2.5 py-1 rounded">
                        AWS Powered
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-3">{plan.users}</h4>
                      <div className="text-2xl font-black text-slate-900 mt-2">{plan.price}</div>
                      <p className="text-xs text-slate-500 mt-3 leading-relaxed">{plan.desc}</p>
                    </div>
                    <a
                      href={`https://wa.me/${BRAND.whatsappRaw}?text=Hi%20VM%20Solutiions,%20I%20want%20to%20subscribe%20to%20${encodeURIComponent(plan.users)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 btn-primary w-full py-2.5 text-xs text-center font-bold"
                    >
                      Subscribe Cloud
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* BUSY Accounting Pricing Table */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-4 w-1.5 bg-amber-500 rounded-full" />
                <h3 className="text-2xl font-black text-slate-900 font-display">BUSY Accounting Software Editions</h3>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Edition</th>
                      <th className="p-4">Variant / License Type</th>
                      <th className="p-4">Activation Price</th>
                      <th className="p-4">Renewal Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {BUSY_PRICING_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">{row.edition}</td>
                        <td className="p-4 font-extrabold text-slate-900">{row.variant}</td>
                        <td className="p-4 font-bold text-slate-900">{row.activation}</td>
                        <td className="p-4 font-semibold text-slate-700">{row.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
