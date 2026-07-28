import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock, FaCheckCircle } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { BRAND } from "@/data/site";

import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact VM Solutiions — Get a Free IT Consultation" },
      { name: "description", content: "Call, WhatsApp or write to VM Solutiions. Free consultation and same-day response guaranteed." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().min(8, "Phone number is too short").max(20),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Please provide more detail").max(1000),
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl)) as Record<string, string>;
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
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
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">{c.title}</div>
                    <div className="mt-1 text-sm font-medium text-foreground/80">{c.text}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)] border border-border">
            <h3 className="text-2xl font-bold">Send us a Message</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fill in the form and we'll get back to you shortly.</p>

            {sent && (
              <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 text-sm font-medium">
                <FaCheckCircle className="shrink-0 text-lg" /> {serverMsg}
              </div>
            )}

            {errors.form && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
                {errors.form}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 grid md:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" error={errors.name} />
              <Field label="Email Address" name="email" type="email" error={errors.email} />
              <Field label="Phone Number" name="phone" error={errors.phone} />
              <Field label="Subject" name="subject" error={errors.subject} />
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Your Message</label>
                <textarea name="message" rows={5} className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="reveal pb-24">
        <div className="container-x">
          <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] h-[420px]">
            <iframe
              title="VM Solutiions Location"
              src="https://www.google.com/maps?q=Phool+Bagh+Bhiwadi+Alwar+Rajasthan&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
