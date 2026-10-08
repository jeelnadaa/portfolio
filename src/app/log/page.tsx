"use client";

import { useState, useMemo } from "react";
import { logEntries } from "@/data/log";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export default function LogPage() {
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    logEntries.forEach((l) => l.tags.forEach((t) => set.add(t)));
    return ["ALL", ...Array.from(set)];
  }, []);

  const filteredLogs = useMemo(() => {
    if (selectedTag === "ALL") return logEntries;
    return logEntries.filter((l) => l.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <main className="min-h-screen pt-28 pb-32 bg-bg text-bone select-none">
      <GhostGlyph
        glyph={glyphs.log.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Header */}
        <div className="border-b border-rule pb-8 space-y-3">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
            <span className="text-sun font-bold">10 //</span>
            <span>SYSTEM CHRONICLE</span>
            <span className="text-muted/40">✦</span>
            <span className="font-greek text-bone/60">{glyphs.log.greekWord}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-display text-5xl sm:text-7xl text-bone font-light tracking-tight">
              Log.
            </h1>
            <div className="font-mono text-xs text-muted uppercase tracking-dossier">
              RECORDED MILESTONES & RELEASES ({filteredLogs.length})
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              data-cursor="CLICK"
              className={cn(
                "font-mono text-xs uppercase tracking-dossier px-3 py-1 border transition-colors",
                selectedTag === t
                  ? "border-sun text-sun bg-sun/10"
                  : "border-rule text-muted hover:border-bone/60 hover:text-bone"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Entries List with Sticky Month Headers */}
        <div className="space-y-12">
          {filteredLogs.map((entry) => (
            <article
              key={entry.id}
              className="border border-rule bg-surface/40 p-6 sm:p-8 space-y-4 hover:border-bone/60 transition-colors"
            >
              {/* Top Row with Version and Date */}
              <div className="flex items-baseline justify-between border-b border-rule pb-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  {entry.version && (
                    <span className="text-sun font-bold border border-sun/60 bg-sun/5 px-2 py-0.5">
                      {entry.version}
                    </span>
                  )}
                  <span className="text-muted tracking-dossier">{entry.monthYear}</span>
                </div>
                <span className="text-[11px] text-muted">{entry.date}</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl text-bone font-light">
                {entry.title}
              </h2>

              {/* Body */}
              <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed max-w-3xl">
                {entry.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-rule/30">
                {entry.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
