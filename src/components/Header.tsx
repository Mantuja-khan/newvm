import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaLaptop, FaCloud, FaDesktop, FaCode, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { BRAND, NAV_LINKS } from "@/data/site";
import logoImg from "@/assets/logo.png";

export function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="container-x flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <a href={`tel:${BRAND.phoneRaw}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <FaPhoneAlt className="text-primary text-[10px]" />
              <span>{BRAND.phone}</span>
            </a>
            <a href={`mailto:${BRAND.email}`} className="hidden sm:flex items-center gap-2 hover:text-primary transition-colors">
              <FaEnvelope className="text-primary text-[10px]" />
              <span>{BRAND.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400">Authorized Tally & BUSY Partner</span>
            <Link to="/admin" className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <FaUserShield className="text-[10px]" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      <div className={`bg-white/95 backdrop-blur-md transition-all duration-300 border-b ${scrolled ? "border-slate-200 shadow-md py-3" : "border-slate-100 py-4"}`}>
        <div className="container-x flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="VM Solutiions" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none text-slate-900 tracking-tight font-display">
                VM <span className="text-primary">SOLUTIIONS</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">
                Technology & Cloud Partner
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-primary ${isActive ? "text-primary font-bold" : "text-slate-700"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact" className="btn-primary text-xs px-5 py-2.5 font-bold uppercase tracking-wider rounded-xl">
              Get Free Quote
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-bold text-slate-800 hover:text-primary py-1 border-b border-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <Link to="/contact" className="btn-primary w-full text-center py-3 text-xs font-bold uppercase tracking-wider rounded-xl">
              Get Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
