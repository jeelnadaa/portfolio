"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { honestStatus } from "@/data/now";
import { siteConfig } from "@/data/site";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { Scramble } from "@/components/ui/Scramble";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

export function Status() {
  const containerRef = useRef<HTMLDivElement>(null);
  const goldPulseRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced || !goldPulseRef.current) return;

    // 4s slow pulsing light running through gold cracks
    gsap.to(goldPulseRef.current, {
      opacity: 0.9,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [prefersReduced]);

  return (
    <section
      id="status"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.status.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">07 //</span>
              <span>HONEST STATUS</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.status.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              Honest status.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted tracking-dossier uppercase">
              LIVE SYSTEM STATE, UNFINISHED EXPERIMENTS, AND LEARNING CURVES
            </p>
          </div>

          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="OPEN"
            className="font-mono text-xs sm:text-sm uppercase tracking-dossier text-bone hover:text-sun border border-rule px-3.5 py-2 flex items-center gap-2 self-start sm:self-auto font-medium"
          >
            <span>BETA · PORTFOLIO V{siteConfig.version}</span>
            <span>↗</span>
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Fractured Bust with Pulsing Gold Seams */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square border border-rule bg-surface/50 overflow-hidden flex items-center justify-center p-6 group">
              {/* Fractured bust base */}
              <div className="relative w-4/5 h-4/5">
                <Image
                  src="/art/bust-fractured.bone.png"
                  alt="Kintsugi fractured marble bust with gold seams"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain opacity-80"
                />

                {/* Pulsing Gold Layer Glow */}
                <div
                  ref={goldPulseRef}
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                  style={{
                    filter: "drop-shadow(0 0 16px rgba(201, 162, 75, 0.8))",
                  }}
                >
                  <Image
                    src="/art/bust-fractured.color.webp"
                    alt=""
                    fill
                    sizes="420px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Status plate label */}
              <div className="absolute bottom-3 left-3 bg-bg/85 border border-rule px-3 py-1.5 font-mono text-xs sm:text-sm uppercase tracking-dossier text-gold flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span>KINTSUGI // GOLD SEAMS</span>
              </div>
            </div>
          </div>

          {/* Right: Honest Status Rows */}
          <div className="lg:col-span-7 space-y-6">
            <div className="divide-y divide-rule border-t border-b border-rule">
              {honestStatus.items.map((item, idx) => (
                <div
                  key={item.category}
                  className="py-5 font-mono space-y-2"
                >
                  <div className="flex items-center justify-between text-sm sm:text-base tracking-dossier uppercase">
                    <span className="text-sun font-semibold">
                      <Scramble text={`[ ${item.category} ]`} duration={0.8} />
                    </span>
                    <span className="text-xs sm:text-sm text-muted border border-rule px-2.5 py-0.5 font-medium">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-sans text-base sm:text-lg text-bone/90 leading-relaxed font-normal">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Now Reading & Listening */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs sm:text-sm border border-rule/60 bg-surface/30 p-5">
              <div className="space-y-1.5">
                <span className="text-xs sm:text-sm text-muted uppercase tracking-dossier block font-medium">
                  NOW READING
                </span>
                <span className="text-bone text-sm sm:text-base block font-sans">
                  {honestStatus.nowReading}
                </span>
              </div>
              <div className="space-y-1.5 sm:border-l sm:border-rule/60 sm:pl-5">
                <span className="text-xs sm:text-sm text-muted uppercase tracking-dossier block font-medium">
                  NOW LISTENING
                </span>
                <span className="text-bone text-sm sm:text-base block font-sans">
                  {honestStatus.nowListening}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
