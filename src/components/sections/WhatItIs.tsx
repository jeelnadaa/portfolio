"use client";

import { useRef } from "react";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { BoneImage } from "@/components/ui/BoneImage";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

const STATEMENT_WORDS = [
  "I", "am", "a", "computer", "science", "student", "at", "PES", "University", "in", "Bengaluru.",
  "I", "engineer", "distributed", "backend", "utilities,", "fast", "local-first", "interfaces,",
  "and", "low-latency", "graphics", "shaders", "with", "uncompromising", "taste."
];

export function WhatItIs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const circleTextRef = useRef<SVGGElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced || !containerRef.current) return;

    // Word by word scroll-scrubbed opacity: 0.15 -> 1.0
    wordRefs.current.forEach((wordEl) => {
      if (!wordEl) return;
      gsap.fromTo(
        wordEl,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wordEl,
            start: "top 85%",
            end: "top 60%",
            scrub: true,
          },
        }
      );
    });

    // Rotating Greek circle text
    if (circleTextRef.current) {
      gsap.to(circleTextRef.current, {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }
  }, [prefersReduced]);

  return (
    <section
      ref={containerRef}
      id="about-teaser"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.whatItIs.giantLetter}
        className="top-10 -left-12 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Label Pattern */}
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-dossier text-muted border-b border-rule pb-3">
          <span className="text-sun font-bold">{glyphs.whatItIs.numeral} //</span>
          <span>{glyphs.whatItIs.englishLabel}</span>
          <span className="text-muted/40">✦</span>
          <span className="font-greek text-bone/60">{glyphs.whatItIs.greekWord}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading with word-scrubbed reveal */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone font-light leading-[1.1] tracking-tight">
              {STATEMENT_WORDS.map((word, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    wordRefs.current[idx] = el;
                  }}
                  className="inline-block mr-2.5 transition-opacity"
                >
                  {word}
                </span>
              ))}
            </h2>

            {/* Pull Quote */}
            <div className="pt-4 border-l-2 border-sun pl-4">
              <p className="font-display italic text-lg sm:text-xl text-bone/80">
                &ldquo;the repo is the portfolio.&rdquo;
              </p>
              <span className="font-mono text-[10px] text-muted tracking-dossier uppercase block mt-1">
                FIRST PRINCIPLE // SOURCE-DRIVEN VERIFICATION
              </span>
            </div>
          </div>

          {/* Right Column: Ruins Art with Rotating Greek Badge */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/3] border border-rule bg-surface/50 overflow-hidden group">
              <BoneImage
                src="/art/ruins-columns.bone.png"
                hoverSrc="/art/ruins-columns.color.webp"
                alt="Classical ruins architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />

              {/* Caption */}
              <div className="absolute bottom-3 left-3 bg-bg/80 border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-dossier text-bone/80">
                ΒΑΣΗ // BASE
              </div>

              {/* Rotating Greek circle text overlay in corner */}
              <div className="absolute top-3 right-3 w-20 h-20 pointer-events-none select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="textPathCircle"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <g ref={circleTextRef}>
                    <text
                      fontSize="9.5"
                      fontFamily="var(--font-didot)"
                      fill="var(--bone)"
                      opacity="0.7"
                      letterSpacing="2"
                    >
                      <textPath href="#textPathCircle">
                        ✦ ΒΑΣΗ ✦ SOLARQUACK ✦ 2026
                      </textPath>
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
