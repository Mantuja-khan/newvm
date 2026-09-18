import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FaCheckCircle, FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { TextReveal } from "@/components/TextReveal";
import { SERVICES, PROJECTS, BRAND } from "@/data/site";
import { ServiceReviews } from "@/components/ServiceReviews";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const service = loaderData ? SERVICES.find((s) => s.slug === loaderData.slug) : null;
    return {
      meta: service
        ? [
            { title: `${service.title} — VM Solutiions` },
            { name: "description", content: service.short },
            { property: "og:title", content: service.title },
            { property: "og:description", content: service.short },
          ]
        : [{ title: "Service not found" }, { name: "robots", content: "noindex" }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-[60vh] grid place-items-center text-center container-x py-24">
      <div>
        <h1 className="text-4xl font-bold">Service not found</h1>
        <p className="mt-4 text-muted-foreground">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="btn-primary mt-6">
          All Services
        </Link>
      </div>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useLoaderData();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;

  const Icon = service.icon;
  const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero title={service.title} crumb={service.title} />

      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-[1fr_320px] gap-14">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid place-items-center h-16 w-16 rounded-2xl bg-[image:var(--gradient-primary)] text-white text-3xl shadow-[var(--shadow-glow)]">
                <Icon />
              </span>
              <div>
                <span className="eyebrow">Service</span>
                <TextReveal as="h2" className="text-3xl font-bold mt-1">
                  {service.title}
                </TextReveal>
              </div>
            </div>

            {service.image && (
              <div className="mt-8 rounded-2xl overflow-hidden max-h-[440px] bg-slate-50/50 flex items-center justify-center p-4 shadow-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full max-h-[400px] object-contain mx-auto"
                />
              </div>
            )}

            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              {service.description}
            </p>

            <TextReveal as="h3" className="mt-12 text-2xl font-bold">
              What's Included
            </TextReveal>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {service.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface shadow-sm"
                >
                  <FaCheckCircle className="text-primary shrink-0" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <TextReveal as="h3" className="mt-12 text-2xl font-bold">
              Key Benefits
            </TextReveal>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {service.benefits.map((b) => (
                <div key={b.title} className="p-6 rounded-2xl bg-white shadow-sm">
                  <h4 className="font-bold">{b.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">
                Request a Quote <FaArrowRight />
              </Link>
              <a href={`tel:${BRAND.phoneRaw}`} className="btn-outline">
                <FaPhoneAlt /> Call an Expert
              </a>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="p-6 rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow)]">
              <h4 className="font-bold text-lg">Need Help?</h4>
              <p className="mt-2 text-sm opacity-90">
                Speak to a specialist today for a no-obligation consultation.
              </p>
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="mt-4 inline-flex items-center gap-2 font-bold text-white"
              >
                <FaPhoneAlt /> {BRAND.phone}
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-sm">
              <h4 className="font-bold mb-4">Other Services</h4>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: r.slug }}
                      className="flex items-center justify-between py-2 text-sm font-medium hover:text-primary"
                    >
                      {r.title} <FaArrowRight className="text-xs text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {service.slug === "web-development" && (
        <section className="reveal py-24 bg-surface">
          <div className="container-x">
            <SectionHeading
              eyebrow="Recent Work"
              title={
                <>
                  Projects <span className="text-primary">We've Delivered</span>
                </>
              }
              subtitle="A glimpse of websites and web apps our team has built for happy clients."
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map((p) => {
                const CardContent = (
                  <>
                    <div className="relative h-52 sm:h-56 w-full bg-slate-50/80 flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-contain object-top rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                    </div>
                  </>
                );
                if (p.url) {
                  return (
                    <a
                      key={p.title}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all"
                    >
                      {CardContent}
                    </a>
                  );
                }
                return (
                  <div
                    key={p.title}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all"
                  >
                    {CardContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICE REVIEWS */}
      <ServiceReviews serviceSlug={service.slug} serviceTitle={service.title} />
    </>
  );
}
