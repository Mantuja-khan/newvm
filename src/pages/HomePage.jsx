import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  FaArrowRight, FaCheckCircle, FaShieldAlt,
  FaLightbulb, FaHandshake, FaPlus, FaMinus,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { SERVICES, PROJECTS, BRAND } from "@/data/site";
import aboutImg from "@/assets/about-team.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { API_BASE } from "@/config/api";

const HERO_SLIDES = SERVICES.filter((s) => s.image);

const WHY = [
  { icon: FaShieldAlt, title: "Trusted & Certified", text: "Expert solutions for Tally, BUSY and leading cloud vendors." },
  { icon: FaLightbulb, title: "Solution First Thinking", text: "We solve business problems, not just deliver invoices." },
  { icon: FaHandshake, title: "Long-term Partnership", text: "98% of our clients renew — because we obsess over outcomes." },
];

const PROCESS = [
  { n: "01", t: "Discover", d: "We understand your business, systems and goals." },
  { n: "02", t: "Design", d: "Blueprint the solution with clear scope and outcomes." },
  { n: "03", t: "Deliver", d: "Deploy with zero downtime and quality checks." },
  { n: "04", t: "Support", d: "Ongoing training and priority support." },
];

const TESTIMONIALS = [
  { name: "Rakesh Sharma", role: "Director, Sharma Traders", text: "VM Solutiions migrated our entire billing to Tally Prime with zero downtime. Their team is a joy to work with." },
  { name: "Priya Menon", role: "Founder, Verdant Retail", text: "Our new website converts 3x better and loads instantly. Best ROI decision we made this year." },
  { name: "Aakash Kapoor", role: "CTO, LogiFast", text: "Their support team is proactive — we've had zero critical outages in 18 months. Absolutely recommended." },
  { name: "Neha Gupta", role: "CEO, Bloom Studios", text: "Cloud hosting migration was seamless. Fast servers, great support and transparent pricing." },
];

const FAQS = [
  { q: "Do you provide on-site support outside Delhi NCR?", a: "Yes. We offer on-site visits across major Indian locations and remote support pan-India, 24×7." },
  { q: "Are refurbished laptops covered by warranty?", a: "All refurbished devices ship with a minimum 6-month warranty, extendable up to 24 months." },
  { q: "Can you migrate my existing Tally data to a new system?", a: "Absolutely. Data migration, cleanup and validation are included in every setup engagement." },
  { q: "Do you offer priority remote desktop support?", a: "Yes — emergency remote desktop assistance, routine health checks and software setup are included." },
  { q: "Do you offer white-label web development?", a: "Yes — agencies and consultants can partner with us under NDA for white-label delivery." },
];

export function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [homeReviews, setHomeReviews] = useState(TESTIMONIALS);
  const active = HERO_SLIDES[heroIdx] ?? HERO_SLIDES[0];

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setHomeReviews([...data, ...TESTIMONIALS]);
          }
        }
      } catch (err) {
        console.log("Could not load reviews from backend, using defaults.");
      }
    };
    fetchHomeReviews();
  }, []);

  return (
    <>
      {/* HERO / TOP CTA */}
      <section className="reveal relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-cta-bg.png')" }}>
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-8 bottom-8 dot-pattern h-40 w-40 opacity-40" />
        <div className="container-x relative pt-8 pb-16 md:pt-10 md:pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <span className="eyebrow text-xs sm:text-sm">— Welcome to VM Solutiions</span>
            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05]">
              {active.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="text-primary not-italic font-display italic">
                {active.title.split(" ").slice(-1).join(" ")}
              </em>
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              {active.short}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`/services/${active.slug}`} className="btn-primary">
                Learn More <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn-outline">Get a Quote</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative group order-1 lg:order-2"
          >
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                spaceBetween={0}
                slidesPerView={1}
                onSlideChange={(sw) => setHeroIdx(sw.realIndex)}
                className="hero-swiper"
              >
                {HERO_SLIDES.map((s) => (
                  <SwiperSlide key={s.slug}>
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="eager"
                      className="w-full h-[200px] sm:h-[300px] md:h-[480px] object-contain mx-auto"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SLIDER */}
      <section className="reveal py-20 md:py-24 bg-surface overflow-hidden">
        <div className="container-x">
          <SectionHeading eyebrow="Our Services" title={<>High Quality <span className="text-primary">IT Services</span></>} subtitle="Everything your business needs, from a single accountable partner." />
          <div className="mt-14">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-14"
            >
              {SERVICES.map((s) => (
                <SwiperSlide key={s.slug} className="h-auto">
                  <Link
                    to={`/services/${s.slug}`}
                    className="group relative flex flex-col h-full bg-white rounded-2xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] border border-transparent hover:border-primary/20 transition-all overflow-hidden"
                  >
                    <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[image:var(--gradient-primary)] opacity-0 group-hover:opacity-15 transition-opacity" />
                    <span className="grid place-items-center h-14 w-14 rounded-xl bg-accent text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                      <s.icon />
                    </span>
                    <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{s.short}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Read More <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ABOUT / WHY US */}
      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <img src={aboutImg} width={1200} height={900} loading="lazy" alt="About VM Solutiions" className="rounded-2xl shadow-[var(--shadow-card)] object-cover w-full h-[420px]" />
          </motion.div>
          <div>
            <SectionHeading center={false} eyebrow="More About Us" title={<>We Provide Best Business <span className="text-primary">Solutions in Town</span></>} subtitle="For over two decades, we've helped Indian businesses adopt the right technology at the right time — practical, reliable and honestly priced." />
            <ul className="mt-8 space-y-3">
              {["24/7 On-site Services Available", "Great Skilled Consultants", "Expert Team Members", "Solution for Every Business Size"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium">
                  <FaCheckCircle className="text-primary" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">Learn More <FaArrowRight /></Link>
              <a href={`tel:${BRAND.phoneRaw}`} className="btn-outline">{BRAND.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="reveal py-24 bg-surface">
        <div className="container-x">
          <SectionHeading eyebrow="Why Choose Us" title={<>Reasons Businesses <span className="text-primary">Trust VM Solutiions</span></>} />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {WHY.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
                <div className="grid place-items-center h-14 w-14 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xl shadow-[var(--shadow-glow)]">
                  <w.icon />
                </div>
                <h3 className="mt-5 text-xl font-bold">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="reveal py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Our Process" title={<>How We <span className="text-primary">Deliver Results</span></>} />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {PROCESS.map((p, i) => (
              <motion.div key={p.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative p-8 rounded-2xl bg-white border border-border hover:shadow-[var(--shadow-card)] transition-shadow">
                <div className="text-5xl font-black text-primary/15 font-display">{p.n}</div>
                <h3 className="mt-2 text-lg font-bold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WEBSITE PROJECTS CAROUSEL */}
      <section className="reveal py-24 bg-surface overflow-hidden">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Portfolio"
            title={<>Featured <span className="text-primary">Website Projects</span></>}
            subtitle="Explore websites and web applications built by VM Solutiions."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.slice(0, 3).map((p) => (
              <div
                key={p.title}
                className="group bg-white rounded-none overflow-hidden border border-slate-200 hover:border-primary hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 rounded-none">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 rounded-none"
                  />
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                  <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 mb-2 font-display uppercase">
                    {p.title}
                  </h4>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-2 text-xs font-extrabold flex items-center justify-center gap-2 rounded-none tracking-wider uppercase"
                    >
                      Visit Website <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="btn-outline w-full py-2 text-xs font-extrabold flex items-center justify-center gap-2 rounded-none tracking-wider uppercase"
                    >
                      Enquire Project <FaArrowRight className="text-[10px]" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-[1fr_1.4fr] gap-14 items-start">
          <div className="lg:sticky lg:top-32">
            <SectionHeading center={false} eyebrow="FAQs" title={<>Answers to <span className="text-primary">Common Questions</span></>} subtitle="Can't find what you're looking for? Reach out — a human will reply within one business hour." />
            <Link to="/contact" className="btn-primary mt-6">Ask a Question <FaArrowRight /></Link>
          </div>
          <FAQList />
        </div>
      </section>
    </>
  );
}

function FAQList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => (
        <div key={i} className={`rounded-xl border transition-all ${open === i ? "border-primary bg-white shadow-[var(--shadow-soft)]" : "border-border bg-white"}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold">
            <span>{f.q}</span>
            <span className={`grid place-items-center h-8 w-8 rounded-full ${open === i ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
              {open === i ? <FaMinus className="text-xs" /> : <FaPlus className="text-xs" />}
            </span>
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}
