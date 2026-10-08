"use client";

import { useRef, useState } from "react";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { BoneImage } from "@/components/ui/BoneImage";
import { SpecRow } from "@/components/ui/SpecRow";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

export function TwinPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPanel, setHoveredPanel] = useState<"strength" | "craft" | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const glyphLeftRef = useRef<HTMLDivElement>(null);
  const glyphRightRef = useRef<HTMLDivElement>(null);
  const imgLeftRef = useRef<HTMLDivElement>(null);
  const imgRightRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (prefersReduced || !containerRef.current) return;

    // Scrubbed glyph rotations ±6deg
    if (glyphLeftRef.current) {
      gsap.fromTo(
        glyphLeftRef.current,
        { rotation: -6 },
        {
          rotation: 6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    if (glyphRightRef.current) {
      gsap.fromTo(
        glyphRightRef.current,
        { rotation: 6 },
        {
          rotation: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    // Scrubbed image parallax pan inside frames ±6%
    if (imgLeftRef.current) {
      gsap.fromTo(
        imgLeftRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    if (imgRightRef.current) {
      gsap.fromTo(
        imgRightRef.current,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }
  }, [prefersReduced]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-rule pb-3 font-mono text-xs uppercase tracking-dossier text-muted">
          <div className="flex items-center gap-3">
            <span className="text-sun font-bold">01 - 02 //</span>
            <span>FOUNDATIONS</span>
          </div>
          <div className="flex items-center gap-4 text-bone/60">
            <span>{glyphs.strength.greekWord}</span>
            <span>✦</span>
            <span>{glyphs.craft.greekWord}</span>
          </div>
        </div>

        {/* Twin Panels Grid */}
        <div className="flex flex-col lg:flex-row gap-8 transition-all duration-500">
          {/* Left Panel: STRENGTH (ΙΣΧΥΣ) */}
          <div
            onMouseEnter={() => setHoveredPanel("strength")}
            onMouseLeave={() => setHoveredPanel(null)}
            className={cn(
              "relative border border-rule bg-surface/40 p-6 sm:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden",
              "flex-1",
              hoveredPanel === "strength" && "lg:flex-[1.35] border-bone/60",
              hoveredPanel === "craft" && "opacity-50"
            )}
          >
            {/* Ghost Glyph I */}
            <div
              ref={glyphLeftRef}
              aria-hidden="true"
              className="absolute -top-12 -right-12 font-greek text-[260px] text-bone/5 pointer-events-none select-none"
            >
              {glyphs.strength.giantLetter}
            </div>

            <div className="space-y-6">
              <div className="font-mono text-sm tracking-dossier uppercase text-sun flex items-center justify-between border-b border-rule pb-2">
                <span>01 // STRENGTH</span>
                <span className="font-greek">{glyphs.strength.greekWord}</span>
              </div>

              {/* Art Frame */}
              <div className="relative w-full aspect-[4/5] border border-rule/50 bg-bg overflow-hidden">
                <div ref={imgLeftRef} className="relative w-full h-full">
                  <BoneImage
                    src="/art/fist-sword.bone.png"
                    hoverSrc="/art/fist-sword.color.webp"
                    alt="Classical fist gripping sword sculpture"
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display text-4xl sm:text-5xl text-bone font-light mb-2">
                  Strength.
                </h3>
                <p className="font-sans text-bone/80 text-base leading-relaxed max-w-md">
                  Rigorous data structures, algorithm efficiency, deterministic systems programming, and high-throughput concurrency.
                </p>
              </div>
            </div>

            {/* Mini Spec Rows */}
            <div className="mt-8 pt-4 border-t border-rule space-y-1">
              <SpecRow label="CORE ALGORITHMS" value="C++20 / STL" />
              <SpecRow label="CONCURRENCY" value="Event Loops & POSIX" />
              <SpecRow label="QUERY PLANS" value="PostgreSQL Indexing" />
            </div>
          </div>

          {/* Right Panel: CRAFT (ΤΕΧΝΗ) */}
          <div
            onMouseEnter={() => setHoveredPanel("craft")}
            onMouseLeave={() => setHoveredPanel(null)}
            className={cn(
              "relative border border-rule bg-surface/40 p-6 sm:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden",
              "flex-1",
              hoveredPanel === "craft" && "lg:flex-[1.35] border-bone/60",
              hoveredPanel === "strength" && "opacity-50"
            )}
          >
            {/* Ghost Glyph T */}
            <div
              ref={glyphRightRef}
              aria-hidden="true"
              className="absolute -top-12 -right-12 font-greek text-[260px] text-bone/5 pointer-events-none select-none"
            >
              {glyphs.craft.giantLetter}
            </div>

            <div className="space-y-6">
              <div className="font-mono text-sm tracking-dossier uppercase text-sun flex items-center justify-between border-b border-rule pb-2">
                <span>02 // CRAFT</span>
                <span className="font-greek">{glyphs.craft.greekWord}</span>
              </div>

              {/* Art Frame */}
              <div className="relative w-full aspect-[4/5] border border-rule/50 bg-bg overflow-hidden">
                <div ref={imgRightRef} className="relative w-full h-full">
                  <BoneImage
                    src="/art/hand-laurel.bone.png"
                    hoverSrc="/art/hand-laurel.color.webp"
                    alt="Classical hand holding laurel branch sculpture"
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display text-4xl sm:text-5xl text-bone font-light mb-2">
                  Craft.
                </h3>
                <p className="font-sans text-bone/80 text-base leading-relaxed max-w-md">
                  Obsessive typography, mathematical motion choreography, tactile reticle cursors, and pixel-precise shaders.
                </p>
              </div>
            </div>

            {/* Mini Spec Rows */}
            <div className="mt-8 pt-4 border-t border-rule space-y-1">
              <SpecRow label="CHOREOGRAPHY" value="GSAP / Lenis Virtual" />
              <SpecRow label="SHADERS" value="GLSL / Bayer Dither" />
              <SpecRow label="ACCESSIBILITY" value="WCAG AA & Reduced-Motion" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
