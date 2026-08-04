import { useEffect, useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from "react-icons/fa";
import { BRAND } from "@/data/site";
export function FloatingActions() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            const isShow = window.scrollY > 400;
            setShow((prev) => (prev !== isShow ? isShow : prev));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (<div className="fixed right-5 bottom-5 z-40 flex flex-col gap-3">
      <a href={`https://wa.me/${BRAND.phoneRaw}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid place-items-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform">
        <FaWhatsapp className="text-xl"/>
      </a>
      <a href={`tel:${BRAND.phoneRaw}`} aria-label="Call" className="grid place-items-center h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform">
        <FaPhoneAlt />
      </a>
      {show && (<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="grid place-items-center h-12 w-12 rounded-full bg-foreground text-white shadow-lg hover:scale-110 transition-transform">
          <FaArrowUp />
        </button>)}
    </div>);
}
