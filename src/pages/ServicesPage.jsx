import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES } from "@/data/site";

export function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" crumb="Services" />

      <section className="reveal py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What We Offer" title={<>Complete <span className="text-primary">IT Services</span> Portfolio</>} subtitle="One partner. Zero handoffs. Every technology decision your business needs — under one roof." />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/services/${s.slug}`} className="group block h-full bg-white rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all">
                  <span className="grid place-items-center h-14 w-14 rounded-xl bg-accent text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <s.icon />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read More <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
