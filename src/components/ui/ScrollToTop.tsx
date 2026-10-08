"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(y > 280);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      data-cursor="CLICK"
      className={cn(
        "fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99980] flex items-center gap-2",
        "bg-surface/90 hover:bg-surface border border-rule hover:border-sun",
        "text-bone hover:text-sun font-mono text-xs uppercase tracking-dossier",
        "px-3 py-2 shadow-xl backdrop-blur-md transition-all duration-300 select-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-sun" />
      <span>TOP</span>
      <span className="text-sun font-bold">↑</span>
    </button>
  );
}
