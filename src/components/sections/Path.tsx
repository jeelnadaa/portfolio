"use client";

import { useRef } from "react";
import Link from "next/link";
import { pathMilestones } from "@/data/experience";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

export function Path() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced || !containerRef.current) return;

    // Continuous scroll-drawn line across full height
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 85%",
            scrub: 1,
          },
        }
      );
    }

    // Nodes pop in
    nodeRefs.current.forEach((node) => {
      if (!node) return;
      gsap.fromTo(
        node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
          },
        }
      );
    });

    // Alternating side slide-in
    itemRefs.current.forEach((item, idx) => {
      if (!item) return;
      const isEven = idx % 2 === 0;
      gsap.fromTo(
        item,
        {
          x: isEven ? -40 : 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        }
      );
    });
  }, [prefersReduced]);

  return (
    <section
      id="path"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.experience.giantLetter}
        className="top-12 -left-12 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">06 //</span>
              <span>PATH & CHRONOLOGY</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.experience.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              The trajectory.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted tracking-dossier uppercase">
              ACADEMIC FOUNDATION, PRODUCTION INTERNSHIPS, AND HACKATHONS
            </p>
          </div>

          <Link
            href="/resume"
            data-cursor="OPEN"
            className="font-mono text-xs sm:text-sm uppercase tracking-dossier text-bone hover:text-sun border border-rule hover:border-sun px-4 py-2.5 transition-colors inline-block font-medium"
          >
            VIEW FULL RÉSUMÉ ↗
          </Link>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto pt-8 pb-16">
          {/* Vertical scrubbed line down center on desktop, left on mobile */}
          <div className="absolute top-2 bottom-6 left-4 md:left-1/2 -translate-x-1/2 w-[1.5px] bg-rule/50 pointer-events-none">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-sun via-bone to-sun origin-top shadow-[0_0_8px_rgba(217,119,6,0.35)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {pathMilestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={milestone.year + milestone.role}
                  className={cn(
                    "relative flex flex-col md:flex-row items-start md:items-center",
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  )}
                >
                  {/* Square Node (not circular per anti-slop rules) */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[idx] = el;
                    }}
                    aria-hidden="true"
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-bg border-2 border-sun z-10 rounded-sharp flex items-center justify-center"
                  >
                    <div className="w-1 h-1 bg-sun" />
                  </div>

                  {/* Content Box */}
                  <div
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className={cn(
                      "w-full md:w-[45%] pl-12 md:pl-0",
                      isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                    )}
                  >
                    <div className="border border-rule bg-surface/40 p-6 sm:p-7 space-y-3.5 hover:border-bone/60 transition-colors">
                      {/* Top Bar with Year in Fraunces Italic */}
                      <div
                        className={cn(
                          "flex items-baseline justify-between gap-4 border-b border-rule pb-2.5",
                          isEven ? "md:flex-row-reverse" : "md:flex-row"
                        )}
                      >
                        <span className="font-display italic text-2xl sm:text-3xl text-sun font-medium">
                          {milestone.year}
                        </span>
                        <span className="font-mono text-xs sm:text-sm tracking-dossier uppercase text-muted border border-rule px-2.5 py-1 font-medium">
                          {milestone.badge || "MILESTONE"}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-display text-xl sm:text-2xl text-bone font-light">
                          {milestone.role}
                        </h3>
                        <div className="font-mono text-sm sm:text-base text-muted font-medium">
                          {milestone.organization} · {milestone.location}
                        </div>
                      </div>

                      <p className="font-sans text-base sm:text-lg text-bone/90 leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Skills Tags */}
                      <div
                        className={cn(
                          "flex flex-wrap gap-1.5 pt-2 border-t border-rule/30 font-mono text-xs text-muted",
                          isEven && "md:justify-end"
                        )}
                      >
                        {milestone.skills.map((s) => (
                          <span key={s} className="border border-rule/50 px-2 py-0.5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Terminal Root Node past 2023 */}
            <div className="relative pt-10 flex flex-col md:items-center pl-12 md:pl-0">
              <div
                aria-hidden="true"
                className="absolute left-4 md:left-1/2 -translate-x-1/2 top-10 w-3.5 h-3.5 bg-bg border-2 border-sun z-10 rounded-sharp flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-sun animate-pulse" />
              </div>
              <div className="border border-rule/60 bg-surface/40 px-3.5 py-1.5 font-mono text-xs uppercase tracking-dossier text-muted mt-2">
                00 // TRAJECTORY ROOT · FIRST PRINCIPLES
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
