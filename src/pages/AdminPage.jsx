import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaSave, FaLock, FaSignOutAlt, FaLaptop, FaDesktop, FaLayerGroup, FaPlusCircle, FaTimes, FaImages, FaListUl, FaTable } from "react-icons/fa";
import { API_BASE } from "@/config/api";

export function AdminPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("hardware");

  const [products, setProducts] = useState([]);
  const [busyPricing, setBusyPricing] = useState([]);
  const [tallyPricing, setTallyPricing] = useState([]);

  // Modal editing state for Products
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editImagesInput, setEditImagesInput] = useState("");
  const [editFeaturesInput, setEditFeaturesInput] = useState("");
  const [editSpecsInput, setEditSpecsInput] = useState("");

  // Modal editing state for Busy & Tally Pricing
  const [editingBusyIndex, setEditingBusyIndex] = useState(null);
  const [editBusy, setEditBusy] = useState({ edition: "", variant: "", activation: "", renewal: "" });

  const [editingTallyIndex, setEditingTallyIndex] = useState(null);
  const [editTally, setEditTally] = useState({ variant: "", activation: "", renewal: "" });

  const [dbStatus, setDbStatus] = useState(null);

  // Load datasets from Backend
  const loadData = async () => {
    try {
      const prodRes = await fetch(`${API_BASE}/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);
      }

      const pricingRes = await fetch(`${API_BASE}/pricing`);
      if (pricingRes.ok) {
        const pricing = await pricingRes.json();
        if (pricing && Array.isArray(pricing.busy)) setBusyPricing(pricing.busy);
        if (pricing && Array.isArray(pricing.tally)) setTallyPricing(pricing.tally);
      }

      const dbRes = await fetch(`${API_BASE}/db-status`);
      if (dbRes.ok) setDbStatus(await dbRes.json());
    } catch (err) {
      console.log("Backend offline, using static initial datasets.");
      setDbStatus({ connected: false, statusText: "Offline / JSON Fallback Mode", host: "Local File DB" });
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("admin-token");
    if (token) {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("admin-token", data.token);
        setIsLoggedIn(true);
        loadData();
        setError("");
        return;
      }
    } catch (err) {
      console.warn("Backend API login unreachable, evaluating admin credentials locally.");
    }

    if (trimmedEmail === "vishalvmsolutiions@gmail.com" && (trimmedPassword === "vishal@53990@" || trimmedPassword === "vishal@53990#")) {
      sessionStorage.setItem("admin-token", "vmsol-admin-token-xyz-123");
      setIsLoggedIn(true);
      loadData();
      setError("");
    } else {
      setError("Invalid email or password credentials. Please check email & password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-token");
    setIsLoggedIn(false);
  };

  // PRODUCTS OPERATIONS
  const saveProductsToBackend = async (newProducts) => {
    try {
      await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProducts),
      });
    } catch (err) {
      console.error("Failed to save products to backend database.");
    }
  };

  const handleOpenAddModal = (productType) => {
    navigate(`/admin-add-product?type=${productType}`);
  };

  const handleOpenEditModal = (idx, prod) => {
    setEditingProductIndex(idx);
    setEditProduct({ ...prod });
    setEditImagesInput(Array.isArray(prod.images) ? prod.images.join(", ") : prod.images || prod.image || "");
    setEditFeaturesInput(Array.isArray(prod.features) ? prod.features.join(", ") : prod.features || "");
    
    if (typeof prod.specs === "string") {
      setEditSpecsInput(prod.specs);
    } else if (typeof prod.specs === "object" && prod.specs !== null) {
      const specPairs = [];
      for (const [k, v] of Object.entries(prod.specs)) {
        if (typeof v === "object" && v !== null) {
          for (const [subK, subV] of Object.entries(v)) {
            specPairs.push(`${k} - ${subK}: ${subV}`);
          }
        } else {
          specPairs.push(`${k}: ${v}`);
        }
      }
      setEditSpecsInput(specPairs.join(", "));
    } else {
      setEditSpecsInput("");
    }
  };

  const handleSaveProductModal = () => {
    if (editingProductIndex === null || !editProduct) return;

    const imagesArray = editImagesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const featuresArray = editFeaturesInput.split(",").map((s) => s.trim()).filter(Boolean);

    const updated = {
      ...editProduct,
      image: imagesArray[0] || editProduct.image || "/tally-logo.png",
      images: imagesArray.length > 0 ? imagesArray : [editProduct.image || "/tally-logo.png"],
      features: featuresArray,
      specs: editSpecsInput,
    };

    const newProductsList = [...products];
    newProductsList[editingProductIndex] = updated;
    setProducts(newProductsList);
    saveProductsToBackend(newProductsList);

    setEditingProductIndex(null);
    setEditProduct(null);
  };

  const handleDeleteProduct = (idx) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const newProductsList = products.filter((_, i) => i !== idx);
    setProducts(newProductsList);
    saveProductsToBackend(newProductsList);
  };

  // PRICING OPERATIONS (BUSY / TALLY)
  const savePricingToBackend = async (busy, tally) => {
    try {
      await fetch(`${API_BASE}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busy, tally }),
      });
    } catch (err) {
      console.error("Failed to save pricing to backend database.");
    }
  };

  const handleAddBusy = () => {
    const newBusyList = [...busyPricing, { edition: "Basic", variant: "New Variant", activation: "₹0", renewal: "₹0" }];
    setBusyPricing(newBusyList);
    savePricingToBackend(newBusyList, tallyPricing);
  };

  const handleDeleteBusy = (idx) => {
    if (!confirm("Delete this BUSY pricing item?")) return;
    const newBusyList = busyPricing.filter((_, i) => i !== idx);
    setBusyPricing(newBusyList);
    savePricingToBackend(newBusyList, tallyPricing);
  };

  const handleSaveBusyModal = () => {
    if (editingBusyIndex === null) return;
    const newBusyList = [...busyPricing];
    newBusyList[editingBusyIndex] = editBusy;
    setBusyPricing(newBusyList);
    savePricingToBackend(newBusyList, tallyPricing);
    setEditingBusyIndex(null);
  };

  const handleAddTally = () => {
    const newTallyList = [...tallyPricing, { variant: "New Tally Plan", activation: "₹0", renewal: "₹0" }];
    setTallyPricing(newTallyList);
    savePricingToBackend(busyPricing, newTallyList);
  };

  const handleDeleteTally = (idx) => {
    if (!confirm("Delete this Tally pricing item?")) return;
    const newTallyList = tallyPricing.filter((_, i) => i !== idx);
    setTallyPricing(newTallyList);
    savePricingToBackend(busyPricing, newTallyList);
  };

  const handleSaveTallyModal = () => {
    if (editingTallyIndex === null) return;
    const newTallyList = [...tallyPricing];
    newTallyList[editingTallyIndex] = editTally;
    setTallyPricing(newTallyList);
    savePricingToBackend(busyPricing, newTallyList);
    setEditingTallyIndex(null);
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-900 px-4 py-16">
        <div className="bg-slate-800 border border-slate-700/80 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-slate-700/50 text-white text-2xl grid place-items-center mx-auto mb-3">
              <FaLock />
            </div>
            <h1 className="text-2xl font-black text-white uppercase font-display">VM Solutiions Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized access to product & pricing database</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-700/60 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vishalvmsolutiions@gmail.com"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider mt-2">
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const hardwareProducts = products.filter((p) => p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat));
  const softwareProducts = products.filter((p) => p.type === "software" || p.type === "cloud" || ["software", "cloud"].includes(p.cat));

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="container-x">
        {/* Top Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Control Panel</span>
            </div>
            <h1 className="text-2xl font-black font-display uppercase tracking-tight mt-1">Product & Pricing Manager</h1>
          </div>

          <div className="flex items-center gap-3">
            {dbStatus && (
              <div className="hidden sm:block text-right text-xs">
                <div className={`font-bold ${dbStatus.connected ? "text-emerald-400" : "text-amber-400"}`}>
                  MongoDB: {dbStatus.statusText}
                </div>
                <div className="text-[10px] text-slate-400">Host: {dbStatus.host}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab("hardware")}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === "hardware" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaLaptop /> Hardware Catalog ({hardwareProducts.length})
          </button>

          <button
            onClick={() => setActiveTab("software")}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === "software" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaDesktop /> Software & Cloud Catalog ({softwareProducts.length})
          </button>

          <button
            onClick={() => setActiveTab("busy-pricing")}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === "busy-pricing" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaTable /> BUSY Pricing Table ({busyPricing.length})
          </button>

          <button
            onClick={() => setActiveTab("tally-pricing")}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === "tally-pricing" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaTable /> Tally Pricing Table ({tallyPricing.length})
          </button>
        </div>

        {/* HARDWARE CATALOG TAB */}
        {activeTab === "hardware" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase font-display">Refurbished Hardware & Devices</h2>
              <button
                onClick={() => handleOpenAddModal("hardware")}
                className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <FaPlus /> Add New Hardware Product
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white font-extrabold uppercase">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Warranty</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {hardwareProducts.map((prod, idx) => {
                    const globalIdx = products.findIndex((p) => p.id === prod.id || p.name === prod.name);
                    return (
                      <tr key={prod.id || idx} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                          {prod.image && <img src={prod.image} alt="" className="h-10 w-10 object-contain rounded bg-slate-50 border p-1" />}
                          <div>
                            <div>{prod.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{prod.brand} — {prod.tag}</div>
                          </div>
                        </td>
                        <td className="p-4 uppercase font-bold text-slate-500">{prod.cat}</td>
                        <td className="p-4 font-extrabold text-slate-900">{prod.price}</td>
                        <td className="p-4 text-slate-600">{prod.warranty || "1 Year"}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(globalIdx, prod)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(globalIdx)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOFTWARE CATALOG TAB */}
        {activeTab === "software" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase font-display">Software & Cloud Licenses</h2>
              <button
                onClick={() => handleOpenAddModal("software")}
                className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <FaPlus /> Add New Software / Cloud Plan
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white font-extrabold uppercase">
                  <tr>
                    <th className="p-4">Software Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {softwareProducts.map((prod, idx) => {
                    const globalIdx = products.findIndex((p) => p.id === prod.id || p.name === prod.name);
                    return (
                      <tr key={prod.id || idx} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                          {prod.image && <img src={prod.image} alt="" className="h-10 w-10 object-contain rounded bg-slate-900 p-1" />}
                          <div>
                            <div>{prod.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{prod.tag}</div>
                          </div>
                        </td>
                        <td className="p-4 uppercase font-bold text-slate-500">{prod.type || prod.cat}</td>
                        <td className="p-4 font-extrabold text-slate-900">{prod.price}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(globalIdx, prod)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(globalIdx)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BUSY PRICING TABLE TAB */}
        {activeTab === "busy-pricing" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase font-display">BUSY Software Rate Card</h2>
              <button
                onClick={handleAddBusy}
                className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <FaPlus /> Add BUSY Variant
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white font-extrabold uppercase">
                  <tr>
                    <th className="p-4">Edition</th>
                    <th className="p-4">Variant Name</th>
                    <th className="p-4">Activation Price</th>
                    <th className="p-4">Renewal Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {busyPricing.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-500 uppercase">{item.edition}</td>
                      <td className="p-4 font-extrabold text-slate-900">{item.variant}</td>
                      <td className="p-4 font-bold text-slate-900">{item.activation}</td>
                      <td className="p-4 text-slate-600">{item.renewal}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => { setEditingBusyIndex(idx); setEditBusy({ ...item }); }}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBusy(idx)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TALLY PRICING TABLE TAB */}
        {activeTab === "tally-pricing" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase font-display">Tally Prime Official Rate Card</h2>
              <button
                onClick={handleAddTally}
                className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <FaPlus /> Add Tally Variant
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white font-extrabold uppercase">
                  <tr>
                    <th className="p-4">Variant Name</th>
                    <th className="p-4">Activation Price</th>
                    <th className="p-4">Annual TSS Renewal</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tallyPricing.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 font-extrabold text-slate-900">{item.variant}</td>
                      <td className="p-4 font-bold text-slate-900">{item.activation}</td>
                      <td className="p-4 text-slate-600">{item.renewal}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => { setEditingTallyIndex(idx); setEditTally({ ...item }); }}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTally(idx)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PRODUCT */}
        {editingProductIndex !== null && editProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
              <button
                onClick={() => setEditingProductIndex(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <FaTimes />
              </button>

              <h3 className="text-xl font-bold text-slate-900 font-display">Quick Edit Product</h3>
              <p className="text-xs text-slate-500 mt-1">Editing: <strong className="text-slate-800">{editProduct.name}</strong></p>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Selling Price</label>
                    <input
                      type="text"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">MRP Price</label>
                    <input
                      type="text"
                      value={editProduct.originalPrice || ""}
                      onChange={(e) => setEditProduct({ ...editProduct, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Image URLs (Comma Separated)</label>
                  <input
                    type="text"
                    value={editImagesInput}
                    onChange={(e) => setEditImagesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Key Features (Comma Separated)</label>
                  <textarea
                    rows={2}
                    value={editFeaturesInput}
                    onChange={(e) => setEditFeaturesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Technical Specs (Comma Separated Key:Value)</label>
                  <textarea
                    rows={3}
                    value={editSpecsInput}
                    onChange={(e) => setEditSpecsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditingProductIndex(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                  Cancel
                </button>
                <button onClick={handleSaveProductModal} className="btn-primary px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <FaSave /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT BUSY PRICING */}
        {editingBusyIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
              <button onClick={() => setEditingBusyIndex(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <FaTimes />
              </button>

              <h3 className="text-xl font-bold text-slate-900 font-display">Edit BUSY Pricing</h3>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Edition</label>
                  <input
                    type="text"
                    value={editBusy.edition}
                    onChange={(e) => setEditBusy({ ...editBusy, edition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Variant Name</label>
                  <input
                    type="text"
                    value={editBusy.variant}
                    onChange={(e) => setEditBusy({ ...editBusy, variant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Activation Price</label>
                  <input
                    type="text"
                    value={editBusy.activation}
                    onChange={(e) => setEditBusy({ ...editBusy, activation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Renewal Price</label>
                  <input
                    type="text"
                    value={editBusy.renewal}
                    onChange={(e) => setEditBusy({ ...editBusy, renewal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditingBusyIndex(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                  Cancel
                </button>
                <button onClick={handleSaveBusyModal} className="btn-primary px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT TALLY PRICING */}
        {editingTallyIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
              <button onClick={() => setEditingTallyIndex(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <FaTimes />
              </button>

              <h3 className="text-xl font-bold text-slate-900 font-display">Edit Tally Pricing</h3>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Variant Name</label>
                  <input
                    type="text"
                    value={editTally.variant}
                    onChange={(e) => setEditTally({ ...editTally, variant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Activation Price</label>
                  <input
                    type="text"
                    value={editTally.activation}
                    onChange={(e) => setEditTally({ ...editTally, activation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Annual TSS Renewal</label>
                  <input
                    type="text"
                    value={editTally.renewal}
                    onChange={(e) => setEditTally({ ...editTally, renewal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditingTallyIndex(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                  Cancel
                </button>
                <button onClick={handleSaveTallyModal} className="btn-primary px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
