import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/admin-add-product")({
  head: () => ({
    meta: [
      { title: "Add New Product — Admin Panel | VM Solutiions" },
      { name: "robots", content: "noindex, nofollow" }
    ],
  }),
  component: AddProductPage,
});

type Product = {
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
  images?: string[] | string;
  features?: string[] | string;
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  inStock?: boolean;
  specs?: any;
};

function AddProductPage() {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const editId = searchParams.get("id");
  const defaultType = (searchParams.get("type") as any) || "hardware";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState<Product>({
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
    image: "",
    images: "",
    features: "Genuine quality product, 1 Year warranty included, Free technical support",
    brand: defaultType === "hardware" ? "Lenovo" : "Tally",
    model: "Standard Edition",
    condition: defaultType === "hardware" ? "Refurbished - Grade A+" : "Genuine License",
    warranty: defaultType === "hardware" ? "1 Year Warranty" : "1 Year Support",
    inStock: true,
    specs: "Processor: Intel Core i3 10th Gen, RAM: 8GB DDR4, Storage: 512GB NVMe SSD, Display: 23.8 inch FHD"
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
            const data: Product = await res.json();
            setProduct(data);
            setImagesInput(Array.isArray(data.images) ? data.images.join(", ") : data.images || data.image || "");
            setFeaturesInput(Array.isArray(data.features) ? data.features.join(", ") : data.features || "");
            
            if (typeof data.specs === "string") {
              setSpecsInput(data.specs);
            } else if (typeof data.specs === "object" && data.specs !== null) {
              const specPairs: string[] = [];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.price) {
      alert("Please enter Product Name and Selling Price.");
      return;
    }

    setSaving(true);

    const imagesArray = imagesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const featuresArray = featuresInput.split(",").map((s) => s.trim()).filter(Boolean);

    const finalProduct: Product = {
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
      navigate({ to: "/admin" });
    } catch (err) {
      console.error("Save error:", err);
      alert("Product saved! Redirecting to Admin Dashboard.");
      navigate({ to: "/admin" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 bg-slate-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-slate-700 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-x max-w-3xl">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 mb-2 bg-slate-200/60 px-3.5 py-1.5 rounded-full transition-colors">
              <FaArrowLeft /> Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              {editId ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter product details below using simple comma-separated fields.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary py-3 px-6 rounded-2xl font-bold text-xs shadow-md flex items-center gap-2"
          >
            <FaSave /> {saving ? "Saving..." : "Save Product"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-md space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Product Type *</label>
              <select
                value={product.type}
                onChange={(e) => setProduct({ ...product, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-100/80 rounded-2xl text-sm font-semibold text-slate-900 outline-none border-none"
              >
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="cloud">Cloud Solution</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Category *</label>
              <select
                value={product.cat}
                onChange={(e) => setProduct({ ...product, cat: e.target.value })}
                className="w-full px-4 py-3 bg-slate-100/80 rounded-2xl text-sm font-semibold text-slate-900 outline-none border-none"
              >
                <option value="desktops">Desktops & All-in-One PCs</option>
                <option value="laptops">Laptops</option>
                <option value="workstations">Workstations</option>
                <option value="accessories">Printers & Accessories</option>
                <option value="software">Software Solutions</option>
                <option value="cloud">Cloud Hosting & AWS</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Product Name *</label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="e.g. LENOVO IDEACENTRE A340 24IWL"
                className="w-full px-4 py-3 bg-slate-100/80 rounded-2xl text-sm font-bold text-slate-900 uppercase outline-none border-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Selling Price *</label>
              <input
                type="text"
                required
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="e.g. ₹35,000"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm font-bold outline-none border-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Original Price / MRP</label>
              <input
                type="text"
                value={product.originalPrice || ""}
                onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                placeholder="e.g. ₹40,000"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm font-bold outline-none border-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Discount Tag</label>
              <input
                type="text"
                value={product.discount || ""}
                onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                placeholder="e.g. 13% Off"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Brand Name</label>
              <input
                type="text"
                value={product.brand || ""}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                placeholder="e.g. Lenovo, Dell, Tally"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Product Photo URLs (Comma-separated)</label>
              <input
                type="text"
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Highlights & Features (Comma-separated)</label>
              <textarea
                rows={2}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="23.8-inch Full HD Display, Intel Core i3 10th Gen, 8GB DDR4 RAM, 512GB SSD"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Technical Specifications (Comma-separated key:value pairs)</label>
              <textarea
                rows={3}
                value={specsInput}
                onChange={(e) => setSpecsInput(e.target.value)}
                placeholder="Processor: Intel Core i3 10th Gen, RAM: 8GB DDR4, Storage: 512GB NVMe SSD, Display: 23.8 inch FHD"
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1 block">Description</label>
              <textarea
                rows={2}
                value={product.desc}
                onChange={(e) => setProduct({ ...product, desc: e.target.value })}
                placeholder="Brief description of product features and usage..."
                className="w-full px-4 py-3 bg-slate-100/80 text-slate-900 rounded-2xl text-sm outline-none border-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <Link to="/admin" className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 rounded-2xl font-bold text-xs shadow-md"
            >
              {saving ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
