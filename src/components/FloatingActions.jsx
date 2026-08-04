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

    return (<div className="fixed right-5 bottom-5 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a href={`https://wa.me/${BRAND.phoneRaw}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid place-items-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-all border-2 border-white">
        <FaWhatsapp className="text-2xl text-white"/>
      </a>
      {/* Call Button */}
      <a href={`tel:${BRAND.phoneRaw}`} aria-label="Call" className="grid place-items-center h-12 w-12 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xl hover:scale-110 transition-all border-2 border-white">
        <FaPhoneAlt className="text-lg text-white"/>
      </a>
      {/* Scroll to Top / Down Button */}
      {show && (<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="grid place-items-center h-12 w-12 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-xl hover:scale-110 transition-all border-2 border-white cursor-pointer">
          <FaArrowUp className="text-lg text-white"/>
        </button>)}
    </div>);
}
