import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FaCheckCircle, FaArrowRight, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES, PROJECTS, BRAND } from "@/data/site";
import { ServiceReviews } from "@/components/ServiceReviews";
import { useState } from "react";
import imgTallyLogo from "@/assets/tally-logo.png";
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
export const Route = createFileRoute("/services/$slug")({
    loader: ({ params }) => {
        const service = SERVICES.find((s) => s.slug === params.slug);
        if (!service)
            throw notFound();
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
    notFoundComponent: () => (<div className="min-h-[60vh] grid place-items-center text-center container-x py-24">
      <div>
        <h1 className="text-4xl font-bold">Service not found</h1>
        <p className="mt-4 text-muted-foreground">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="btn-primary mt-6">All Services</Link>
      </div>
    </div>),
    component: ServiceDetail,
});
function ServiceDetail() {
    const { slug } = Route.useLoaderData();
    const service = SERVICES.find((s) => s.slug === slug);
    if (!service)
        return null;
    const Icon = service.icon;
    const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);
    return (<>
      <PageHero title={service.title} crumb={service.title}/>

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

            <h3 className="mt-12 text-2xl font-bold">What's Included</h3>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {service.features.map((f) => (<li key={f} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                  <FaCheckCircle className="text-primary shrink-0"/>
                  <span className="text-sm font-medium">{f}</span>
                </li>))}
            </ul>

            <h3 className="mt-12 text-2xl font-bold">Key Benefits</h3>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {service.benefits.map((b) => (<div key={b.title} className="p-6 rounded-2xl bg-white border border-border">
                  <h4 className="font-bold">{b.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                </div>))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">Request a Quote <FaArrowRight /></Link>
              <a href={`tel:${BRAND.phoneRaw}`} className="btn-outline"><FaPhoneAlt /> Call an Expert</a>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="p-6 rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow)]">
              <h4 className="font-bold text-lg">Need Help?</h4>
              <p className="mt-2 text-sm opacity-90">Speak to a specialist today for a no-obligation consultation.</p>
              <a href={`tel:${BRAND.phoneRaw}`} className="mt-4 inline-flex items-center gap-2 font-bold text-white">
                <FaPhoneAlt /> {BRAND.phone}
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border">
              <h4 className="font-bold mb-4">Other Services</h4>
              <ul className="space-y-2">
                {related.map((r) => (<li key={r.slug}>
                    <Link to="/services/$slug" params={{ slug: r.slug }} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm font-medium hover:text-primary">
                      {r.title} <FaArrowRight className="text-xs text-primary"/>
                    </Link>
                  </li>))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {service.slug === "web-development" && (<section className="reveal py-24 bg-surface">
          <div className="container-x">
            <SectionHeading eyebrow="Recent Work" title={<>Projects <span className="text-primary">We've Delivered</span></>} subtitle="A glimpse of websites and web apps our team has built for happy clients."/>
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map((p) => {
                const CardContent = (<>
                    <div className="relative h-52 overflow-hidden">
                      <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"/>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                    </div>
                  </>);
                if (p.url) {
                    return (<a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="group block relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all">
                      {CardContent}
                    </a>);
                }
                return (<div key={p.title} className="group relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all">
                    {CardContent}
                  </div>);
            })}
            </div>
          </div>
        </section>)}

      {service.slug === "tally-busy" && (<section className="reveal py-24 bg-surface scroll-mt-20" id="pricing">
          <div className="container-x">
            <SectionHeading eyebrow="Pricing Plans" title={<>Software Pricing <span className="text-primary">Charts</span></>} subtitle="Latest official licensing prices for BUSY and Tally Prime."/>
            <SoftwarePricing />
          </div>
        </section>)}

      <ServiceReviews slug={service.slug} serviceTitle={service.title}/>
    </>);
}
function SoftwarePricing() {
    const [activeTab, setActiveTab] = useState("busy");
    // BUSY Pricing Table State
    const [edition, setEdition] = useState("All");
    const [busySearch, setBusySearch] = useState("");
    const editions = ["All", "Basic", "Standard", "Enterprise", "Blue", "Saffron", "Emerald"];
    const filteredBusy = BUSY_PRICING.filter((item) => {
        const matchesEdition = edition === "All" || item.edition === edition;
        const matchesSearch = item.variant.toLowerCase().includes(busySearch.toLowerCase());
        return matchesEdition && matchesSearch;
    });
    return (<div className="mt-12 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Top Navigation Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        {[
            { id: "busy", label: "BUSY Software" },
            { id: "tally", label: "Tally Prime" },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 text-center ${activeTab === tab.id
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/20"}`}>
            {tab.label}
          </button>))}
      </div>

      <div className="p-6 md:p-8">
        {/* BUSY SOFTWARE PANEL */}
        {activeTab === "busy" && (<div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
              <div className="flex flex-wrap gap-1.5">
                {editions.map((e) => (<button key={e} onClick={() => setEdition(e)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${edition === e
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {e}
                  </button>))}
              </div>
              <div className="relative w-full md:w-64">
                <input type="text" placeholder="Search variant..." value={busySearch} onChange={(e) => setBusySearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-primary focus:bg-white transition-all"/>
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"/>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Edition</th>
                    <th className="pb-3 px-2">Variant</th>
                    <th className="pb-3 px-2">Activation (+ 18% GST)</th>
                    <th className="pb-3 px-2">Renewal (+ 18% GST)</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filteredBusy.length > 0 ? (filteredBusy.map((item, idx) => (<tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${item.edition === "Basic" ? "bg-blue-50 text-blue-700" :
                    item.edition === "Standard" ? "bg-amber-50 text-amber-700" :
                        item.edition === "Enterprise" ? "bg-purple-50 text-purple-700" :
                            "bg-emerald-50 text-emerald-700"}`}>
                            {item.edition}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 font-medium text-slate-700">{item.variant}</td>
                        <td className="py-3.5 px-2">
                          {item.activation === "Discontinued" ? (<span className="text-slate-400 text-xs italic">Discontinued</span>) : (<span className="font-semibold text-slate-900">{item.activation}</span>)}
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="font-semibold text-slate-600">{item.renewal}</span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <a href={`https://wa.me/919358853990?text=${encodeURIComponent(`Hello VM Solutiions, I am interested in BUSY Software - Edition: ${item.edition}, Variant: ${item.variant} (Activation: ${item.activation}, Renewal: ${item.renewal}). Please share more details.`)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline">
                            Enquire
                          </a>
                        </td>
                      </tr>))) : (<tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                        No matches found.
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>)}

        {/* TALLY PRIME PANEL */}
        {activeTab === "tally" && (<div>
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
              <img src={imgTallyLogo} alt="Tally Logo" className="h-10 object-contain"/>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Tally Prime Licensing</h4>
                <p className="text-xs text-slate-500">Official perpetual licenses with annual support renewal subscriptions (+ 18% GST extra).</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Edition / Variant</th>
                    <th className="pb-3 px-2">Activation (+ 18% GST)</th>
                    <th className="pb-3 px-2">Annual Renewal (TSS + 18% GST)</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {TALLY_PRICING.map((item, idx) => (<tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-slate-800">{item.variant}</td>
                      <td className="py-4 px-2 font-semibold text-slate-900">{item.activation}</td>
                      <td className="py-4 px-2 font-semibold text-slate-600">{item.renewal}</td>
                      <td className="py-4 px-2 text-right">
                        <a href={`https://wa.me/919358853990?text=${encodeURIComponent(`Hello VM Solutiions, I am interested in Tally Prime - Variant: ${item.variant} (Activation: ${item.activation}, Renewal: ${item.renewal}). Please share more details.`)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline">
                          Enquire
                        </a>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>
    </div>);
}
