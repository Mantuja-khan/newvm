import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { API_BASE } from "@/config/api";

export function AdminAddProductPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const defaultType = searchParams.get("type") || "hardware";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    id: "",
    type: defaultType,
    cat: defaultType === "hardware" ? "desktops" : "software",
    name: "",
    price: "₹35,000",
    originalPrice: "₹40,000",
    discount: "13% Off",
    rating: "4.6",
    reviewsCount: "128",
    tag: defaultType === "hardware" ? "Core i3 10th, 8GB, 512GB SSD" : "Single User License",
    desc: "Enterprise grade product for business performance.",
    image: "/tally-logo.png",
    images: [],
    features: [],
    brand: defaultType === "hardware" ? "Lenovo" : "Tally",
    model: "Business Series",
    condition: "Refurbished Grade A+",
    warranty: "1 Year Warranty",
    inStock: true,
    specs: "",
  });

  const [imagesInput, setImagesInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [specsInput, setSpecsInput] = useState("");

  useEffect(() => {
    if (editId) {
      const fetchEditProduct = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${API_BASE}/products/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
            setImagesInput(Array.isArray(data.images) ? data.images.join(", ") : data.images || data.image || "");
            setFeaturesInput(Array.isArray(data.features) ? data.features.join(", ") : data.features || "");
            
            if (typeof data.specs === "string") {
              setSpecsInput(data.specs);
            } else if (typeof data.specs === "object" && data.specs !== null) {
              const specPairs = [];
              for (const [k, v] of Object.entries(data.specs)) {
                if (typeof v === "object" && v !== null) {
                  for (const [subK, subV] of Object.entries(v)) {
                    specPairs.push(`${k} - ${subK}: ${subV}`);
                  }
                } else {
                  specPairs.push(`${k}: ${v}`);
                }
              }
              setSpecsInput(specPairs.join(", "));
            }
          }
        } catch (err) {
          console.error("Failed to load product:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEditProduct();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      alert("Please enter Product Name and Selling Price.");
      return;
    }

    setSaving(true);

    const imagesArray = imagesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const featuresArray = featuresInput.split(",").map((s) => s.trim()).filter(Boolean);

    const finalProduct = {
      ...product,
      image: imagesArray[0] || product.image || "/tally-logo.png",
      images: imagesArray.length > 0 ? imagesArray : [product.image || "/tally-logo.png"],
      features: featuresArray,
      specs: specsInput,
      id: product.id || `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`
    };

    try {
      await fetch(`${API_BASE}/products/single`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": sessionStorage.getItem("admin-token") || "vmsol-admin-token-xyz-123"
        },
        body: JSON.stringify(finalProduct),
      });

      alert("Product saved successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to save product to backend database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <FaArrowLeft /> Back to Admin Dashboard
          </Link>
          <h1 className="text-xl font-black text-slate-900 uppercase">
            {editId ? "Edit Product" : `Add New ${product.type?.toUpperCase()} Product`}
          </h1>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-xs font-bold text-slate-500">Loading Product Information...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Type *</label>
                <select
                  value={product.type}
                  onChange={(e) => setProduct({ ...product, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="hardware">Hardware (Laptops, Desktops, Mini PCs)</option>
                  <option value="software">Software (Tally, BUSY Licenses)</option>
                  <option value="cloud">Cloud (Tally on AWS Cloud)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Code *</label>
                <input
                  type="text"
                  required
                  placeholder="laptops, desktops, software, cloud"
                  value={product.cat}
                  onChange={(e) => setProduct({ ...product, cat: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lenovo ThinkCentre M720q Tiny Mini PC"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selling Offer Price *</label>
                <input
                  type="text"
                  required
                  placeholder="₹16,500"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Original Price (MRP)</label>
                <input
                  type="text"
                  placeholder="₹22,000"
                  value={product.originalPrice || ""}
                  onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discount Tag</label>
                <input
                  type="text"
                  placeholder="25% Off"
                  value={product.discount || ""}
                  onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="Lenovo, Dell, Tally"
                  value={product.brand || ""}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag / Sub-Heading</label>
                <input
                  type="text"
                  placeholder="Core i5 8th Gen, 16GB RAM, 256GB SSD"
                  value={product.tag || ""}
                  onChange={(e) => setProduct({ ...product, tag: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Warranty Term</label>
                <input
                  type="text"
                  placeholder="1 Year Warranty"
                  value={product.warranty || ""}
                  onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URLs (Comma Separated)</label>
              <input
                type="text"
                placeholder="/tally-logo.png, /hero-cta-bg.png"
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Features (Comma Separated)</label>
              <textarea
                rows={2}
                placeholder="1 Year Warranty, Fast SSD Storage, GST Invoice Available"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technical Specifications (Comma Separated Key:Value)</label>
              <textarea
                rows={3}
                placeholder="Processor: Intel Core i5 8th Gen, RAM: 16GB DDR4, Storage: 512GB NVMe SSD, OS: Windows 11 Pro"
                value={specsInput}
                onChange={(e) => setSpecsInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Commercial grade desktop built for business performance..."
                value={product.desc || ""}
                onChange={(e) => setProduct({ ...product, desc: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link to="/admin" className="px-6 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <FaSave /> {saving ? "Saving Product..." : "Save & Publish Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
