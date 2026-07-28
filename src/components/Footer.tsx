import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { BRAND, SERVICES } from "@/data/site";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="container-x grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="VM Solutiions" className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg" />
            <span className="font-extrabold text-xl leading-none text-white tracking-tight font-display">
              VM <span className="text-primary">SOLUTIIONS</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your single trusted technology partner for Tally Prime, BUSY Software, commercial hardware, cloud hosting, and enterprise IT infrastructure.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase text-white tracking-wider mb-4 font-display">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/hardware" className="hover:text-white transition-colors">Commercial Hardware</Link></li>
            <li><Link to="/software" className="hover:text-white transition-colors">Software & Cloud</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase text-white tracking-wider mb-4 font-display">Our Services</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="hover:text-white transition-colors">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase text-white tracking-wider mb-4 font-display">Contact Info</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary text-sm shrink-0 mt-0.5" />
              <span>{BRAND.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-primary text-sm shrink-0" />
              <a href={`tel:${BRAND.phoneRaw}`} className="hover:text-white transition-colors">{BRAND.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary text-sm shrink-0" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <FaWhatsapp className="text-emerald-400 text-sm shrink-0" />
              <a href={`https://wa.me/${BRAND.phoneRaw}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp Instant Support</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© {new Date().getFullYear()} VM Solutiions. All Rights Reserved.</div>
        <div className="flex gap-6">
          <span>Tally & BUSY Authorized Partner</span>
          <Link to="/admin" className="hover:text-slate-400">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
