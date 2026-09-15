import { useEffect, useState } from "react";
import logoImg from "@/assets/logo.png";
import { BRAND } from "@/data/site";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Runs ONLY once on initial website load
    const timer = setTimeout(() => {
      setFadeOut(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(hideTimer);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`page-loader-overlay ${fadeOut ? "fade-out" : ""}`}>
      <div className="loader flex flex-col items-center justify-center">
        <img src={logoImg} alt={BRAND?.name || "Loading..."} />
        <p className="loader-subtitle">Best Choice for your industry</p>
      </div>
    </div>
  );
}
