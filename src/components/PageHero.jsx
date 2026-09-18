import { Link } from "@tanstack/react-router";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { TextReveal } from "./TextReveal";

export function PageHero({ title, crumb }) {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-dark)] text-white">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

      {/* 3 Random Dotted Squares */}
      <div className="absolute top-6 left-10 w-24 h-24 dot-pattern-white opacity-25 rounded-lg pointer-events-none -rotate-6" />
      <div className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 dot-pattern-white opacity-20 rounded-xl pointer-events-none rotate-12 hidden sm:block" />
      <div className="absolute bottom-4 left-1/3 w-28 h-28 dot-pattern-white opacity-25 rounded-lg pointer-events-none rotate-3" />

      <div className="container-x relative py-24 md:py-32 text-center z-10">
        <TextReveal
          as="h1"
          animateDirect
          className="text-4xl md:text-6xl font-bold tracking-tight"
          stagger={0.045}
        >
          {title}
        </TextReveal>
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-5 inline-flex items-center gap-2 text-sm text-white/70"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-primary">
            <FaHome /> Home
          </Link>
          <FaChevronRight className="text-[9px] text-primary" />
          <span className="text-white">{crumb}</span>
        </motion.nav>
      </div>
    </section>
  );
}
