"use client";

import { useRef, useEffect } from "react";
import { useLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { heroConfig } from "@/data/hero";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items?: string[];
  className?: string;
  speed?: number; // pixels per second
}

export function Marquee({
  items = heroConfig.marqueeItems,
  className,
  speed = 70,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const prefersReduced = usePrefersReducedMotion();

  const posRef = useRef(0);
  const velocityRef = useRef(1);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      // React to Lenis scroll velocity
      let scrollVel = 0;
      if (lenis && typeof lenis.velocity === "number") {
        scrollVel = lenis.velocity * 0.4;
      }

      if (!isHoveredRef.current) {
        // base speed plus scroll velocity influence
        const direction = scrollVel !== 0 ? Math.sign(scrollVel) : 1;
        const currentSpeed = speed + Math.abs(scrollVel) * 120;
        posRef.current -= currentSpeed * dt * direction;

        if (trackRef.current) {
          const halfWidth = trackRef.current.scrollWidth / 2;
          if (posRef.current <= -halfWidth) {
            posRef.current += halfWidth;
          } else if (posRef.current > 0) {
            posRef.current -= halfWidth;
          }
          trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed, lenis, prefersReduced]);

  // Triple items for seamless loop
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
      className={cn(
        "relative w-full overflow-hidden bg-bone text-bg py-3 select-none -rotate-[1.2deg] scale-[1.03] shadow-lg z-20",
        className
      )}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform font-mono text-xs font-bold tracking-dossier uppercase gap-6"
      >
        {repeated.map((item, idx) => (
          <span
            key={idx}
            className={cn(
              "inline-flex items-center gap-6",
              item === "✦" ? "text-sun text-sm" : ""
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
