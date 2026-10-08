"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { useSound } from "@/hooks/useSound";
import { siteConfig } from "@/data/site";

interface PreloaderProps {
  onComplete?: () => void;
}

let hasPreloadedThisSession = false;

export function isPreloadedSession(): boolean {
  return hasPreloadedThisSession;
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
  const promptRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const prefersReduced = usePrefersReducedMotion();
  const { playMetalSlice } = useSound();

  useEffect(() => {
    // Only skip if already played in current in-memory SPA session (replays on page refresh)
    if (hasPreloadedThisSession || prefersReduced) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const slash = slashLineRef.current;
    if (slash) {
      gsap.set(slash, { strokeDashoffset: 2500, opacity: 0 });
    }
  }, [prefersReduced, onComplete]);

  const handleInitiate = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Immediately trigger metal slice sound on direct user click gesture
    playMetalSlice();

    const container = containerRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const slash = slashLineRef.current;
    const sunTop = sunTopRef.current;
    const sunBottom = sunBottomRef.current;
    const counter = counterRef.current;
    const prompt = promptRef.current;

    if (!container || !topHalf || !bottomHalf || !slash || !sunTop || !sunBottom) {
      hasPreloadedThisSession = true;
      setVisible(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
      }
      if (onComplete) onComplete();
      return;
    }

    const counterObj = { count: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        hasPreloadedThisSession = true;
        setVisible(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
        }
        if (onComplete) onComplete();
      },
    });

    // 1. Fade out prompt button immediately
    if (prompt) {
      tl.to(prompt, { opacity: 0, scale: 0.95, duration: 0.15, ease: "power2.in" }, 0);
    }

    // 2. Animate counter rapidly up to 100%
    tl.to(
      counterObj,
      {
        count: 100,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(counterObj.count)).padStart(3, "0");
        },
      },
      0
    );

    // 3. Metal slice cut precisely across the disc
    tl.to(
      slash,
      {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.22,
        ease: "power3.inOut",
      },
      0.02
    );

    // 4. Disc and screen halves slide apart along the slice angle
    tl.to(
      topHalf,
      {
        xPercent: -18,
        yPercent: -18,
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
      },
      0.22
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
      0.22
    )
    .to(
      [sunTop, sunBottom],
      {
        opacity: 0,
        scale: 0.7,
        duration: 0.5,
        ease: "power2.in",
      },
      0.22
    )
    .to(
      container,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("solarquack:preloader-done"));
          }
        },
      },
      0.55
    );
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleInitiate}
      className="fixed inset-0 z-[100000] cursor-pointer overflow-hidden bg-bg select-none will-change-opacity"
      title="Click anywhere to enter"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInitiate();
        }
      }}
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

        {/* Top Half of Sliced 2D Bone Disc */}
        <div
          ref={sunTopRef}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42vmin] h-[42vmin] rounded-full pointer-events-none will-change-transform bg-[#E9E3D2]"
        />
      </div>

      {/* Interactive Prompt below the circle */}
      <div
        ref={promptRef}
        className="absolute top-[calc(50%+24vmin)] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none will-change-transform"
      >
        <div className="group flex items-center gap-3 px-6 py-2.5 rounded-full border border-bone/40 bg-[#070706]/90 backdrop-blur-md shadow-[0_0_24px_rgba(0,0,0,0.9)] transition-all duration-200">
          <span className="w-2 h-2 rounded-full bg-sun animate-ping" />
          <span className="font-mono text-xs sm:text-sm uppercase tracking-dossier text-bone group-hover:text-sun font-semibold">
            CLICK TO ENTER
          </span>
          <span className="font-mono text-xs text-bone/60 group-hover:text-sun">
            ✦
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-dossier text-bone/60">
          [ INITIATE AUDIO & ARCHIVES ]
        </div>
      </div>

      {/* Bottom Sliced Half */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-0 bg-[#070706] z-10 will-change-transform"
        style={{ clipPath: "polygon(0 70%, 100% 40%, 100% 100%, 0 100%)" }}
      >
        {/* Bottom Half of Sliced 2D Bone Disc */}
        <div
          ref={sunBottomRef}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42vmin] h-[42vmin] rounded-full pointer-events-none will-change-transform bg-[#E9E3D2]"
        />

        <div className="absolute bottom-8 left-8 font-mono text-xs uppercase tracking-dossier text-bone/70 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sun animate-ping" />
          <span>CLICK ANYWHERE TO ENTER</span>
        </div>

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
