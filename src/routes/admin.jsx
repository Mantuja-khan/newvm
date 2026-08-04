import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaSave, FaLock, FaSignOutAlt, FaLaptop, FaDesktop, FaLayerGroup, FaTimes, FaImages, FaListUl, FaTable } from "react-icons/fa";
import { API_BASE } from "@/config/api";
export const Route = createFileRoute("/admin")({
    head: () => ({
        meta: [
            { title: "Admin Panel — VM Solutiions" },
            { name: "robots", content: "noindex, nofollow" }
        ],
    }),
    component: AdminPage,
});
const PRESET_IMAGES = [
    { label: "IdeaCentre Desktop", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { label: "Tower PC", url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80" },
    { label: "Dell Laptop", url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80" },
    { label: "ThinkPad Laptop", url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80" },
    { label: "Tally Logo", url: "/tally-logo.png" },
    { label: "BUSY Logo", url: "/busy-logo.png" },
];
function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("hardware");
    // Datasets
    const [products, setProducts] = useState([]);
    const [busyPricing, setBusyPricing] = useState([]);
    const [tallyPricing, setTallyPricing] = useState([]);
    // Editing States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    // Rich Form State
    const [editProduct, setEditProduct] = useState({
        id: "",
        type: "hardware",
        cat: "desktops",
        name: "",
        price: "",
        originalPrice: "",
        discount: "",
        rating: "4.6",
        reviewsCount: "100",
        tag: "",
        desc: "",
        image: "",
        images: [],
        features: [],
        brand: "",
        model: "",
        condition: "Refurbished - Grade A+",
        warranty: "1 Year Warranty",
        inStock: true,
        specs: {}
    });
    // Helper inputs inside modal
    const [imagesText, setImagesText] = useState("");
    const [featuresText, setFeaturesText] = useState("");
    const [specCategory, setSpecCategory] = useState("General");
    const [specKey, setSpecKey] = useState("");
    const [specVal, setSpecVal] = useState("");
    const [editingBusyIndex, setEditingBusyIndex] = useState(null);
    const [editBusy, setEditBusy] = useState({ edition: "Basic", variant: "", activation: "", renewal: "" });
    const [editingTallyIndex, setEditingTallyIndex] = useState(null);
    const [editTally, setEditTally] = useState({ variant: "", activation: "", renewal: "" });
    const [dbStatus, setDbStatus] = useState(null);
    // Load datasets from Backend
    const loadData = async () => {
        try {
            const prodRes = await fetch(`${API_BASE}/products`);
            if (prodRes.ok) {
                const prodData = await prodRes.json();
                if (Array.isArray(prodData))
                    setProducts(prodData);
            }
            const pricingRes = await fetch(`${API_BASE}/pricing`);
            if (pricingRes.ok) {
                const pricing = await pricingRes.json();
                if (pricing && Array.isArray(pricing.busy))
                    setBusyPricing(pricing.busy);
                if (pricing && Array.isArray(pricing.tally))
                    setTallyPricing(pricing.tally);
            }
            const dbRes = await fetch(`${API_BASE}/db-status`);
            if (dbRes.ok)
                setDbStatus(await dbRes.json());
        }
        catch (err) {
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
        }
        catch (err) {
            console.warn("Backend API login unreachable, evaluating admin credentials locally.");
        }
        if (trimmedEmail === "vishalvmsolutiions@gmail.com" && (trimmedPassword === "vishal@53990@" || trimmedPassword === "vishal@53990#")) {
            sessionStorage.setItem("admin-token", "vmsol-admin-token-xyz-123");
            setIsLoggedIn(true);
            loadData();
            setError("");
        }
        else {
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
        }
        catch (err) {
            console.error("Failed to save products to backend database.");
        }
    };
    const handleOpenAddModal = (productType) => {
        setEditingIndex(null);
        const initialProd = {
            id: `${productType}-${Date.now()}`,
            type: productType,
            cat: productType === "hardware" ? "desktops" : "software",
            name: "",
            price: "₹35,000",
            originalPrice: "₹40,000",
            discount: "13% Off",
            rating: "4.6",
            reviewsCount: "120",
            tag: productType === "hardware" ? "Core i3 10th · 8GB · 512GB SSD" : "Single User License",
            desc: "",
            image: PRESET_IMAGES[0].url,
            images: [PRESET_IMAGES[0].url],
            features: [
                "23.8-inch Full HD Borderless Display",
                "8GB DDR4 RAM with 512GB NVMe SSD Storage",
                "Pre-installed Windows 11 Genuine"
            ],
            brand: productType === "hardware" ? "Lenovo" : "Tally",
            model: "",
            condition: productType === "hardware" ? "Refurbished - Grade A+" : "Genuine License",
            warranty: productType === "hardware" ? "1 Year Warranty" : "1 Year Support",
            inStock: true,
            specs: {
                "General": {
                    "Model Name": "IdeaCentre A340",
                    "Color": "Black",
                    "Suitable For": "Office Work & Accounting"
                },
                "Processor & Memory": {
                    "Processor": "Intel Core i3 10th Gen",
                    "RAM": "8 GB DDR4"
                },
                "Storage & Display": {
                    "SSD Capacity": "512 GB NVMe SSD",
                    "Display": "23.8 inch Full HD"
                },
                "Warranty": {
                    "Warranty Summary": "1 Year VM Solutiions Warranty"
                }
            }
        };
        setEditProduct(initialProd);
        setImagesText((initialProd.images || []).join("\n"));
        setFeaturesText((initialProd.features || []).join("\n"));
        setIsModalOpen(true);
    };
    const handleOpenEditModal = (product, originalIndex) => {
        setEditingIndex(originalIndex);
        setEditProduct({ ...product });
        setImagesText((product.images && product.images.length > 0 ? product.images : [product.image || ""]).filter(Boolean).join("\n"));
        setFeaturesText((product.features || []).join("\n"));
        setIsModalOpen(true);
    };
    const handleSaveModalProduct = () => {
        if (!editProduct.name || !editProduct.price) {
            alert("Please provide Product Name and Selling Price.");
            return;
        }
        const imagesList = imagesText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        const featuresList = featuresText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        const finalProduct = {
            ...editProduct,
            image: imagesList[0] || editProduct.image || PRESET_IMAGES[0].url,
            images: imagesList.length > 0 ? imagesList : [editProduct.image || PRESET_IMAGES[0].url],
            features: featuresList,
            id: editProduct.id || `${editProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`
        };
        let updatedList = [...products];
        if (editingIndex !== null) {
            updatedList[editingIndex] = finalProduct;
        }
        else {
            updatedList.unshift(finalProduct);
        }
        setProducts(updatedList);
        saveProductsToBackend(updatedList);
        setIsModalOpen(false);
    };
    const handleDeleteProduct = (productToDelete) => {
        if (confirm(`Are you sure you want to delete "${productToDelete.name}"?`)) {
            const newProdList = products.filter((p) => p !== productToDelete);
            setProducts(newProdList);
            saveProductsToBackend(newProdList);
        }
    };
    // Add Spec entry to category
    const handleAddSpecItem = () => {
        if (!specKey.trim() || !specVal.trim())
            return;
        const currentSpecs = { ...(editProduct.specs || {}) };
        const sectionName = specCategory.trim() || "General";
        if (typeof currentSpecs[sectionName] === "object" && currentSpecs[sectionName] !== null) {
            currentSpecs[sectionName] = {
                ...currentSpecs[sectionName],
                [specKey.trim()]: specVal.trim()
            };
        }
        else {
            // If flat specs dictionary
            currentSpecs[sectionName] = {
                [specKey.trim()]: specVal.trim()
            };
        }
        setEditProduct({ ...editProduct, specs: currentSpecs });
        setSpecKey("");
        setSpecVal("");
    };
    const handleRemoveSpecItem = (section, key) => {
        const currentSpecs = { ...(editProduct.specs || {}) };
        if (typeof currentSpecs[section] === "object" && currentSpecs[section] !== null) {
            delete currentSpecs[section][key];
            if (Object.keys(currentSpecs[section]).length === 0) {
                delete currentSpecs[section];
            }
        }
        else {
            delete currentSpecs[key];
        }
        setEditProduct({ ...editProduct, specs: currentSpecs });
    };
    // PRICING OPERATIONS (BUSY / TALLY)
    const savePricingToBackend = async (busy, tally) => {
        try {
            await fetch(`${API_BASE}/pricing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ busy, tally }),
            });
        }
        catch (err) {
            console.error("Failed to save pricing to backend database.");
        }
    };
    const handleAddBusy = () => {
        const newBusyList = [...busyPricing, { edition: "Basic", variant: "New Variant", activation: "₹0", renewal: "₹0" }];
        setBusyPricing(newBusyList);
        setEditingBusyIndex(newBusyList.length - 1);
        setEditBusy(newBusyList[newBusyList.length - 1]);
        savePricingToBackend(newBusyList, tallyPricing);
    };
    const handleSaveBusy = (idx) => {
        const newBusyList = [...busyPricing];
        newBusyList[idx] = editBusy;
        setBusyPricing(newBusyList);
        setEditingBusyIndex(null);
        savePricingToBackend(newBusyList, tallyPricing);
    };
    const handleDeleteBusy = (idx) => {
        if (confirm("Are you sure you want to delete this variant?")) {
            const newBusyList = busyPricing.filter((_, i) => i !== idx);
            setBusyPricing(newBusyList);
            savePricingToBackend(newBusyList, tallyPricing);
        }
    };
    const handleAddTally = () => {
        const newTallyList = [...tallyPricing, { variant: "New Tally Variant", activation: "₹0", renewal: "₹0" }];
        setTallyPricing(newTallyList);
        setEditingTallyIndex(newTallyList.length - 1);
        setEditTally(newTallyList[newTallyList.length - 1]);
        savePricingToBackend(busyPricing, newTallyList);
    };
    const handleSaveTally = (idx) => {
        const newTallyList = [...tallyPricing];
        newTallyList[idx] = editTally;
        setTallyPricing(newTallyList);
        setEditingTallyIndex(null);
        savePricingToBackend(busyPricing, newTallyList);
    };
    const handleDeleteTally = (idx) => {
        if (confirm("Are you sure you want to delete this variant?")) {
            const newTallyList = tallyPricing.filter((_, i) => i !== idx);
            setTallyPricing(newTallyList);
            savePricingToBackend(busyPricing, newTallyList);
        }
    };
    if (!isLoggedIn) {
        return (<div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl">
              <FaLock />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 font-display">Admin Login</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage products & pricing charts</p>
          </div>
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-xs font-semibold text-slate-600">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="vishalvmsolutiions@gmail.com"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="••••••••"/>
            </div>
            <button type="submit" className="w-full btn-primary py-2.5 rounded-xl font-semibold mt-6">
              Sign In
            </button>
          </form>
        </div>
      </div>);
    }
    const safeProducts = Array.isArray(products) ? products : [];
    const hardwareProducts = safeProducts.filter((p) => p && (p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat || "")));
    const softwareProducts = safeProducts.filter((p) => p && (p.type === "software" || p.type === "cloud" || ["software", "cloud"].includes(p.cat || "")));
    return (<div className="min-h-screen bg-slate-50 py-10">
      <div className="container-x">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-display">Admin Control Center</h1>
            <p className="text-slate-500 text-sm mt-1">Manage Hardware Products (Multiple Images, Price, MRP, Specs) & Software Catalog.</p>

            {/* MongoDB Connection Status Indicator */}
            {dbStatus && (<div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all" style={{
                backgroundColor: dbStatus.connected ? "#ecfdf5" : "#fffbeb",
                borderColor: dbStatus.connected ? "#6ee7b7" : "#fcd34d",
                color: dbStatus.connected ? "#047857" : "#b45309"
            }}>
                <span className={`h-2.5 w-2.5 rounded-full ${dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                <span>
                  MongoDB Database: {dbStatus.connected ? `CONNECTED to Atlas (${dbStatus.host})` : dbStatus.statusText}
                </span>
              </div>)}
          </div>
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-100">
            <FaSignOutAlt /> Log Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-200 pb-4">
          {[
            { id: "hardware", label: `Hardware Products (${hardwareProducts.length})`, icon: FaLaptop },
            { id: "software", label: `Software Products (${softwareProducts.length})`, icon: FaLayerGroup },
            { id: "busy", label: "BUSY Price List", icon: FaDesktop },
            { id: "tally", label: "Tally Prime Price List", icon: FaDesktop }
        ].map((tab) => {
            const Icon = tab.icon;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/15"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                <Icon className="text-xs"/>
                {tab.label}
              </button>);
        })}
        </div>

        {/* HARDWARE PRODUCTS TAB */}
        {activeTab === "hardware" && (<div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hardware Products Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add desktop/laptop products with multiple images, red MRP, green selling price, features list and Flipkart-style specs.</p>
              </div>
              <Link to="/admin-add-product" search={{ type: "hardware" }} className="btn-primary flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold shadow-md">
                <FaPlus /> Add New Hardware Product
              </Link>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Image</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Selling Price</th>
                    <th className="py-3 px-3">Red MRP</th>
                    <th className="py-3 px-3">Discount</th>
                    <th className="py-3 px-3">Images Count</th>
                    <th className="py-3 px-3">Features Count</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {hardwareProducts.map((p, idx) => {
                return (<tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          {p.image ? (<img src={p.image} alt={p.name} className="h-10 w-12 object-contain rounded border border-slate-200 bg-slate-50"/>) : (<span className="text-[10px] text-slate-400 italic">No Image</span>)}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 leading-snug">{p.name}</div>
                          <span className="text-[11px] font-semibold text-slate-400">{p.brand || "Hardware"}</span>
                        </td>
                        <td className="py-3.5 px-3 text-emerald-600 font-extrabold text-base">{p.price}</td>
                        <td className="py-3.5 px-3 text-red-500 line-through text-xs font-semibold">{p.originalPrice || "-"}</td>
                        <td className="py-3.5 px-3">
                          {p.discount ? (<span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                              {p.discount}
                            </span>) : "-"}
                        </td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-slate-600">
                          {p.images?.length || 1} Photo(s)
                        </td>
                        <td className="py-3.5 px-3 text-xs font-semibold text-slate-600">
                          {p.features?.length || 0} Bullet(s)
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-3 whitespace-nowrap">
                          <Link to="/admin-add-product" search={{ id: p.id }} className="btn-outline py-1.5 px-3 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5">
                            <FaEdit /> Edit Specs & Photos
                          </Link>
                          <button onClick={() => handleDeleteProduct(p)} className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>
          </div>)}

        {/* SOFTWARE PRODUCTS TAB */}
        {activeTab === "software" && (<div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Software Solutions Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage genuine software packages, licensing tiers, MRP vs offer prices.</p>
              </div>
              <Link to="/admin-add-product" search={{ type: "software" }} className="btn-primary flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold shadow-md">
                <FaPlus /> Add New Software Product
              </Link>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Logo</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">License Tag</th>
                    <th className="py-3 px-3">MRP</th>
                    <th className="py-3 px-3">Selling Price</th>
                    <th className="py-3 px-3">Discount</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {softwareProducts.map((p, idx) => {
                const originalIdx = products.indexOf(p);
                return (<tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          {p.image ? (<img src={p.image} alt={p.name} className="h-8 w-8 object-contain rounded"/>) : (<span className="text-[10px] text-slate-400 italic">No Logo</span>)}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                            {p.tag}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-red-500 line-through text-xs font-medium">{p.originalPrice || "-"}</td>
                        <td className="py-3.5 px-3 text-emerald-600 font-bold">{p.price}</td>
                        <td className="py-3.5 px-3 text-emerald-600 font-bold text-xs">{p.discount || "-"}</td>
                        <td className="py-3.5 px-3 text-right space-x-3 whitespace-nowrap">
                          <Link to="/admin-add-product" search={{ id: p.id }} className="btn-outline py-1.5 px-3 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5">
                            <FaEdit /> Edit
                          </Link>
                          <button onClick={() => handleDeleteProduct(p)} className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>
          </div>)}

        {/* BUSY PRICING TAB */}
        {activeTab === "busy" && (<div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">BUSY Software Price Matrix ({busyPricing.length})</h2>
              <button onClick={handleAddBusy} className="btn-primary flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold">
                <FaPlus /> Add Variant
              </button>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Edition</th>
                    <th className="pb-3 px-2">Variant</th>
                    <th className="pb-3 px-2">Activation Price</th>
                    <th className="pb-3 px-2">Renewal Price</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {busyPricing.map((item, idx) => (<tr key={idx} className="hover:bg-slate-50/20">
                      {editingBusyIndex === idx ? (<>
                          <td className="py-3 px-2">
                            <select value={editBusy.edition} onChange={(e) => setEditBusy({ ...editBusy, edition: e.target.value })} className="px-2 py-1.5 border border-slate-200 bg-white rounded text-xs">
                              <option value="Basic">Basic</option>
                              <option value="Standard">Standard</option>
                              <option value="Enterprise">Enterprise</option>
                              <option value="Blue">Blue</option>
                              <option value="Saffron">Saffron</option>
                              <option value="Emerald">Emerald</option>
                            </select>
                          </td>
                          <td className="py-3 px-2">
                            <input type="text" value={editBusy.variant} onChange={(e) => setEditBusy({ ...editBusy, variant: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2">
                            <input type="text" value={editBusy.activation} onChange={(e) => setEditBusy({ ...editBusy, activation: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2">
                            <input type="text" value={editBusy.renewal} onChange={(e) => setEditBusy({ ...editBusy, renewal: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => handleSaveBusy(idx)} className="text-green-600 hover:text-green-800 text-xs font-bold flex items-center gap-1 inline-flex">
                              <FaSave /> Save
                            </button>
                          </td>
                        </>) : (<>
                          <td className="py-4 px-2 font-bold">{item.edition}</td>
                          <td className="py-4 px-2 font-medium text-slate-700">{item.variant}</td>
                          <td className="py-4 px-2 font-bold text-slate-900">{item.activation}</td>
                          <td className="py-4 px-2 font-semibold text-slate-600">{item.renewal}</td>
                          <td className="py-4 px-2 text-right space-x-4 whitespace-nowrap">
                            <button onClick={() => {
                        setEditingBusyIndex(idx);
                        setEditBusy(item);
                    }} className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
                              <FaEdit className="text-xs"/> Edit
                            </button>
                            <button onClick={() => handleDeleteBusy(idx)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-1">
                              <FaTrash className="text-xs"/> Delete
                            </button>
                          </td>
                        </>)}
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {/* TALLY PRICING TAB */}
        {activeTab === "tally" && (<div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Tally Prime Price Matrix ({tallyPricing.length})</h2>
              <button onClick={handleAddTally} className="btn-primary flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold">
                <FaPlus /> Add Variant
              </button>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Variant</th>
                    <th className="pb-3 px-2">Activation Price</th>
                    <th className="pb-3 px-2">Annual TSS Renewal</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {tallyPricing.map((item, idx) => (<tr key={idx} className="hover:bg-slate-50/20">
                      {editingTallyIndex === idx ? (<>
                          <td className="py-3 px-2">
                            <input type="text" value={editTally.variant} onChange={(e) => setEditTally({ ...editTally, variant: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2">
                            <input type="text" value={editTally.activation} onChange={(e) => setEditTally({ ...editTally, activation: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2">
                            <input type="text" value={editTally.renewal} onChange={(e) => setEditTally({ ...editTally, renewal: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-xs w-full"/>
                          </td>
                          <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => handleSaveTally(idx)} className="text-green-600 hover:text-green-800 text-xs font-bold flex items-center gap-1 inline-flex">
                              <FaSave /> Save
                            </button>
                          </td>
                        </>) : (<>
                          <td className="py-4 px-2 font-medium text-slate-700">{item.variant}</td>
                          <td className="py-4 px-2 font-bold text-slate-900">{item.activation}</td>
                          <td className="py-4 px-2 font-semibold text-slate-600">{item.renewal}</td>
                          <td className="py-4 px-2 text-right space-x-4 whitespace-nowrap">
                            <button onClick={() => {
                        setEditingTallyIndex(idx);
                        setEditTally(item);
                    }} className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
                              <FaEdit className="text-xs"/> Edit
                            </button>
                            <button onClick={() => handleDeleteTally(idx)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-1">
                              <FaTrash className="text-xs"/> Delete
                            </button>
                          </td>
                        </>)}
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>

      {/* RICH PRODUCT MODAL (ADD / EDIT ALL FIELDS) */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl my-8 border-none">
            <div className="flex justify-between items-center pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {editingIndex !== null ? "Edit Product Details" : "Add New Product"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure hardware & software product pricing, photos, features & specs cleanly.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm transition-colors border-none">
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {/* Product Type & Category */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Product Type</label>
                <select value={editProduct.type} onChange={(e) => setEditProduct({ ...editProduct, type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none">
                  <option value="hardware">Hardware (Desktop, Laptop, Printer)</option>
                  <option value="software">Software (Tally, BUSY, ERP)</option>
                  <option value="cloud">Cloud Solution</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Category</label>
                <select value={editProduct.cat} onChange={(e) => setEditProduct({ ...editProduct, cat: e.target.value })} className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none">
                  <option value="desktops">Desktops & All-in-One PCs</option>
                  <option value="laptops">Laptops</option>
                  <option value="workstations">Workstations</option>
                  <option value="accessories">Printers & Accessories</option>
                  <option value="software">Software</option>
                  <option value="cloud">Cloud Solutions</option>
                </select>
              </div>

              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 mb-1 block">Product Name *</label>
                <input type="text" required value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} placeholder="e.g. LENOVO IDEACENTRE A340 24IWL / DELL LATITUDE 5490" className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm font-bold tracking-wide uppercase outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              {/* Selling Price & MRP */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Selling Price *</label>
                <input type="text" required value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} placeholder="e.g. ₹35,000" className="w-full px-4 py-2.5 bg-slate-100/80 text-slate-900 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-slate-300 transition-all border-none"/>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Original Price / MRP</label>
                <input type="text" value={editProduct.originalPrice || ""} onChange={(e) => setEditProduct({ ...editProduct, originalPrice: e.target.value })} placeholder="e.g. ₹40,000" className="w-full px-4 py-2.5 bg-slate-100/80 text-slate-900 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-slate-300 transition-all border-none"/>
              </div>

              {/* Discount Tag & Badge Tag */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Discount Tag</label>
                <input type="text" value={editProduct.discount || ""} onChange={(e) => setEditProduct({ ...editProduct, discount: e.target.value })} placeholder="e.g. 13% Off" className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Specs Highlight Badge</label>
                <input type="text" value={editProduct.tag} onChange={(e) => setEditProduct({ ...editProduct, tag: e.target.value })} placeholder="e.g. Core i3 10th · 8GB · 512GB SSD" className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              {/* Brand & Condition */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Brand Name</label>
                <input type="text" value={editProduct.brand || ""} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} placeholder="e.g. Lenovo, Dell, HP" className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Condition & Warranty</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={editProduct.condition || ""} onChange={(e) => setEditProduct({ ...editProduct, condition: e.target.value })} placeholder="Refurbished - Grade A+" className="px-3.5 py-2.5 bg-slate-100/80 rounded-2xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
                  <input type="text" value={editProduct.warranty || ""} onChange={(e) => setEditProduct({ ...editProduct, warranty: e.target.value })} placeholder="1 Year Warranty" className="px-3.5 py-2.5 bg-slate-100/80 rounded-2xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
                </div>
              </div>

              {/* Multiple Image URLs */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <FaImages className="text-primary"/> Product Images (One URL per line)
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">First URL is main photo</span>
                </div>
                <textarea rows={3} value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder={`https://images.unsplash.com/photo-1527443224154-c4a3942d3acf...\nhttps://images.unsplash.com/photo-1587831990711...`} className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-xs font-mono outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">Quick Presets:</span>
                  {PRESET_IMAGES.map((img) => (<button key={img.label} type="button" onClick={() => setImagesText((prev) => (prev ? prev + "\n" + img.url : img.url))} className="px-2.5 py-1 bg-slate-100 hover:bg-primary hover:text-white rounded-full text-[10px] font-semibold text-slate-600 transition-colors border-none">
                      + {img.label}
                    </button>))}
                </div>
              </div>

              {/* Features List */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                  <FaListUl className="text-primary"/> Key Highlights & Features (One per line)
                </label>
                <textarea rows={3} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={`23.8-inch Full HD Borderless IPS Display\nIntel Core i3 10th Gen Processor\n8GB DDR4 RAM with 512GB NVMe SSD`} className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 mb-1 block">Short Product Description</label>
                <textarea rows={2} value={editProduct.desc} onChange={(e) => setEditProduct({ ...editProduct, desc: e.target.value })} placeholder="Overview of product performance, suitability for accounting and productivity..." className="w-full px-4 py-2.5 bg-slate-100/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border-none"/>
              </div>

              {/* Specs Editor */}
              <div className="sm:col-span-2 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <FaTable className="text-primary"/> Technical Specifications
                </h4>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  {Object.entries(editProduct.specs || {}).map(([sectionName, sectionData]) => (<div key={sectionName} className="bg-white rounded-2xl p-3 shadow-sm space-y-1.5">
                      <div className="font-bold text-xs text-slate-800">
                        {sectionName}
                      </div>
                      <div className="space-y-1">
                        {typeof sectionData === "object" && sectionData !== null ? (Object.entries(sectionData).map(([k, v]) => (<div key={k} className="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-50 rounded-xl">
                              <span className="font-semibold text-slate-600 w-1/3">{k}:</span>
                              <span className="text-slate-800 font-bold flex-1">{String(v)}</span>
                              <button type="button" onClick={() => handleRemoveSpecItem(sectionName, k)} className="text-slate-400 hover:text-red-600 font-bold text-xs">
                                ✕
                              </button>
                            </div>))) : (<div className="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-50 rounded-xl">
                            <span className="font-semibold text-slate-600 w-1/3">{sectionName}:</span>
                            <span className="text-slate-800 font-bold flex-1">{String(sectionData)}</span>
                            <button type="button" onClick={() => handleRemoveSpecItem("General", sectionName)} className="text-slate-400 hover:text-red-600 font-bold text-xs">
                              ✕
                            </button>
                          </div>)}
                      </div>
                    </div>))}

                  <div className="pt-1 flex flex-wrap sm:flex-nowrap gap-2 bg-white p-3 rounded-2xl shadow-sm">
                    <select value={specCategory} onChange={(e) => setSpecCategory(e.target.value)} className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold outline-none border-none shrink-0">
                      <option value="General">General</option>
                      <option value="Processor & Memory">Processor & Memory</option>
                      <option value="Storage & Display">Storage & Display</option>
                      <option value="Ports & Connectivity">Ports & Connectivity</option>
                      <option value="Warranty">Warranty</option>
                    </select>
                    <input type="text" placeholder="Property (RAM)" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="px-3 py-2 bg-slate-100 rounded-xl text-xs outline-none border-none flex-1"/>
                    <input type="text" placeholder="Value (8 GB DDR4)" value={specVal} onChange={(e) => setSpecVal(e.target.value)} className="px-3 py-2 bg-slate-100 rounded-xl text-xs outline-none border-none flex-1"/>
                    <button type="button" onClick={handleAddSpecItem} className="btn-primary py-2 px-4 text-xs font-bold rounded-xl shrink-0">
                      + Add Spec
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold transition-colors border-none">
                Cancel
              </button>
              <button type="button" onClick={handleSaveModalProduct} className="btn-primary py-2.5 px-6 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20">
                <FaSave className="inline mr-1.5"/> Save Product
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
