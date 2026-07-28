import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaSearch, FaShieldAlt, FaLaptop, FaTruck, FaHeadset } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { HARDWARE_CATEGORIES, PRODUCTS, Product, BRAND } from "@/data/site";

import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/hardware")({
  head: () => ({
    meta: [
      { title: "Hardware Products — Refurbished Laptops & Desktops | VM Solutiions" },
      { name: "description", content: "Buy certified refurbished laptops, mini desktop PCs, all-in-one PCs & printers at honest prices with 1 year warranty." },
    ],
  }),
  component: HardwareProductsPage,
});

function HardwareProductsPage() {
  const [productList, setProductList] = useState<Product[]>(
    PRODUCTS.filter((p) => p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data: Product[] = await res.json();
          if (data && data.length > 0) {
            const hw = data.filter((p) => p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat));
            if (hw.length > 0) {
              setProductList(hw);
            }
          }
        }
      } catch (err) {
        console.log("Could not load hardware products from backend, using defaults.");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = productList.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.cat === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHero title="Hardware & IT Equipment" crumb="Hardware Products" />

      {/* Trust Badges Bar */}
      <section className="bg-slate-900 text-white py-6 border-y border-slate-800">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FaShieldAlt className="text-primary text-2xl shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">1 Year Warranty</h4>
              <p className="text-[11px] text-slate-400">Certified & tested hardware</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FaLaptop className="text-primary text-2xl shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Commercial Grade</h4>
              <p className="text-[11px] text-slate-400">Lenovo, Dell, HP business series</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FaTruck className="text-primary text-2xl shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-[11px] text-slate-400">Safe packaging across India</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FaHeadset className="text-primary text-2xl shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Lifetime Support</h4>
              <p className="text-[11px] text-slate-400">Dedicated VM Solutiions helpdesk</p>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal py-16 bg-slate-50/50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Explore Hardware"
            title={<>Commercial <span className="text-primary">Laptops & Desktops</span></>}
            subtitle="Premium refurbished and new laptops, All-in-One PCs, mini desktops, and workstations tested for office accounting & enterprise workloads."
          />

          {/* Search & Filter Bar */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
              {HARDWARE_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === c.id
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
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search Lenovo, IdeaCentre, i5..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-slate-50/50"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="mt-12 text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">No hardware products match your search criteria.</p>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="mt-4 btn-outline py-1.5 px-4 text-xs font-semibold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
                const prodId = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const whatsappMsg = encodeURIComponent(
                  `Hello VM Solutiions, I am interested in purchasing:\n\n*Product:* ${p.name}\n*Price:* ${p.price}\n*MRP:* ${p.originalPrice || ""}\n\nPlease share availability & details.`
                );

                return (
                  <div
                    key={prodId}
                    className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] transition-all flex flex-col justify-between relative"
                  >
                    {/* Top Right Green Discount Badge */}
                    <div className="flex justify-end items-center">
                      {p.discount ? (
                        <span className="text-emerald-600 font-black text-sm tracking-wide">
                          {p.discount}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 uppercase">{p.brand || "Hardware"}</span>
                      )}
                    </div>

                    {/* Centered Product Image Container */}
                    <Link to="/hardware/$id" params={{ id: prodId }} className="block my-3">
                      <div className="h-52 w-full bg-white rounded-lg flex items-center justify-center p-2 overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-slate-300 text-xs font-semibold">No Image Available</div>
                        )}
                      </div>
                    </Link>

                    <div>
                      {/* Product Title (Exact Screenshot Style: Bold Uppercase) */}
                      <Link to="/hardware/$id" params={{ id: prodId }}>
                        <h3 className="text-lg font-black text-slate-800 leading-snug group-hover:text-primary transition-colors font-display tracking-tight uppercase line-clamp-2">
                          {p.name}
                        </h3>
                      </Link>

                      {/* Price Row: Green Selling Price & Red MRP */}
                      <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-2xl font-black text-emerald-600 tracking-tight">
                          {p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="text-sm font-semibold text-red-500 line-through">
                            {p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Full Width Bright Green WhatsApp SEND ENQUIRY Button */}
                    <div className="mt-5">
                      <a
                        href={`https://wa.me/${BRAND.phoneRaw}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#1cd466] hover:bg-[#18c35b] text-white py-3 px-4 rounded-full font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                      >
                        <FaWhatsapp className="text-xl" /> SEND ENQUIRY
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
