import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FaCheckCircle,
  FaBullseye,
  FaEye,
  FaHeart,
  FaArrowRight,
  FaUserTie,
  FaLaptopCode,
  FaCloud,
  FaCalculator,
  FaShieldAlt,
} from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { TextReveal } from "@/components/TextReveal";
import aboutImg from "@/assets/about-team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — VM Solutiions" },
      {
        name: "description",
        content: "Learn about VM Solutiions — Founded by Vishal Singh on 19 Feb 2026.",
      },
      { property: "og:title", content: "About VM Solutiions" },
      { property: "og:description", content: "Empowering businesses with reliable IT solutions." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const SPECIALITIES = [
    {
      icon: FaCalculator,
      title: "Tally & BUSY Accounting",
      desc: "Expert setup, licensing, data migration & compliance.",
    },
    {
      icon: FaCloud,
      title: "Cloud & AWS Hosting",
      desc: "Enterprise cloud hosting, VPS & Tally on AWS solutions.",
    },
    {
      icon: FaLaptopCode,
      title: "Web & Software Solutions",
      desc: "Custom web development, portal engineering & UI/UX.",
    },
    {
      icon: FaShieldAlt,
      title: "IT Infrastructure Strategy",
      desc: "End-to-end IT consulting, hardware sales & 24/7 support.",
    },
  ];

  return (
    <>
      <PageHero title="About VM Solutiions" crumb="About Us" />

      {/* Intro Section */}
      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src={aboutImg}
              width={1200}
              height={900}
              loading="lazy"
              alt="Our team"
              className="rounded-2xl shadow-[var(--shadow-card)] w-full h-[480px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-[var(--shadow-glow)]">
              <div className="text-2xl font-bold font-display">19 Feb 2026</div>
              <div className="text-xs opacity-90 mt-1">Founding Date</div>
            </div>
          </div>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Who We Are"
              title={
                <>
                  Your Long-term <span className="text-primary">IT Partner</span>
                </>
              }
              subtitle="Founded on 19 Feb 2026 by Vishal Singh, VM Solutiions has grown into one of India's most trusted IT partners."
            />
            <ul className="mt-8 space-y-3">
              {[
                "Founded on 19 Feb 2026",
                "Founder: Vishal Singh",
                "Tally & BUSY Software Solutions",
                "Tally on AWS Cloud Hosting",
                "Pan-India Service Coverage",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 font-medium">
                  <FaCheckCircle className="text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership & Founder Section (Simple, Light Theme) */}
      <section className="reveal py-20 bg-surface">
        <div className="container-x">
          <SectionHeading
            eyebrow="Company Leadership"
            title={
              <>
                Meet Our <span className="text-primary">Founder</span>
              </>
            }
            subtitle="Guiding VM Solutiions towards technology excellence and client satisfaction."
          />

          <div className="mt-12 max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-[var(--shadow-card)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl shrink-0">
                <FaUserTie />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full">
                  Founder & Managing Director
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground mt-2">
                  Vishal Singh
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Driving strategic vision, corporate IT solutions, software licensing, cloud
                  architecture, and client growth at VM Solutiions.
                </p>

                {/* Specialities Grid */}
                <div className="mt-8 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                    Core Specialities & Expertise
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SPECIALITIES.map((spec) => (
                      <div
                        key={spec.title}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-surface shadow-sm"
                      >
                        <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary/10 text-primary text-sm shrink-0 mt-0.5">
                          <spec.icon />
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-foreground">{spec.title}</h5>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {spec.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="reveal py-20">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FaBullseye,
              title: "Our Mission",
              text: "To empower every Indian business — from startups to enterprises — with technology that is reliable, affordable and future-ready.",
            },
            {
              icon: FaEye,
              title: "Our Vision",
              text: "To become the most trusted end-to-end IT solutions partner across South Asia — through service, integrity and innovation.",
            },
            {
              icon: FaHeart,
              title: "Our Values",
              text: "Honesty first. Long-term relationships over short-term profits. Deep expertise, delivered with humility.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all"
            >
              <div className="grid place-items-center h-14 w-14 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xl shadow-[var(--shadow-glow)]">
                <c.icon />
              </div>
              <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal py-20 bg-surface">
        <div className="container-x text-center max-w-3xl">
          <TextReveal as="h2" className="text-3xl font-bold">
            Ready to Upgrade Your Business Infrastructure?
          </TextReveal>
          <p className="mt-4 text-muted-foreground">
            Talk to our experts today for a free consultation or custom quote.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl font-semibold"
            >
              Contact Us <FaArrowRight />
            </Link>
            <Link to="/software" className="btn-outline py-3 px-6 rounded-xl font-semibold">
              Explore Software
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
