import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { BRAND, SERVICES } from "@/data/site";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="relative mt-24 text-white bg-[image:var(--gradient-dark)] overflow-hidden">
      {/* 3 Random Dotted Squares */}
      <div className="absolute top-6 left-8 w-28 h-28 dot-pattern-white opacity-25 border border-white/10 rounded-xl pointer-events-none -rotate-6 hidden sm:block" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-36 h-36 dot-pattern-white opacity-20 border border-white/10 rounded-2xl pointer-events-none rotate-12 hidden md:block" />
      <div className="absolute bottom-8 left-1/3 w-32 h-32 dot-pattern-white opacity-25 border border-white/10 rounded-xl pointer-events-none rotate-3" />

      <div className="container-x pt-20 pb-10 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <img src={logoImg} alt={BRAND.name} className="h-16 w-auto object-contain bg-white rounded-xl p-2 shadow-lg"/>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            {BRAND.full} is a trusted technology partner delivering software, cloud, hardware and consulting solutions to modern businesses across India.
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid place-items-center h-9 w-9 rounded-full border border-white/20 hover:bg-primary hover:border-primary transition-colors">
                <Icon className="text-xs"/>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/hardware", "Hardware Products"],
              ["/software", "Software Products"],
              ["/products", "All Products"],
              ["/services", "Services"],
              ["/contact", "Contact"]
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary inline-flex items-center gap-2">
                  <FaArrowRight className="text-[9px] text-primary"/> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-5">Services</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-primary inline-flex items-center gap-2">
                  <FaArrowRight className="text-[9px] text-primary"/> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-5">Get in Touch</h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <FaMapMarkerAlt className="text-primary mt-1 shrink-0"/>
              <span>{BRAND.address}</span>
            </li>
            <li className="flex gap-3">
              <FaPhoneAlt className="text-primary mt-1 shrink-0"/>
              <a href={`tel:${BRAND.phoneRaw}`} className="hover:text-primary">{BRAND.phone}</a>
            </li>
            <li className="flex gap-3">
              <FaEnvelope className="text-primary mt-1 shrink-0"/>
              <a href={`mailto:${BRAND.email}`} className="hover:text-primary">{BRAND.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 relative z-10">
        <div className="container-x py-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} {BRAND.full}. All Rights Reserved.</p>
          <p>Crafted with care in Bhiwadi, Rajasthan.</p>
        </div>
      </div>
    </footer>
  );
}
