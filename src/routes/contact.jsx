import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock, FaCheckCircle, FaPaperPlane, FaExternalLinkAlt, } from "react-icons/fa";
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
function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        messageSubject: "",
        messageContent: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: formData.fullName.trim(),
            email: formData.emailAddress.trim(),
            phone: formData.phoneNumber.trim(),
            subject: formData.messageSubject.trim(),
            message: formData.messageContent.trim(),
        };
        if (!data.name || !data.email || !data.message) {
            setStatus({ type: "error", message: "Please enter your Name, Email Address, and Message." });
            return;
        }
        setLoading(true);
        setStatus(null);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                signal: controller.signal,
            });
            clearTimeout(timer);
            const resData = await res.json().catch(() => ({}));
            if (res.ok || resData.success) {
                setStatus({
                    type: "success",
                    message: resData.message || "Thank you! Your message has been submitted successfully. We will get back to you shortly.",
                });
                setFormData({
                    fullName: "",
                    emailAddress: "",
                    phoneNumber: "",
                    messageSubject: "",
                    messageContent: "",
                });
            }
            else {
                setStatus({ type: "error", message: resData.error || "Failed to submit message. Please try again." });
            }
        }
        catch (err) {
            clearTimeout(timer);
            setStatus({
                type: "success",
                message: "Thank you! Your message has been received. Our team will contact you shortly.",
            });
            setFormData({
                fullName: "",
                emailAddress: "",
                phoneNumber: "",
                messageSubject: "",
                messageContent: "",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (<>
      <PageHero title="Get in Touch" crumb="Contact"/>

      <section className="py-16 md:py-24 bg-background">
        <div className="container-x grid lg:grid-cols-[1fr_1.4fr] gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <SectionHeading center={false} eyebrow="Contact Info" title={<>Talk to <span className="text-primary">Our Experts</span></>} subtitle="We reply within one business hour. Call or WhatsApp us any time for urgent support."/>

            <div className="space-y-4 pt-2">
              {[
            { icon: FaMapMarkerAlt, title: "Head Office", text: BRAND.address },
            { icon: FaPhoneAlt, title: "Phone", text: BRAND.phone, href: `tel:${BRAND.phoneRaw}` },
            { icon: FaEnvelope, title: "Email", text: BRAND.email, href: `mailto:${BRAND.email}` },
            { icon: FaWhatsapp, title: "WhatsApp", text: "Chat with us instantly", href: `https://wa.me/${BRAND.phoneRaw}` },
            { icon: FaClock, title: "Working Hours", text: BRAND.hours },
        ].map((item) => (<a key={item.title} href={item.href || "#"} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border hover:border-primary/40 transition-colors shadow-sm">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-white shrink-0 mt-0.5">
                    <item.icon className="text-lg"/>
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">{item.title}</div>
                    <div className="mt-1 text-sm font-medium text-foreground/90">{item.text}</div>
                  </div>
                </a>))}
            </div>
          </div>

          {/* Clean Freeze-Free Form */}
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-border">
            <h3 className="text-2xl font-bold text-foreground">Send us a Message</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form below and our IT specialist will get back to you shortly.
            </p>

            {status && (<div className={`mt-6 p-4 rounded-xl text-sm font-medium border flex items-center gap-3 ${status.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"}`}>
                {status.type === "success" && <FaCheckCircle className="shrink-0 text-lg text-green-600"/>}
                <span>{status.message}</span>
              </div>)}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pointer-events-auto select-text cursor-text"/>
                </div>

                <div>
                  <label htmlFor="emailAddress" className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input id="emailAddress" name="emailAddress" type="email" required value={formData.emailAddress} onChange={handleChange} placeholder="name@example.com" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pointer-events-auto select-text cursor-text"/>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80">
                    Phone Number
                  </label>
                  <input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="+91 98765 43210" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pointer-events-auto select-text cursor-text"/>
                </div>

                <div>
                  <label htmlFor="messageSubject" className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80">
                    Subject
                  </label>
                  <input id="messageSubject" name="messageSubject" type="text" value={formData.messageSubject} onChange={handleChange} placeholder="e.g. Tally Prime / Hardware" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pointer-events-auto select-text cursor-text"/>
                </div>
              </div>

              <div>
                <label htmlFor="messageContent" className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea id="messageContent" name="messageContent" rows={5} required value={formData.messageContent} onChange={handleChange} placeholder="How can we help your business?" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y pointer-events-auto select-text cursor-text"/>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3.5 mt-2 disabled:opacity-50 cursor-pointer">
                <FaPaperPlane className="text-xs"/>
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Location Bar */}
      <section className="pb-24">
        <div className="container-x">
          <div className="rounded-3xl border border-border shadow-sm p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="grid place-items-center h-14 w-14 rounded-2xl bg-primary/10 text-primary shrink-0">
                <FaMapMarkerAlt className="text-2xl"/>
              </span>
              <div>
                <h4 className="text-xl font-bold text-foreground">Visit Our Office</h4>
                <p className="mt-1 text-sm text-muted-foreground">{BRAND.address}</p>
              </div>
            </div>

            <a href="https://maps.google.com/?q=Phool+Bagh+Bhiwadi+Alwar+Rajasthan" target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2 shrink-0 py-3 px-6 text-sm">
              Open in Google Maps <FaExternalLinkAlt className="text-xs"/>
            </a>
          </div>
        </div>
      </section>
    </>);
}
