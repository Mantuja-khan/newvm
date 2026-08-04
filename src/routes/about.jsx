import { createFileRoute, Link } from "@tanstack/react-router";
import { FaCheckCircle, FaBullseye, FaEye, FaHeart, FaArrowRight, FaUserTie } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import aboutImg from "@/assets/about-team.jpg";
export const Route = createFileRoute("/about")({
    head: () => ({
        meta: [
            { title: "About Us — VM Solutiions" },
            { name: "description", content: "Learn about VM Solutiions — Founded by Vishal Singh (Founder) & Mantuja Khan (Partner) on 19 Feb 2026." },
            { property: "og:title", content: "About VM Solutiions" },
            { property: "og:description", content: "Empowering businesses with reliable IT solutions." },
        ],
    }),
    component: AboutPage,
});
function AboutPage() {
    return (<>
      <PageHero title="About VM Solutiions" crumb="About Us"/>

      {/* Intro Section */}
      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img src={aboutImg} width={1200} height={900} loading="lazy" alt="Our team" className="rounded-2xl shadow-[var(--shadow-card)] w-full h-[480px] object-cover"/>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-[var(--shadow-glow)]">
              <div className="text-2xl font-bold font-display">19 Feb 2026</div>
              <div className="text-xs opacity-90 mt-1">Founding Date</div>
            </div>
          </div>
          <div>
            <SectionHeading center={false} eyebrow="Who We Are" title={<>Your Long-term <span className="text-primary">IT Partner</span></>} subtitle="Founded on 19 Feb 2026 by Vishal Singh (Founder) & Mantuja Khan (Partner), VM Solutiions has grown into one of India's most trusted IT partners."/>
            <ul className="mt-8 space-y-3">
              {["Founded on 19 Feb 2026", "Leadership: Vishal Singh & Mantuja Khan", "Tally & BUSY Software Solutions", "Tally on AWS Cloud Hosting", "Pan-India Service Coverage"].map((f) => (<li key={f} className="flex items-center gap-3 font-medium">
                  <FaCheckCircle className="text-primary"/> {f}
                </li>))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership & Founders Section */}
      <section className="reveal py-20 bg-slate-900 text-white">
        <div className="container-x">
          <SectionHeading eyebrow="Company Leadership" title={<><span className="text-white">Meet Our</span> <span className="text-emerald-400">Founders & Leadership</span></>} subtitle="Guiding VM Solutiions towards technology excellence and client satisfaction."/>

          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-xl flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shrink-0">
                <FaUserTie />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
                  Founder & Managing Director
                </span>
                <h3 className="text-2xl font-black font-display text-white mt-2">Vishal Singh</h3>
                <p className="text-xs text-slate-400 mt-1">Driving strategic vision, corporate IT solutions, and client growth at VM Solutiions.</p>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-xl flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-3xl shrink-0">
                <FaUserTie />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded border border-sky-800/60">
                  Co-Founder & Partner
                </span>
                <h3 className="text-2xl font-black font-display text-white mt-2">Mantuja Khan</h3>
                <p className="text-xs text-slate-400 mt-1">Leading business operations, software licensing, and cloud service excellence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="reveal py-20 bg-surface">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            { icon: FaBullseye, title: "Our Mission", text: "To empower every Indian business — from startups to enterprises — with technology that is reliable, affordable and future-ready." },
            { icon: FaEye, title: "Our Vision", text: "To become the most trusted end-to-end IT solutions partner across South Asia — through service, integrity and innovation." },
            { icon: FaHeart, title: "Our Values", text: "Honesty first. Long-term relationships over short-term profits. Deep expertise, delivered with humility." },
        ].map((c) => (<div key={c.title} className="bg-white rounded-2xl p-8 shadow-[var(--shadow-soft)]">
              <div className="grid place-items-center h-14 w-14 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xl shadow-[var(--shadow-glow)]"><c.icon /></div>
              <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </div>))}
        </div>
      </section>

      <section className="reveal py-20">
        <div className="container-x text-center max-w-3xl">
          <h2 className="text-3xl font-bold">Ready to Upgrade Your Business Infrastructure?</h2>
          <p className="mt-4 text-muted-foreground">Talk to our experts today for a free consultation or custom quote.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/contact" className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl font-semibold">Contact Us <FaArrowRight /></Link>
            <Link to="/software" className="btn-outline py-3 px-6 rounded-xl font-semibold">Explore Software</Link>
          </div>
        </div>
      </section>
    </>);
}
