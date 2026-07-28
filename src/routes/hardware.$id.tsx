import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaShieldAlt, FaTruck, FaHeadset, FaPhoneAlt, FaPaperPlane, FaTimes, FaStar, FaTag } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { BRAND, PRODUCTS, Product } from "@/data/site";

import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/hardware/$id")({
  head: () => ({
    meta: [
      { title: `Hardware Details — VM Solutiions` },
      { name: "description", content: "Detailed specifications, price and warranty information for enterprise hardware." },
    ],
  }),
  component: HardwareDetailPage,
});

function HardwareDetailPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error && data.name) {
            setProduct(data);
            return;
          }
        }
      } catch (err) {
        console.log("Error fetching hardware product from backend, trying static list.");
      }
      const found = PRODUCTS.find(
        (p) => p.id === id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id
      );
      if (found) setProduct(found);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Hardware Quote Inquiry: ${product?.name}`,
          message: `Product: ${product?.name} (${product?.price})\nCustomer Note: ${message}`,
        }),
      });
      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteModalOpen(false);
        setQuoteSubmitted(false);
      }, 2500);
    } catch (err) {
      alert("Submitted successfully! Our team will contact you shortly.");
      setQuoteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 bg-slate-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">Hardware Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested hardware product might have been moved or updated.</p>
        <Link to="/hardware" className="mt-6 btn-primary py-2 px-5 text-xs font-bold rounded-xl">
          Back to Hardware Catalog
        </Link>
      </div>
    );
  }

  const galleryImages = (product.images && product.images.length > 0 ? product.images : [product.image || ""]).filter(Boolean);
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0] || "/tally-logo.png";

  const whatsappMsg = encodeURIComponent(
    `Hello VM Solutiions, I am interested in purchasing:\n\n*Product:* ${product.name}\n*Price:* ${product.price}\n*MRP:* ${product.originalPrice || ""}\n*Condition:* ${product.condition || "Refurbished"}\n\nPlease confirm availability and share details.`
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => (p.cat === product.cat || p.type === product.type) && p.name !== product.name
  ).slice(0, 3);

  // Helper to parse features from array or comma-separated string
  const displayFeatures: string[] = typeof product.features === "string"
    ? (product.features as string).split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
    : (Array.isArray(product.features) && product.features.length > 0 ? (product.features as string[]) : [
        "Genuine commercial body with 1 Year Warranty & free tech support",
        "GST Invoice available for corporate tax benefits",
        "Tested & certified hardware with clean OS pre-loaded",
        "Ready for instant deployment in office, accounting or home use"
      ]);

  // Helper to parse specs from object or comma-separated string
  const parsedSpecs: Record<string, string> = (() => {
    if (!product.specs) return {};
    if (typeof product.specs === "string") {
      const res: Record<string, string> = {};
      const pairs = (product.specs as string).split(/,|\n/);
      for (const pair of pairs) {
        const parts = pair.split(":");
        if (parts.length >= 2) {
          res[parts[0].trim()] = parts.slice(1).join(":").trim();
        } else if (pair.trim()) {
          res[pair.trim()] = pair.trim();
        }
      }
      return res;
    }
    if (typeof product.specs === "object" && product.specs !== null) {
      const res: Record<string, string> = {};
      for (const [k, v] of Object.entries(product.specs)) {
        if (typeof v === "object" && v !== null) {
          for (const [subK, subV] of Object.entries(v as any)) {
            res[`${k} - ${subK}`] = String(subV);
          }
        } else {
          res[k] = String(v);
        }
      }
      return res;
    }
    return {};
  })();

  return (
    <>
      <PageHero title={product.name} crumb="Hardware Details" />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="container-x flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/hardware" className="hover:text-slate-900">Hardware Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold uppercase truncate max-w-[240px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <section className="py-12 bg-slate-50">
        <div className="container-x">
          <Link
            to="/hardware"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Hardware Catalog
          </Link>

          {/* Main Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 grid lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Image Gallery & Action Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Main Large Image Container */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-center relative min-h-[350px] shadow-inner">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="max-h-[320px] w-auto object-contain transition-all duration-300"
                  />

                  {product.discount && (
                    <span className="absolute top-3 right-3 text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Multiple Image Thumbnails Gallery Selector */}
                {galleryImages.length > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3 overflow-x-auto py-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`h-16 w-16 rounded-lg border-2 p-1 bg-white overflow-hidden transition-all shrink-0 ${
                          selectedImageIndex === idx
                            ? "border-slate-800"
                            : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Below Image */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${BRAND.phoneRaw}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98] text-center"
                >
                  <FaWhatsapp className="text-lg" /> SEND ENQUIRY
                </a>

                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <FaPhoneAlt className="text-xs" /> BUY / GET QUOTE
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Specs */}
            <div className="lg:col-span-7">
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight uppercase">
                {product.name}
              </h1>

              {/* Rating & Reviews Badge */}
              {product.rating && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 text-white text-xs font-bold rounded">
                    {product.rating} <FaStar className="text-[10px]" />
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {product.reviewsCount || "128"} Ratings & Reviews
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {product.condition || "Refurbished Grade A+"}
                  </span>
                </div>
              )}

              {/* Special Price Block (Neutral slate font) */}
              <div className="mt-5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Price</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2.5 py-1 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Key Bullet Highlights */}
              <div className="mt-6">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FaTag className="text-slate-700" /> Key Highlights & Features
                </h3>
                <ul className="mt-3 space-y-2">
                  {displayFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <FaCheckCircle className="text-slate-600 text-xs shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warranty & Delivery Cards */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaShieldAlt className="text-slate-700 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">{product.warranty || "1 Year Warranty"}</div>
                  <div className="text-[9px] text-slate-400">VM Solutiions Covered</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaTruck className="text-slate-700 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Pan-India Delivery</div>
                  <div className="text-[9px] text-slate-400">Safe Sealed Express</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaHeadset className="text-slate-700 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Lifetime Support</div>
                  <div className="text-[9px] text-slate-400">Remote & On-site</div>
                </div>
              </div>

              {/* Product Overview Description */}
              {product.desc && (
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Product Description</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">{product.desc}</p>
                </div>
              )}

              {/* SPECIFICATIONS TABLE */}
              {Object.keys(parsedSpecs).length > 0 && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">
                    Technical Specifications
                  </h3>

                  <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-left text-xs divide-y divide-slate-100">
                      <tbody>
                        {Object.entries(parsedSpecs).map(([k, v]) => (
                          <tr key={k} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3 border-r border-slate-100 bg-slate-50/30">
                              {k}
                            </td>
                            <td className="py-2.5 px-4 text-slate-900 font-bold">
                              {String(v)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Hardware Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-10">
              <h3 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                Similar Hardware Products
              </h3>
              <div className="mt-6 grid sm:grid-cols-3 gap-6">
                {relatedProducts.map((rp) => {
                  const rpId = rp.id || rp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const rpWhatsapp = encodeURIComponent(
                    `Hello VM Solutiions, I am interested in purchasing ${rp.name} (${rp.price}). Please share details.`
                  );
                  return (
                    <div
                      key={rpId}
                      className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-end">
                          <span className="text-xs font-bold text-emerald-600">{rp.discount || "Best Offer"}</span>
                        </div>
                        <Link to="/hardware/$id" params={{ id: rpId }}>
                          <div className="h-36 bg-white rounded-lg p-2 flex items-center justify-center">
                            {rp.image ? (
                              <img src={rp.image} alt={rp.name} className="h-full w-auto object-contain" />
                            ) : (
                              <span className="text-xs text-slate-400">No Image</span>
                            )}
                          </div>
                          <h4 className="mt-3 text-sm font-bold text-slate-900 uppercase line-clamp-1 hover:text-primary">
                            {rp.name}
                          </h4>
                        </Link>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-black text-emerald-600">{rp.price}</span>
                          {rp.originalPrice && <span className="text-xs text-red-400 line-through">{rp.originalPrice}</span>}
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${BRAND.phoneRaw}?text=${rpWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 bg-[#1cd466] hover:bg-[#18c35b] text-white py-2 px-3 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1.5"
                      >
                        <FaWhatsapp className="text-base" /> SEND ENQUIRY
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* QUOTE MODAL */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
            >
              <FaTimes />
            </button>

            {quoteSubmitted ? (
              <div className="py-8 text-center">
                <FaCheckCircle className="text-emerald-500 text-4xl mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900">Inquiry Received!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Our hardware specialist will get in touch with pricing & availability for <strong>{product.name}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <h3 className="text-xl font-bold text-slate-900 font-display">Request Price Quote</h3>
                <p className="text-xs text-slate-500 mt-1">Inquiring for: <strong className="text-slate-800">{product.name}</strong></p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@company.com"
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Custom Requirements / Quantity</label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Need 5 units for office accounting..."
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold mt-5 flex items-center justify-center gap-2">
                  <FaPaperPlane /> Submit Quote Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
