import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaChevronDown, FaBars, FaTimes, FaPhoneAlt } from "react-icons/fa";
import { BRAND, SERVICES } from "@/data/site";
import logoImg from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/hardware", label: "Hardware" },
  { to: "/software", label: "Software" },
  { to: "/services", label: "Services", mega: true },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-[color:var(--primary-dark)] text-white/90 text-xs">
        <div className="container-x flex items-center justify-between py-2">
          <span>Working Hours: {BRAND.hours}</span>
          <div className="flex items-center gap-5">
            <a href={`tel:${BRAND.phoneRaw}`} className="hover:text-white flex items-center gap-2">
              <FaPhoneAlt className="text-[10px]" /> {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="hover:text-white">{BRAND.email}</a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur shadow-[var(--shadow-soft)]" : "bg-white"
        }`}
      >
        <div className="container-x flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <img src={logoImg} alt={BRAND.name} className="h-18 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const isActive = location.pathname === n.to;
              return (
                <div
                  key={n.to}
                  className="relative"
                  onMouseEnter={() => n.mega && setMegaOpen(true)}
                  onMouseLeave={() => n.mega && setMegaOpen(false)}
                >
                  <Link
                    to={n.to}
                    className={`px-4 py-2 text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${
                      isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    {n.label}
                    {n.mega && <FaChevronDown className="text-[9px] opacity-70" />}
                  </Link>

                  {n.mega && megaOpen && (
                    <div className="absolute left-0 top-full pt-2 w-64">
                      <div className="rounded-xl bg-white shadow-md border border-slate-200 py-2 flex flex-col">
                        {SERVICES.filter(
                          (s) => !["amc-consultancy", "support", "laptops-desktops"].includes(s.slug)
                        ).map((s) => (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-slate-50 transition-colors"
                          >
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden sm:inline-flex btn-primary">
              Get Started
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-xl text-foreground hover:text-primary"
              aria-label="Toggle menu"
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-3">
            {NAV.map((n) => (
              <div key={n.to}>
                <Link
                  to={n.to}
                  className="block py-2 text-base font-semibold text-foreground/90 hover:text-primary"
                >
                  {n.label}
                </Link>
                {n.mega && (
                  <div className="pl-4 border-l-2 border-primary/20 space-y-2 mt-1">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="block text-sm text-foreground/70 hover:text-primary"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3">
              <Link to="/contact" className="btn-primary w-full text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
