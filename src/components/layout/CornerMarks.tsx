"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CornerMarks() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const offsetClass = scrolled ? "m-3 sm:m-4" : "m-1 sm:m-2";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 select-none transition-all duration-300"
    >
      {/* Top Left */}
      <span
        className={cn(
          "corner-mark absolute top-0 left-0 font-mono text-xs text-muted/40 transition-all duration-300",
          offsetClass
        )}
      >
        +
      </span>

      {/* Top Right */}
      <span
        className={cn(
          "corner-mark absolute top-0 right-0 font-mono text-xs text-muted/40 transition-all duration-300",
          offsetClass
        )}
      >
        +
      </span>

      {/* Bottom Left */}
      <span
        className={cn(
          "corner-mark absolute bottom-0 left-0 font-mono text-xs text-muted/40 transition-all duration-300",
          offsetClass
        )}
      >
        +
      </span>

      {/* Bottom Right */}
      <span
        className={cn(
          "corner-mark absolute bottom-0 right-0 font-mono text-xs text-muted/40 transition-all duration-300",
          offsetClass
        )}
      >
        +
      </span>
    </div>
  );
}
