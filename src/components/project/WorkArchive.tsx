"use client";

import { useState, useMemo } from "react";
import { type Project } from "@/lib/schema";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { ProjectPlaceholder } from "@/components/ui/ProjectPlaceholder";
import { BoneImage } from "@/components/ui/BoneImage";
import { Lightbox } from "@/components/project/Lightbox";
import { cn } from "@/lib/utils";

interface WorkArchiveProps {
  projects: Project[];
}

export function WorkArchive({ projects }: WorkArchiveProps) {
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"featured" | "newest">("featured");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["ALL", ...Array.from(set)];
  }, [projects]);

  // Filter & sort
  const filteredProjects = useMemo(() => {
    let list = projects;
    if (selectedTag !== "ALL") {
      list = list.filter((p) => p.tags.includes(selectedTag));
    }
    if (sortOrder === "newest") {
      list = [...list].sort((a, b) => Number(b.year) - Number(a.year));
    } else {
      list = [...list].sort((a, b) => a.order - b.order);
    }
    return list;
  }, [projects, selectedTag, sortOrder]);

  return (
    <main className="min-h-screen pt-28 pb-32 px-6 sm:px-12 bg-bg select-none">
      <GhostGlyph
        glyph={glyphs.work.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-rule pb-8 space-y-3">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
            <span className="text-sun font-bold">03 //</span>
            <span>SHOWROOM ARCHIVE</span>
            <span className="text-muted/40">✦</span>
            <span className="font-greek text-bone/60">{glyphs.work.greekWord}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-bone font-light tracking-tight">
              Work<span className="text-sun font-mono text-4xl ml-2">({filteredProjects.length})</span>
            </h1>

            {/* Sort toggle */}
            <div className="flex items-center border border-rule font-mono text-xs uppercase tracking-dossier p-0.5">
              <button
                onClick={() => setSortOrder("featured")}
                className={cn(
                  "px-3 py-1 transition-colors",
                  sortOrder === "featured" ? "bg-bone text-bg font-semibold" : "text-muted hover:text-bone"
                )}
                data-cursor="CLICK"
              >
                FEATURED
              </button>
              <button
                onClick={() => setSortOrder("newest")}
                className={cn(
                  "px-3 py-1 transition-colors",
                  sortOrder === "newest" ? "bg-bone text-bg font-semibold" : "text-muted hover:text-bone"
                )}
                data-cursor="CLICK"
              >
                NEWEST
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              data-cursor="CLICK"
              className={cn(
                "font-mono text-xs uppercase tracking-dossier px-3 py-1 border transition-colors",
                selectedTag === tag
                  ? "border-sun text-sun bg-sun/10"
                  : "border-rule text-muted hover:border-bone/60 hover:text-bone"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredProjects.map((p, idx) => (
              <div
                key={p.slug}
                onClick={() => setActiveLightboxIndex(idx)}
                data-cursor="VIEW"
                className="group relative border border-rule bg-surface/50 p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none hover:-translate-y-1.5 hover:border-bone/80 shadow-md"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between font-mono text-xs tracking-dossier uppercase text-muted border-b border-rule pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sun font-bold">{p.glyph}</span>
                    <span>0{p.order}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 border",
                      p.status === "live" && "border-sun text-sun",
                      p.status === "placeholder" && "border-rule text-muted",
                      p.status === "building" && "border-gold text-gold"
                    )}
                  >
                    {p.status.toUpperCase()}
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

                  {/* Playable Video Dossier Indicator */}
                  {p.demo_video && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-11 h-11 border border-bone/60 bg-surface/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 shadow-xl">
                        <span className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-sun translate-x-0.5" />
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-dossier text-bone bg-bg/85 backdrop-blur-sm border border-rule/80 px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sun animate-pulse" />
                        <span>VIDEO DOSSIER</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h2 className="font-display text-2xl text-bone font-light group-hover:text-sun transition-colors">
                    {p.title}
                  </h2>
                  <p className="font-mono text-xs text-muted leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-rule/40 font-mono text-[10px] text-muted">
                  {p.stack.slice(0, 3).map((tool) => (
                    <span key={tool} className="border border-rule/60 px-1.5 py-0.2">
                      {tool}
                    </span>
                  ))}
                  <span className="ml-auto text-bone group-hover:text-sun transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-24 space-y-4 border border-rule bg-surface/30">
            <div className="relative w-24 h-24 mx-auto opacity-40">
              <BoneImage
                src="/art/bust-fractured.bone.png"
                alt="Empty state"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-dossier text-muted">
              NOTHING HERE YET // FILTER PRODUCED ZERO MATCHES
            </p>
            <button
              onClick={() => setSelectedTag("ALL")}
              className="font-mono text-xs text-sun hover:underline uppercase tracking-dossier"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        project={activeLightboxIndex !== null ? filteredProjects[activeLightboxIndex] : null}
        onClose={() => setActiveLightboxIndex(null)}
        onNext={() =>
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev + 1) % filteredProjects.length : null
          )
        }
        onPrev={() =>
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + filteredProjects.length) % filteredProjects.length : null
          )
        }
      />
    </main>
  );
}
