"use client";

import { useRef, useState } from "react";
import { BoneImage } from "@/components/ui/BoneImage";
import { SpecRow } from "@/components/ui/SpecRow";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";
import { foundationsData } from "@/data/foundations";

export function TwinPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPanel, setHoveredPanel] = useState<"strength" | "intelligence" | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const { sectionIndex, sectionTitle, panels } = foundationsData;
  const { left, right } = panels;

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
        <div className="flex items-center justify-between border-b border-rule pb-3.5 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted font-medium">
          <div className="flex items-center gap-3">
            <span className="text-sun font-bold">{sectionIndex}</span>
            <span>{sectionTitle}</span>
          </div>
          <div className="flex items-center gap-4 text-bone/70">
            <span>{left.greekWord}</span>
            <span>✦</span>
            <span>{right.greekWord}</span>
          </div>
        </div>

        {/* Twin Panels Grid */}
        <div className="flex flex-col lg:flex-row gap-8 transition-all duration-500">
          {/* Left Panel: STRENGTH */}
          <div
            onMouseEnter={() => setHoveredPanel("strength")}
            onMouseLeave={() => setHoveredPanel(null)}
            className={cn(
              "relative border border-rule bg-surface/40 p-6 sm:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden",
              "flex-1",
              hoveredPanel === "strength" && "lg:flex-[1.35] border-bone/60",
              hoveredPanel === "intelligence" && "opacity-50"
            )}
          >
            {/* Ghost Glyph */}
            <div
              ref={glyphLeftRef}
              aria-hidden="true"
              className="absolute -top-12 -right-12 font-greek text-[260px] text-bone/5 pointer-events-none select-none"
            >
              {left.giantLetter}
            </div>

            <div className="space-y-6">
              <div className="font-mono text-xs sm:text-sm tracking-dossier uppercase text-sun font-semibold flex items-center justify-between border-b border-rule pb-2.5">
                <span>{left.badgeNumeral} {left.badgeLabel}</span>
                <span className="font-greek">{left.greekWord}</span>
              </div>

              {/* Art Frame */}
              <div className="relative w-full aspect-[4/5] border border-rule/50 bg-bg overflow-hidden">
                <div ref={imgLeftRef} className="relative w-full h-full">
                  <BoneImage
                    src={left.image.src}
                    hoverSrc={left.image.hoverSrc}
                    alt={left.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display text-4xl sm:text-5xl text-bone font-light mb-2">
                  {left.title}
                </h3>
                <p className="font-sans text-bone/85 text-base sm:text-lg leading-relaxed max-w-md">
                  {left.description}
                </p>
              </div>
            </div>

            {/* Mini Spec Rows */}
            <div className="mt-8 pt-4 border-t border-rule space-y-1">
              {left.specs.map((spec) => (
                <SpecRow key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>
          </div>

          {/* Right Panel: INTELLIGENCE */}
          <div
            onMouseEnter={() => setHoveredPanel("intelligence")}
            onMouseLeave={() => setHoveredPanel(null)}
            className={cn(
              "relative border border-rule bg-surface/40 p-6 sm:p-10 flex flex-col justify-between transition-all duration-500 overflow-hidden",
              "flex-1",
              hoveredPanel === "intelligence" && "lg:flex-[1.35] border-bone/60",
              hoveredPanel === "strength" && "opacity-50"
            )}
          >
            {/* Ghost Glyph */}
            <div
              ref={glyphRightRef}
              aria-hidden="true"
              className="absolute -top-12 -right-12 font-greek text-[260px] text-bone/5 pointer-events-none select-none"
            >
              {right.giantLetter}
            </div>

            <div className="space-y-6">
              <div className="font-mono text-xs sm:text-sm tracking-dossier uppercase text-sun font-semibold flex items-center justify-between border-b border-rule pb-2.5">
                <span>{right.badgeNumeral} {right.badgeLabel}</span>
                <span className="font-greek">{right.greekWord}</span>
              </div>

              {/* Art Frame */}
              <div className="relative w-full aspect-[4/5] border border-rule/50 bg-bg overflow-hidden">
                <div ref={imgRightRef} className="relative w-full h-full">
                  <BoneImage
                    src={right.image.src}
                    hoverSrc={right.image.hoverSrc}
                    alt={right.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display text-4xl sm:text-5xl text-bone font-light mb-2">
                  {right.title}
                </h3>
                <p className="font-sans text-bone/85 text-base sm:text-lg leading-relaxed max-w-md">
                  {right.description}
                </p>
              </div>
            </div>

            {/* Mini Spec Rows */}
            <div className="mt-8 pt-4 border-t border-rule space-y-1">
              {right.specs.map((spec) => (
                <SpecRow key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
