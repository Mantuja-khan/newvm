import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch, FaShieldAlt, FaLaptop, FaTruck, FaHeadset } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { HARDWARE_CATEGORIES, PRODUCTS, BRAND } from "@/data/site";
import { API_BASE } from "@/config/api";

export function HardwarePage() {
  const [productList, setProductList] = useState(
    PRODUCTS.filter((p) => p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat))
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data = await res.json();
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
            subtitle="Commercial grade refurbished laptops, PCs and workstations thoroughly inspected, tested and backed by warranty."
          />

          {/* Controls: Search and Filters */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search ThinkPad, i5, Dell, NVMe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {HARDWARE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
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

          {/* Product Grid */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-60 bg-slate-100/70 p-6 flex items-center justify-center overflow-hidden">
                    {p.badge && (
                      <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-sm">
                        {p.badge}
                      </span>
                    )}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {p.brand || p.cat}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {p.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Features list bullet tags */}
                    {p.features && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(Array.isArray(p.features) ? p.features : (p.features ? p.features.split(",") : [])).slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Pricing & Actions */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Offer Price</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900">{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          {p.originalPrice}
                        </span>
                      )}
                    </div>
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
                      to={`/hardware/${p.id}`}
                      className="btn-primary text-xs py-2.5 px-4 font-bold rounded-xl"
                    >
                      View Specs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-12 text-center py-16 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 font-medium">No hardware products match your search or filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-bold text-primary underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
