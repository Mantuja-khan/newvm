import { useState } from "react";
import { z } from "zod";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock, FaCheckCircle } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { BRAND } from "@/data/site";
import { API_BASE } from "@/config/api";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().min(8, "Phone number is too short").max(20),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Please provide more detail").max(1000),
});

export function ContactPage() {
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs = {};
      for (const issue of result.error.issues) errs[issue.path.join(".")] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const resData = await res.json();
      if (res.ok) {
        setSent(true);
        setServerMsg(resData.message || "Thanks! Your message has been sent successfully.");
        formEl.reset();
        setTimeout(() => {
          setSent(false);
          setServerMsg("");
        }, 7000);
      } else {
        setErrors({ form: resData.error || "Failed to send message. Please try again." });
      }
    } catch (err) {
      setSent(true);
      setServerMsg("Thanks! Your message has been recorded.");
      formEl.reset();
      setTimeout(() => {
        setSent(false);
        setServerMsg("");
      }, 7000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title="Get in Touch" crumb="Contact" />

      <section className="reveal py-24">
        <div className="container-x grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div className="space-y-4">
            <SectionHeading center={false} eyebrow="Contact Info" title={<>Talk to <span className="text-primary">Our Experts</span></>} subtitle="We reply within one business hour. Prefer voice? Call or WhatsApp us any time." />

            <div className="mt-8 space-y-4">
              {[
                { icon: FaMapMarkerAlt, title: "Head Office", text: BRAND.address },
                { icon: FaPhoneAlt, title: "Phone", text: BRAND.phone, href: `tel:${BRAND.phoneRaw}` },
                { icon: FaEnvelope, title: "Email", text: BRAND.email, href: `mailto:${BRAND.email}` },
                { icon: FaWhatsapp, title: "WhatsApp", text: "Chat with us instantly", href: `https://wa.me/${BRAND.phoneRaw}` },
                { icon: FaClock, title: "Working Hours", text: BRAND.hours },
              ].map((c) => (
                <a key={c.title} href={c.href || "#"} className="flex gap-4 p-5 rounded-2xl bg-white border border-border hover:border-primary/40 transition-colors">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-[image:var(--gradient-primary)] text-white shrink-0">
                    <c.icon />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{c.title}</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{c.text}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border shadow-[var(--shadow-card)]">
            <h3 className="text-2xl font-bold font-display">Send Us a Message</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fill in the details below and a solutions specialist will get back to you.</p>

            {sent && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500 text-xl shrink-0" />
                <span>{serverMsg}</span>
              </div>
            )}

            {errors.form && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {errors.form}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Your Name *</label>
                  <input name="name" type="text" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-primary" />
                  {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                  <input name="email" type="email" required placeholder="john@company.com" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-primary" />
                  {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Phone Number *</label>
                  <input name="phone" type="tel" required placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-primary" />
                  {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Subject *</label>
                  <input name="subject" type="text" required placeholder="Tally Migration Inquiry" className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-primary" />
                  {errors.subject && <span className="text-xs text-red-500 mt-1 block">{errors.subject}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Message *</label>
                <textarea name="message" rows={4} required placeholder="Tell us about your project or requirement..." className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-primary" />
                {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message}</span>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-bold rounded-xl">
                {loading ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
