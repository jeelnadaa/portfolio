"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { type Project } from "@/lib/schema";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { ProjectPlaceholder } from "@/components/ui/ProjectPlaceholder";
import { BoneImage } from "@/components/ui/BoneImage";
import { Lightbox } from "@/components/project/Lightbox";
import { useIsFinePointer } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

interface WorkShowroomProps {
  projects: Project[];
}

export function WorkShowroom({ projects }: WorkShowroomProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isFine = useIsFinePointer();

  // Floating preview image for list view
  const previewRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, vx: 0, lastX: 0 });

  useEffect(() => {
    if (viewMode !== "list" || !isFine) return;

    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.vx = e.clientX - mousePos.current.lastX;
      mousePos.current.lastX = e.clientX;
    };

    const render = () => {
      if (previewRef.current) {
        const rot = Math.max(-8, Math.min(8, mousePos.current.vx * 0.4));
        previewRef.current.style.transform = `translate3d(${mousePos.current.x + 20}px, ${
          mousePos.current.y - 120
        }px, 0) rotate(${rot}deg)`;
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [viewMode, isFine]);

  const featured = projects.slice(0, 6);

  return (
    <section
      id="work"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.work.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">03 //</span>
              <span>WORK SHOWROOM</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.work.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              See it running.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted tracking-dossier uppercase">
              SELECTED PRODUCTION CODE AND LOW-LATENCY SYSTEMS ({featured.length})
            </p>
          </div>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center border border-rule font-mono text-xs sm:text-sm uppercase tracking-dossier p-0.5 font-medium">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3.5 py-1.5 transition-colors",
                viewMode === "grid" ? "bg-bone text-bg font-semibold" : "text-muted hover:text-bone"
              )}
              data-cursor="CLICK"
            >
              GRID
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3.5 py-1.5 transition-colors",
                viewMode === "list" ? "bg-bone text-bg font-semibold" : "text-muted hover:text-bone"
              )}
              data-cursor="CLICK"
            >
              LIST
            </button>
          </div>
        </div>

        {/* 1. GRID VIEW: 3-column asymmetric offset grid */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p, idx) => (
              <div
                key={p.slug}
                onClick={() => setActiveLightboxIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor="VIEW"
                className={cn(
                  "group relative border border-rule bg-surface/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none",
                  "hover:-translate-y-1.5 hover:border-bone/70 hover:shadow-xl",
                  hoveredIndex !== null && hoveredIndex !== idx && "opacity-45",
                  // Offset second row slightly for asymmetric look
                  idx % 3 === 1 && "lg:translate-y-6"
                )}
              >
                {/* Top Tile Bar */}
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm tracking-dossier uppercase text-muted border-b border-rule pb-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sun font-bold">{p.glyph}</span>
                    <span>0{p.order}</span>
                  </div>
                  <span className="group-hover:text-sun group-hover:translate-x-1 transition-transform">
                    ↗
                  </span>
                </div>

                {/* Media Plate */}
                <div className="relative w-full aspect-[16/10] overflow-hidden border border-rule/50 bg-bg mb-4">
                  {p.cover ? (
                    <BoneImage
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <ProjectPlaceholder seed={p.slug} order={p.order} glyph={p.glyph} />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl text-bone font-light group-hover:text-sun transition-colors">
                    {p.title}
                  </h3>
                  <p className="font-mono text-sm sm:text-base text-muted leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-rule/40 font-mono text-xs sm:text-sm text-muted">
                  {p.stack.slice(0, 3).map((tool) => (
                    <span key={tool} className="border border-rule/60 px-2 py-0.5 font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. LIST VIEW: Index listing with floating cursor preview */}
        {viewMode === "list" && (
          <div className="divide-y divide-rule border-t border-b border-rule">
            {featured.map((p, idx) => (
              <div
                key={p.slug}
                onClick={() => setActiveLightboxIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor="VIEW"
                className="group py-6 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs text-muted w-8">0{p.order}</span>
                  <span className="font-display text-3xl sm:text-4xl text-bone group-hover:text-sun transition-colors">
                    {p.title}
                  </span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs text-muted uppercase tracking-dossier">
                  <span className="hidden sm:inline">{p.stack.slice(0, 3).join(" · ")}</span>
                  <span>{p.year}</span>
                  <span className="text-bone group-hover:text-sun group-hover:translate-x-1 transition-transform">
                    ↗
                  </span>
                </div>
              </div>
            ))}

            {/* Floating Cursor Preview Image */}
            {hoveredIndex !== null && featured[hoveredIndex] && (
              <div
                ref={previewRef}
                aria-hidden="true"
                className="fixed top-0 left-0 z-50 pointer-events-none w-72 aspect-[16/10] border border-bone/60 bg-surface shadow-2xl overflow-hidden hidden lg:block"
              >
                {featured[hoveredIndex].cover ? (
                  <BoneImage
                    src={featured[hoveredIndex].cover!}
                    alt=""
                    fill
                    sizes="288px"
                    className="object-cover"
                  />
                ) : (
                  <ProjectPlaceholder
                    seed={featured[hoveredIndex].slug}
                    order={featured[hoveredIndex].order}
                    glyph={featured[hoveredIndex].glyph}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Link to All Work */}
        <div className="text-right pt-6">
          <Link
            href="/work"
            data-cursor="OPEN"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-dossier text-bone hover:text-sun transition-colors border-b border-rule hover:border-sun pb-1"
          >
            <span>See all work ({projects.length})</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        project={activeLightboxIndex !== null ? featured[activeLightboxIndex] : null}
        onClose={() => setActiveLightboxIndex(null)}
        onNext={() =>
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev + 1) % featured.length : null
          )
        }
        onPrev={() =>
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + featured.length) % featured.length : null
          )
        }
      />
    </section>
  );
}
