"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { honestStatus } from "@/data/now";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { PortraitPlaceholder } from "@/components/ui/PortraitPlaceholder";
import { BoneImage } from "@/components/ui/BoneImage";
import { Button } from "@/components/ui/Button";
import { SpecRow } from "@/components/ui/SpecRow";
import { useGsap } from "@/hooks/useGsap";
import { gsap, Draggable } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

const BEYOND_CODE_PLATES = [
  { id: "01", label: "MECHANICAL KEYBOARDS", caption: "Custom tactile switches and split ortholinear builds" },
  { id: "02", label: "DARK AMBIENT & DRONE", caption: "Sound design and procedural audio synthesis" },
  { id: "03", label: "TYPOGRAPHY SPECIMENS", caption: "Collecting classical Greek stone inscriptions and Didone cuts" },
  { id: "04", label: "CHESS & STRATEGY", caption: "Tactical positional play and rapid time controls" },
];

const TIMELINE_YEARS = [
  { year: "2021", label: "First Terminal Scripts", desc: "Started writing Python scripts and automating repetitive OS tasks on Linux." },
  { year: "2023", label: "PES University", desc: "Admitted into B.Tech CSE cohort in Bengaluru. Immersed in algorithms and data structures." },
  { year: "2024", label: "Collegiate Hackathons", desc: "Built distributed CRDT sync engines over WebSockets under 36-hour sprint constraints." },
  { year: "2025", label: "Production Internships", desc: "Shipped optimized SQL query pipelines and customer-facing dashboard features." },
  { year: "2026", label: "Systems & Shader R&D", desc: "Writing vectorized C++ vector indexers and creative WebGL depth shaders." },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggableTrackRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);
  const forgeBandRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced) return;

    // Opening sentence scrubbed reveal
    if (sentenceRef.current) {
      gsap.fromTo(
        sentenceRef.current,
        { opacity: 0.2, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sentenceRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Draggable row initialization
    if (draggableTrackRef.current) {
      Draggable.create(draggableTrackRef.current, {
        type: "x",
        bounds: draggableTrackRef.current.parentElement,
        inertia: true,
        edgeResistance: 0.65,
      });
    }

    // Forge band parallax
    if (forgeBandRef.current) {
      gsap.fromTo(
        forgeBandRef.current,
        { scale: 1 },
        {
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: forgeBandRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }
  }, [prefersReduced]);

  return (
    <main className="min-h-screen pt-28 pb-32 bg-bg text-bone select-none">
      <GhostGlyph
        glyph={glyphs.about.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-24">
        {/* Section Header */}
        <div className="border-b border-rule pb-8 space-y-3">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
            <span className="text-sun font-bold">00 //</span>
            <span>BIOGRAPHICAL DOSSIER</span>
            <span className="text-muted/40">✦</span>
            <span className="font-greek text-bone/60">{glyphs.about.greekWord}</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-bone font-light tracking-tight">
            About.
          </h1>
        </div>

        {/* Huge Opening Line */}
        <div className="max-w-5xl">
          <h2
            ref={sentenceRef}
            className="font-display text-3xl sm:text-5xl md:text-6xl text-bone font-light leading-tight tracking-tight"
          >
            I&rsquo;m <span className="text-sun font-medium">{siteConfig.legalName}</span>, online as{" "}
            <span className="italic">{siteConfig.brand}</span>.
          </h2>
        </div>

        {/* Bio Grid: Sticky Portrait + 3 Paragraphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <PortraitPlaceholder />
          </div>

          <div className="lg:col-span-7 space-y-8 font-sans text-base sm:text-lg text-bone/80 leading-relaxed">
            <p>
              I am a third-year Computer Science Engineering student at PES University in Bengaluru (class of 2027, maintaining an 8.43 CGPA). My technical education centers around data structures, compiler design, computer architecture, and distributed databases.
            </p>
            <p>
              What drew me into programming was the immediacy of building tools that solve actual bottlenecks. Rather than chasing ephemeral frameworks, I spend my time understanding memory layouts, cache hierarchies, and how network protocols behave under real-world packet drops.
            </p>
            <p>
              When I build web software, I focus on tactile interaction—zero-lag typography, smooth virtual scrolling, and custom GLSL shaders that make digital software feel like a crafted physical artifact.
            </p>

            {/* Now Block */}
            <div className="mt-8 border border-rule bg-surface/50 p-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-rule pb-2 text-xs uppercase tracking-dossier text-muted">
                <span>ACTIVE FOCUS // {honestStatus.lastUpdated.toUpperCase()}</span>
                <span className="text-sun">STATE: LIVE</span>
              </div>
              <SpecRow label="BUILDING" value="Vector Indexer & WebGL Engine" />
              <SpecRow label="LEARNING" value="Raft Consensus & CUDA Kernels" />
              <SpecRow label="READING" value={honestStatus.nowReading} />
              <SpecRow label="LISTENING" value={honestStatus.nowListening} />
            </div>
          </div>
        </div>

        {/* Forge Anvil Band with Parallax */}
        <div className="relative w-full aspect-[21/9] border border-rule bg-surface overflow-hidden group">
          <div ref={forgeBandRef} className="relative w-full h-full">
            <BoneImage
              src="/art/forge-anvil.bone.png"
              hoverSrc="/art/forge-anvil.color.webp"
              alt="Blacksmith anvil and forge"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-6 bg-bg/80 border border-rule px-3 py-1 font-mono text-xs uppercase tracking-dossier text-bone/80">
            ΤΕΧΝΗ // FORGE OF FIRST PRINCIPLES
          </div>
        </div>

        {/* Pinned Scroll Timeline of Years */}
        <div className="space-y-8 border-t border-rule pt-12">
          <div className="font-mono text-xs uppercase tracking-dossier text-muted flex items-center justify-between">
            <span>CHRONOLOGICAL MILESTONES (2021 — 2026)</span>
            <span className="text-sun">INDEX 01 - 05</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {TIMELINE_YEARS.map((t) => (
              <div
                key={t.year}
                className="border border-rule bg-surface/40 p-5 space-y-2 hover:border-sun/60 transition-colors"
              >
                <div className="font-display italic text-3xl text-sun font-medium">
                  {t.year}
                </div>
                <div className="font-mono text-xs text-bone font-semibold uppercase">
                  {t.label}
                </div>
                <p className="font-sans text-sm text-bone/80 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Beyond Code Draggable Row */}
        <div className="space-y-6 border-t border-rule pt-12 overflow-hidden">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-dossier text-muted">
            <span>BEYOND CODE // HORIZONTAL INVENTORY</span>
            <span className="text-sun flex items-center gap-1">
              <span>DRAG</span>
              <span>↔</span>
            </span>
          </div>

          <div className="w-full overflow-hidden" data-cursor="DRAG">
            <div
              ref={draggableTrackRef}
              className="flex gap-6 cursor-grab active:cursor-grabbing will-change-transform"
              style={{ width: "fit-content" }}
            >
              {BEYOND_CODE_PLATES.map((plate) => (
                <div
                  key={plate.id}
                  className="w-72 sm:w-80 border border-rule bg-surface/50 p-6 space-y-3 shrink-0 select-none hover:border-bone/70 transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-muted border-b border-rule pb-2">
                    <span>PLATE {plate.id}</span>
                    <span className="text-sun">INTEREST</span>
                  </div>
                  <div className="font-mono text-xs text-bone font-bold uppercase tracking-dossier">
                    {plate.label}
                  </div>
                  <p className="font-sans text-sm text-bone/80 leading-relaxed">
                    {plate.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-rule pt-12 flex flex-wrap items-center justify-between gap-6">
          <div className="font-mono text-xs uppercase tracking-dossier text-muted">
            READY TO INSPECT FULL CREDENTIALS?
          </div>
          <div className="flex items-center gap-4">
            <Button href="/resume" variant="sun" arrow>
              View résumé
            </Button>
            <Button href="/contact" variant="outline" arrow>
              Initiate contact
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
