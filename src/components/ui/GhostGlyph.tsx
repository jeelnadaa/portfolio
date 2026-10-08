"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface GhostGlyphProps {
  glyph: string;
  className?: string;
  rotateDeg?: number;
  driftPx?: number;
}

export function GhostGlyph({
  glyph,
  className,
  rotateDeg = 4,
  driftPx = 30,
}: GhostGlyphProps) {
  const glyphRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!glyphRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      glyphRef.current,
      {
        rotation: -rotateDeg,
        y: -driftPx / 2,
      },
      {
        rotation: rotateDeg,
        y: driftPx / 2,
        ease: "none",
        scrollTrigger: {
          trigger: glyphRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  }, [rotateDeg, driftPx]);

  return (
    <div
      ref={glyphRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none absolute font-greek leading-none text-bone text-opacity-[0.07]",
        "text-[160px] sm:text-[240px] md:text-[340px] lg:text-[420px]",
        "-z-10",
        className
      )}
    >
      {glyph}
    </div>
  );
}
