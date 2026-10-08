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
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const slashLineRef = useRef<SVGLineElement>(null);
  const sunTopRef = useRef<HTMLDivElement>(null);
  const sunBottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const prefersReduced = usePrefersReducedMotion();
  const { playMetalSlice } = useSound();

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

    const container = containerRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const slash = slashLineRef.current;
    const sunTop = sunTopRef.current;
    const sunBottom = sunBottomRef.current;
    const counter = counterRef.current;

    if (!container || !topHalf || !bottomHalf || !slash || !sunTop || !sunBottom) return;

    const counterObj = { count: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("solarquack_preloaded", "true");
        } catch {}
        setVisible(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
        }
        if (onComplete) onComplete();
      },
    });

    // 1. Initial State: Orange Sun glows in center
    gsap.set([sunTop, sunBottom], { scale: 0.85, opacity: 0 });
    gsap.set(slash, { strokeDashoffset: 2500, opacity: 0 });

    // Smooth sun expansion and counter tick
    tl.to([sunTop, sunBottom], {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(
      counterObj,
      {
        count: 100,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(counterObj.count)).padStart(3, "0");
        },
      },
      "<"
    );

    // 2. Metal slice cut precisely across the orange circle
    tl.to(
      slash,
      {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.22,
        ease: "power3.inOut",
        onStart: () => {
          playMetalSlice();
        },
      },
      "+=0.08"
    );

    // 3. Orange circle and screen halves slide apart along the slice angle
    tl.to(
      topHalf,
      {
        xPercent: -18,
        yPercent: -18,
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
      },
      "+=0.04"
    )
    .to(
      bottomHalf,
      {
        xPercent: 18,
        yPercent: 18,
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
      },
      "<"
    )
    .to(
      [sunTop, sunBottom],
      {
        opacity: 0,
        scale: 0.7,
        duration: 0.5,
        ease: "power2.in",
      },
      "<"
    )
    .to(
      container,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onStart: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
          }
        },
      },
      "-=0.2"
    );

    const handleSkip = () => {
      try {
        sessionStorage.setItem("solarquack_preloaded", "true");
      } catch {}
      setVisible(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
      }
      if (onComplete) onComplete();
      tl.kill();
    };

    container.addEventListener("click", handleSkip);

    return () => {
      container.removeEventListener("click", handleSkip);
      tl.kill();
    };
  }, [prefersReduced, onComplete, playMetalSlice]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100000] cursor-pointer overflow-hidden bg-bg select-none will-change-opacity"
      title="Click to skip"
    >
      {/* Top Sliced Half */}
      <div
        ref={topHalfRef}
        className="absolute inset-0 bg-[#070706] z-10 will-change-transform"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 70%)" }}
      >
        <div className="p-8 font-mono text-xs uppercase tracking-dossier text-bone/70 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
          <span>{siteConfig.brand.toUpperCase()} // SYSTEM</span>
        </div>

        {/* Top Half of Sliced Sun Disc */}
        <div
          ref={sunTopRef}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44vmin] h-[44vmin] rounded-full pointer-events-none will-change-transform"
          style={{
            background: "radial-gradient(circle, #D97706 0%, rgba(217, 119, 6, 0.7) 45%, rgba(217, 119, 6, 0.1) 70%)",
            boxShadow: "0 0 80px rgba(217, 119, 6, 0.4)",
          }}
        />
      </div>

      {/* Bottom Sliced Half */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-0 bg-[#070706] z-10 will-change-transform"
        style={{ clipPath: "polygon(0 70%, 100% 40%, 100% 100%, 0 100%)" }}
      >
        {/* Bottom Half of Sliced Sun Disc */}
        <div
          ref={sunBottomRef}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44vmin] h-[44vmin] rounded-full pointer-events-none will-change-transform"
          style={{
            background: "radial-gradient(circle, #D97706 0%, rgba(217, 119, 6, 0.7) 45%, rgba(217, 119, 6, 0.1) 70%)",
            boxShadow: "0 0 80px rgba(217, 119, 6, 0.4)",
          }}
        />

        <div className="absolute bottom-8 right-8 font-mono text-3xl font-light text-bone/90 tracking-dossier">
          <span ref={counterRef}>000</span>
          <span className="text-muted text-sm ml-2">%</span>
        </div>
      </div>

      {/* Diagonal Metal Slice Cut Line */}
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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2500"
          strokeDashoffset="2500"
          filter="drop-shadow(0 0 8px rgba(233, 227, 210, 0.8))"
        />
      </svg>
    </div>
  );
}
