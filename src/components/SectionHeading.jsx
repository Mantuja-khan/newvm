import { motion } from "framer-motion";
import { TextReveal } from "./TextReveal";

export function SectionHeading({ eyebrow, title, subtitle, center = true, className = "" }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="eyebrow before:content-[''] before:h-[2px] before:w-8 before:bg-primary inline-flex"
        >
          {eyebrow}
        </motion.span>
      )}
      <TextReveal
        as="h2"
        className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
        stagger={0.045}
      >
        {title}
      </TextReveal>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-muted-foreground leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
