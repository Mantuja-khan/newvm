import { motion } from "framer-motion";
export function SectionHeading({ eyebrow, title, subtitle, center = true, }) {
    return (<motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="eyebrow before:content-[''] before:h-[2px] before:w-8 before:bg-primary">{eyebrow}</span>
      <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </motion.div>);
}
