import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { HardwarePage } from "@/pages/HardwarePage";
import { HardwareDetailPage } from "@/pages/HardwareDetailPage";
import { SoftwarePage } from "@/pages/SoftwarePage";
import { SoftwareDetailPage } from "@/pages/SoftwareDetailPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { ContactPage } from "@/pages/ContactPage";
import { AdminPage } from "@/pages/AdminPage";
import { AdminAddProductPage } from "@/pages/AdminAddProductPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/hardware" element={<HardwarePage />} />
          <Route path="/hardware/:id" element={<HardwareDetailPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/software/:id" element={<SoftwareDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-add-product" element={<AdminAddProductPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
