import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaPhoneAlt,
  FaPaperPlane,
  FaTimes,
  FaStar,
  FaTag,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import { TextReveal } from "@/components/TextReveal";
import { BRAND, PRODUCTS } from "@/data/site";
import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/software/$id")({
  head: () => ({
    meta: [
      { title: `Software Details — VM Solutiions` },
      {
        name: "description",
        content: "Detailed software licensing, price matrix, and specifications.",
      },
    ],
  }),
  component: SoftwareDetailPage,
});

function SoftwareDetailPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error && data.name) {
            setProduct(data);
          }
        }

        // Fetch related products from MongoDB
        const allRes = await fetch(`${API_BASE}/products`);
        if (allRes.ok) {
          const allData = await allRes.json();
          if (Array.isArray(allData)) {
            const related = allData
              .filter((p) => (p.id !== id && (p.type === "software" || p.type === "cloud")))
              .slice(0, 3);
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error("Error fetching software product from MongoDB:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Software License Inquiry: ${product?.name}`,
          message: `Product: ${product?.name} (${product?.price})\nNote: ${message}`,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteModalOpen(false);
        setQuoteSubmitted(false);
      }, 2500);
    } catch (err) {
      clearTimeout(timeoutId);
      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteModalOpen(false);
        setQuoteSubmitted(false);
      }, 2500);
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
        <h2 className="text-2xl font-bold text-slate-800">Software Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">
          The requested software solution might have been updated.
        </p>
        <Link to="/software" className="mt-6 btn-primary py-2 px-5 text-xs font-bold rounded-xl">
          Back to Software Catalog
        </Link>
      </div>
    );
  }

  const galleryImages = (
    product.images && product.images.length > 0 ? product.images : [product.image || ""]
  ).filter(Boolean);
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0] || "/tally-logo.png";
  const whatsappMsg = encodeURIComponent(
    `Hello VM Solutiions, I am interested in purchasing:\n\n*Product:* ${product.name}\n*Price:* ${product.price}\n*Original MRP:* ${product.originalPrice || ""}\n*Tag:* ${product.tag}\n\nPlease share license availability & setup details.`,
  );

  const displayFeatures =
    typeof product.features === "string"
      ? product.features
          .split(/,|\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(product.features) && product.features.length > 0
        ? product.features
        : [
            "Genuine accounting software license with lifetime validity",
            "GST E-invoicing, E-way bill & financial reporting automated",
            "Installation & data migration setup assistance",
            "1 Year priority technical support included",
          ];

  return (
    <>
      <PageHero title={product.name} crumb="Software Details" />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="container-x flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/software" className="hover:text-slate-900">
            Software Solutions
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold uppercase truncate max-w-[240px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      <section className="py-12 bg-slate-50">
        <div className="container-x">
          <Link
            to="/software"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Software Solutions
          </Link>

          {/* Main Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 grid lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Image Gallery & Action Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Main Large Image Container */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex items-center justify-center relative min-h-[350px] shadow-inner">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="max-h-[280px] w-auto object-contain transition-all duration-300"
                  />
                  {product.discount && (
                    <span className="absolute top-3 right-3 text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Multiple Image Thumbnails */}
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
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-contain"
                        />
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
                  <FaPhoneAlt className="text-xs" /> GET LICENSE / QUOTE
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Specs */}
            <div className="lg:col-span-7">
              {/* Product Title */}
              <TextReveal
                as="h1"
                animateDirect
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight uppercase"
              >
                {product.name}
              </TextReveal>

              {/* Rating & Tag Badge */}
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 text-white text-xs font-bold rounded">
                  {product.rating || "4.8"} <FaStar className="text-[10px]" />
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {product.reviewsCount || "150"} Ratings & Reviews
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded uppercase">
                  {product.tag}
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-5 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  License Price
                </div>
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

              {/* Key Features */}
              <div className="mt-6">
                <TextReveal
                  as="h3"
                  className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FaTag className="text-slate-700" /> Key Highlights & Offers
                </TextReveal>
                <ul className="mt-3 space-y-2">
                  {displayFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                    >
                      <FaCheckCircle className="text-slate-600 text-xs shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security & Support Cards */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaShieldAlt className="text-slate-600 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">
                    {product.warranty || "1 Year Support"}
                  </div>
                  <div className="text-[9px] text-slate-400">VM Solutiions Partner</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaTruck className="text-slate-600 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Instant Delivery</div>
                  <div className="text-[9px] text-slate-400">License Key via Email</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <FaHeadset className="text-slate-600 text-lg mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Priority Support</div>
                  <div className="text-[9px] text-slate-400">Remote & Phone Assistance</div>
                </div>
              </div>

              {/* Description */}
              {product.desc && (
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <TextReveal
                    as="h3"
                    className="text-xs font-extrabold text-slate-900 uppercase tracking-wider"
                  >
                    Product Overview
                  </TextReveal>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {product.desc}
                  </p>
                </div>
              )}

              {/* SPECIFICATIONS TABLE */}
              {product.specs && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <TextReveal
                    as="h3"
                    className="text-lg font-black text-slate-900 font-display uppercase tracking-tight"
                  >
                    Technical Specifications & Licensing Details
                  </TextReveal>

                  <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-left text-xs divide-y divide-slate-100">
                      <tbody>
                        {typeof product.specs === "string"
                          ? product.specs.split(/,|\n/).map((item, idx) => {
                              const parts = item.split(":");
                              const k = parts.length >= 2 ? parts[0].trim() : `Feature ${idx + 1}`;
                              const v =
                                parts.length >= 2 ? parts.slice(1).join(":").trim() : item.trim();
                              return (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3 border-r border-slate-100 bg-slate-50/30">
                                    {k}
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-900 font-bold">{v}</td>
                                </tr>
                              );
                            })
                          : Object.entries(product.specs).map(([k, v]) => (
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-10">
              <TextReveal
                as="h3"
                className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight"
              >
                Similar Software & Cloud Solutions
              </TextReveal>
              <div className="mt-6 grid sm:grid-cols-3 gap-6">
                {relatedProducts.map((rp) => {
                  const rpId = rp.id || rp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const rpWhatsapp = encodeURIComponent(
                    `Hello VM Solutiions, I am interested in purchasing ${rp.name} (${rp.price}). Please share details.`,
                  );
                  return (
                    <div
                      key={rpId}
                      className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-end">
                          <span className="text-xs font-bold text-slate-600">
                            {rp.discount || "Genuine License"}
                          </span>
                        </div>
                        <Link to="/software/$id" params={{ id: rpId }}>
                          <div className="h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                            {rp.image ? (
                              <img
                                src={rp.image}
                                alt={rp.name}
                                className="h-full w-auto object-contain"
                              />
                            ) : (
                              <span className="text-xs text-slate-400">Genuine License</span>
                            )}
                          </div>
                          <h4 className="mt-3 text-sm font-bold text-slate-900 uppercase line-clamp-1 hover:text-primary">
                            {rp.name}
                          </h4>
                        </Link>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-black text-emerald-600">{rp.price}</span>
                          {rp.originalPrice && (
                            <span className="text-xs text-red-400 line-through">
                              {rp.originalPrice}
                            </span>
                          )}
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
                  Our software specialist will contact you shortly with pricing & setup details for{" "}
                  <strong>{product.name}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Request Price Quote
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inquiring for: <strong className="text-slate-800">{product.name}</strong>
                </p>

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
                    <label className="text-xs font-semibold text-slate-600">
                      Custom Requirements / User Count
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Need Tally on AWS cloud for 3 users..."
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold mt-5 flex items-center justify-center gap-2"
                >
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
