import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaChevronDown, FaBars, FaTimes, FaPhoneAlt } from "react-icons/fa";
import { BRAND, SERVICES } from "@/data/site";
import logoImg from "@/assets/logo.png";
const NAV = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
  { to: "/hardware", label: "HARDWARE" },
  { to: "/software", label: "SOFTWARE" },
  { to: "/services", label: "SERVICES", mega: true },
  { to: "/contact", label: "CONTACT" },
];
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);
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
            <a href={`mailto:${BRAND.email}`} className="hover:text-white">
              {BRAND.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur shadow-[var(--shadow-soft)]" : "bg-white"}`}
      >
        <div className="container-x flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <img src={logoImg} alt={BRAND.name} className="h-18 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <div
                key={n.to}
                className="relative"
                onMouseEnter={() => n.mega && setMegaOpen(true)}
                onMouseLeave={() => n.mega && setMegaOpen(false)}
              >
                <Link
                  to={n.to}
                  className="px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  activeProps={{
                    className:
                      "px-4 py-2 text-sm font-semibold text-primary inline-flex items-center gap-1.5",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                  {n.mega && <FaChevronDown className="text-[9px] opacity-70" />}
                </Link>

                {n.mega && megaOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="rounded-xl bg-white shadow-md border border-slate-200 py-2 flex flex-col">
                      {SERVICES.filter(
                        (s) => !["amc-consultancy", "support", "laptops-desktops"].includes(s.slug),
                      ).map((s) => (
                        <Link
                          key={s.slug}
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-slate-50 transition-colors"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:inline-flex btn-primary">
              Get a Quote
            </Link>
            <button
              className="lg:hidden grid place-items-center h-10 w-10 rounded-lg border border-border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-white">
            <div className="container-x py-4 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="py-3 border-b border-border font-semibold text-foreground/80"
                  activeProps={{
                    className: "py-3 border-b border-border font-semibold text-primary",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/contact" className="btn-primary mt-4 justify-center">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
