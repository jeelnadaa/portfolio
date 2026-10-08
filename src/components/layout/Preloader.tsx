"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { useSound } from "@/hooks/useSound";
import { siteConfig } from "@/data/site";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const slashLineRef = useRef<SVGLineElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();
  const { playSlash } = useSound();

  useEffect(() => {
    // Check session storage
    if (typeof window !== "undefined") {
      const alreadyLoaded = sessionStorage.getItem("solarquack_preloaded");
      if (alreadyLoaded || prefersReduced) {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }

    const counter = counterRef.current;
    const sun = sunRef.current;
    const slash = slashLineRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    if (!counter || !sun || !slash || !topHalf || !bottomHalf) return;

    const counterObj = { count: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("solarquack_preloaded", "true");
        setVisible(false);
        if (onComplete) onComplete();
      },
    });

    // 1. Counter 000 -> 100 & Sun disc rises
    tl.to(counterObj, {
      count: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        counter.textContent = String(Math.round(counterObj.count)).padStart(3, "0");
      },
    }, 0);

    tl.fromTo(
      sun,
      { yPercent: 120, scale: 0.2, opacity: 0.3 },
      { yPercent: -50, scale: 1, opacity: 1, duration: 1.6, ease: "power2.inOut" },
      0
    );

    // 2. Diagonal slash cuts screen
    tl.to(slash, {
      strokeDashoffset: 0,
      duration: 0.25,
      ease: "none",
      onStart: () => {
        playSlash();
      },
    });

    // 3. Two halves slide apart
    tl.to(
      topHalf,
      {
        xPercent: -30,
        yPercent: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      },
      "-=0.05"
    );

    tl.to(
      bottomHalf,
      {
        xPercent: 30,
        yPercent: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      },
      "<"
    );

    const handleSkip = () => {
      tl.progress(1);
    };

    const container = containerRef.current;
    container?.addEventListener("click", handleSkip);

    return () => {
      container?.removeEventListener("click", handleSkip);
      tl.kill();
    };
  }, [prefersReduced, onComplete, playSlash]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100000] cursor-pointer overflow-hidden bg-bg select-none"
      title="Click to skip preloader"
    >
      {/* Top half polygon */}
      <div
        ref={topHalfRef}
        className="absolute inset-0 bg-[#070706] z-10"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 70%)" }}
      >
        <div className="p-8 font-mono text-xs uppercase tracking-dossier text-bone/70 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
          <span>{siteConfig.brand.toUpperCase()} // {siteConfig.systemLabel}</span>
        </div>
      </div>

      {/* Bottom half polygon */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-0 bg-[#070706] z-10"
        style={{ clipPath: "polygon(0 70%, 100% 40%, 100% 100%, 0 100%)" }}
      >
        <div className="absolute bottom-8 right-8 font-mono text-3xl font-light text-bone/90 tracking-dossier">
          <span ref={counterRef}>000</span>
          <span className="text-muted text-sm ml-2">%</span>
        </div>
      </div>

      {/* Center Rising Sun Disc */}
      <div
        ref={sunRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[42vmin] h-[42vmin] rounded-full bg-sun z-20 pointer-events-none shadow-[0_0_80px_rgba(229,56,27,0.35)]"
      />

      {/* Diagonal Slash SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          ref={slashLineRef}
          x1="0"
          y1="70%"
          x2="100%"
          y2="40%"
          stroke="var(--bone)"
          strokeWidth="1.5"
          strokeDasharray="2000"
          strokeDashoffset="2000"
        />
      </svg>
    </div>
  );
}
