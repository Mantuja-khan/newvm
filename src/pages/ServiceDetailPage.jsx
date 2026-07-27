import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaArrowRight, FaPhoneAlt, FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES, PROJECTS, BRAND } from "@/data/site";
import { ServiceReviews } from "@/components/ServiceReviews";
import { useState } from "react";

const BUSY_PRICING = [
  { edition: "Basic", variant: "Basic - Single User", activation: "₹11,000", renewal: "₹4,000" },
  { edition: "Basic", variant: "Basic - Dual User", activation: "Discontinued", renewal: "₹6,500" },
  { edition: "Basic", variant: "Basic - Multiple User", activation: "₹25,000", renewal: "₹8,500" },
  { edition: "Standard", variant: "Standard - Single User", activation: "₹16,500", renewal: "₹6,500" },
  { edition: "Standard", variant: "Standard - Dual User", activation: "Discontinued", renewal: "₹10,000" },
  { edition: "Standard", variant: "Standard - Multiple User", activation: "₹40,000", renewal: "₹14,000" },
  { edition: "Standard", variant: "Standard - Additional Count", activation: "₹10,500", renewal: "₹4,000" },
  { edition: "Enterprise", variant: "Enterprise - Single User", activation: "₹22,000", renewal: "₹7,500" },
  { edition: "Enterprise", variant: "Enterprise - Dual User", activation: "Discontinued", renewal: "₹11,500" },
  { edition: "Enterprise", variant: "Enterprise - Multiple User", activation: "₹58,000", renewal: "₹17,000" },
  { edition: "Enterprise", variant: "Enterprise - Additional Count", activation: "₹14,500", renewal: "₹4,500" },
  { edition: "Blue", variant: "Blue - Single User", activation: "₹5,000", renewal: "₹5,000" },
  { edition: "Blue", variant: "Blue - Multiple User", activation: "₹12,500", renewal: "₹12,500" },
  { edition: "Saffron", variant: "Saffron - Single User", activation: "₹8,000", renewal: "₹8,000" },
  { edition: "Saffron", variant: "Saffron - Multiple User", activation: "₹18,000", renewal: "₹18,000" },
  { edition: "Saffron", variant: "Saffron - Additional Count", activation: "₹4,999", renewal: "₹5,000" },
  { edition: "Emerald", variant: "Emerald - Single User", activation: "₹10,000", renewal: "₹10,000" },
  { edition: "Emerald", variant: "Emerald - Multiple User", activation: "₹25,000", renewal: "₹25,000" },
  { edition: "Emerald", variant: "Emerald - Additional Count", activation: "₹6,499", renewal: "₹6,499" }
];

const TALLY_PRICING = [
  { variant: "Tally Prime Silver (Single User)", activation: "₹22,500", renewal: "₹4,500" },
  { variant: "Tally Prime Gold (Multi-User / LAN)", activation: "₹67,500", renewal: "₹13,500" },
  { variant: "Tally Prime Developer (Single User)", activation: "₹11,250", renewal: "₹2,250" },
  { variant: "Tally Prime Developer (Multi-User)", activation: "₹33,750", renewal: "₹6,750" }
];

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  const [busyFilter, setBusyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!service) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center container-x py-24">
        <div>
          <h1 className="text-4xl font-bold">Service Not Found</h1>
          <p className="mt-4 text-muted-foreground">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="btn-primary mt-6">All Services</Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  const isWebDesign = service.slug === "web-development";
  const isTallyBusy = service.slug === "tally-busy";

  const filteredBusyPricing = BUSY_PRICING.filter(item => {
    const matchesCategory = busyFilter === "all" || item.edition.toLowerCase() === busyFilter.toLowerCase();
    const matchesSearch = item.variant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.edition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <h2 className="text-3xl font-bold mt-1">{service.title}</h2>
              </div>
            </div>

            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{service.description}</p>

            {/* DYNAMIC CONTENT FOR WEBSITE DEVELOPMENT PROJECT PORTFOLIO */}
            {isWebDesign && (
              <div className="mt-16 border-t border-border pt-12">
                <SectionHeading
                  center={false}
                  eyebrow="Our Web Projects"
                  title={<>Recent <span className="text-primary">Website Designs</span></>}
                  subtitle="Live web applications and corporate websites built by VM Solutiions."
                />
                
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  {PROJECTS.map((proj) => (
                    <div key={proj.title} className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="h-44 bg-slate-100 overflow-hidden relative">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <h4 className="font-extrabold text-sm text-slate-900 uppercase font-display line-clamp-1">{proj.title}</h4>
                        {proj.url ? (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-wider rounded-none"
                          >
                            Visit Website <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <Link
                            to="/contact"
                            className="mt-3 btn-outline py-2 text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-wider rounded-none"
                          >
                            Enquire Website <FaArrowRight className="text-[10px]" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC CONTENT FOR TALLY & BUSY PRICING TABLES */}
            {isTallyBusy && (
              <div className="mt-16 border-t border-border pt-12 space-y-12">
                {/* Tally Prime Pricing Card */}
                <div>
                  <SectionHeading
                    center={false}
                    eyebrow="Software Licensing"
                    title={<>Tally Prime <span className="text-primary">Official Pricing</span></>}
                    subtitle="Official single-user and multi-user activation & renewal rates."
                  />

                  <div className="mt-6 border border-slate-200 rounded-none overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Variant / Edition</th>
                          <th className="p-3">Activation (New)</th>
                          <th className="p-3">Renewal (TSS)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {TALLY_PRICING.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{t.variant}</td>
                            <td className="p-3 font-bold text-slate-900">{t.activation}</td>
                            <td className="p-3 font-semibold text-slate-700">{t.renewal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BUSY Accounting Pricing Card */}
                <div>
                  <SectionHeading
                    center={false}
                    eyebrow="Accounting Software"
                    title={<>BUSY Accounting <span className="text-primary">Software Rates</span></>}
                    subtitle="Complete license pricing matrix for Basic, Standard, Enterprise & Annual Subscription models."
                  />

                  {/* Filter and Search Controls for BUSY */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-3 rounded-none border border-slate-200">
                    <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                      {["all", "basic", "standard", "enterprise", "blue", "saffron", "emerald"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setBusyFilter(cat)}
                          className={`px-3 py-1 text-[11px] font-extrabold uppercase rounded-none transition-all ${
                            busyFilter === cat ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-48">
                      <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Search BUSY..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-none focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="mt-4 border border-slate-200 rounded-none overflow-hidden shadow-sm max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-3">Edition</th>
                          <th className="p-3">Variant</th>
                          <th className="p-3">Activation</th>
                          <th className="p-3">Renewal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredBusyPricing.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-500 uppercase">{b.edition}</td>
                            <td className="p-3 font-extrabold text-slate-900">{b.variant}</td>
                            <td className="p-3 font-bold text-slate-900">{b.activation}</td>
                            <td className="p-3 font-semibold text-slate-700">{b.renewal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <h3 className="mt-12 text-2xl font-bold">What's Included</h3>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                  <FaCheckCircle className="text-primary shrink-0" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            {/* Customer Reviews & Feedback Section */}
            <div className="mt-16">
              <ServiceReviews slug={service.slug} serviceTitle={service.title} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h4 className="font-bold text-lg mb-4">Other Services</h4>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/services/${r.slug}`} className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                      <span>{r.title}</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[image:var(--gradient-primary)] text-white rounded-2xl p-8 text-center shadow-[var(--shadow-glow)]">
              <h4 className="font-display text-2xl font-bold">Need Custom Help?</h4>
              <p className="mt-2 text-sm text-white/90">Our consultants are ready to design a solution for your exact requirements.</p>
              <Link to="/contact" className="btn-secondary mt-6 w-full bg-white text-slate-900 hover:bg-slate-100">
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
