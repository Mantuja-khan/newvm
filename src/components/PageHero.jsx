import { Link } from "@tanstack/react-router";
import { FaHome, FaChevronRight } from "react-icons/fa";
export function PageHero({ title, crumb }) {
    return (<section className="relative overflow-hidden bg-[image:var(--gradient-dark)] text-white">
      <div className="absolute inset-0 dot-pattern opacity-30"/>
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl"/>
      <div className="container-x relative py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
        <nav className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-primary">
            <FaHome /> Home
          </Link>
          <FaChevronRight className="text-[9px] text-primary"/>
          <span className="text-white">{crumb}</span>
        </nav>
      </div>
    </section>);
}
