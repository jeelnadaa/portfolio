"use client";

import { useState, useRef } from "react";
import { type GithubData } from "@/lib/github";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { useGsap } from "@/hooks/useGsap";
import { countUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface GithubBlockProps {
  data: GithubData;
}

const TINT_COLORS = [
  "rgba(233, 227, 210, 0.06)", // Level 0: dark/transparent
  "rgba(233, 227, 210, 0.25)", // Level 1: light bone
  "rgba(233, 227, 210, 0.50)", // Level 2: medium bone
  "rgba(233, 227, 210, 0.85)", // Level 3: strong bone
  "var(--sun)",                 // Level 4: accent sun
];

export function GithubBlock({ data }: GithubBlockProps) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const reposCountRef = useRef<HTMLSpanElement>(null);
  const starsCountRef = useRef<HTMLSpanElement>(null);
  const followersCountRef = useRef<HTMLSpanElement>(null);
  const commitsCountRef = useRef<HTMLSpanElement>(null);

  useGsap(() => {
    if (reposCountRef.current) countUp(reposCountRef.current, data.user.public_repos, 1.6);
    if (starsCountRef.current) countUp(starsCountRef.current, data.user.totalStars, 1.6, "★");
    if (followersCountRef.current) countUp(followersCountRef.current, data.user.followers, 1.6);
    if (commitsCountRef.current) countUp(commitsCountRef.current, data.user.totalCommits, 1.6);
  }, [data]);

  return (
    <section
      id="code"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.github.giantLetter}
        className="top-12 -right-12 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">05 //</span>
              <span>GITHUB TELEMETRY</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.github.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              Code in the open.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted tracking-dossier uppercase">
              LIVE REPOSITORIES, COMMIT DENSITY, AND CONTRIBUTIONS (ISR CACHED)
            </p>
          </div>

          <a
            href={`https://github.com/${data.user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="OPEN"
            className="font-mono text-xs sm:text-sm uppercase tracking-dossier text-bone hover:text-sun border border-rule hover:border-sun px-4 py-2.5 flex items-center gap-2 transition-colors self-start md:self-auto font-medium"
          >
            <span>VIEW @{data.user.login}</span>
            <span>↗</span>
          </a>
        </div>

        {/* Big Mono Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border border-rule bg-surface/30 p-6 sm:p-8 font-mono select-none">
          <div className="space-y-2">
            <div className="text-xs sm:text-sm tracking-dossier text-muted uppercase font-medium">REPOSITORIES</div>
            <div className="font-display text-3xl sm:text-5xl text-bone">
              <span ref={reposCountRef}>0</span>
            </div>
          </div>
          <div className="space-y-2 border-l border-rule pl-6">
            <div className="text-xs sm:text-sm tracking-dossier text-muted uppercase font-medium">STARS EARNED</div>
            <div className="font-display text-3xl sm:text-5xl text-bone">
              <span ref={starsCountRef}>0</span>
            </div>
          </div>
          <div className="space-y-2 border-l border-rule pl-6">
            <div className="text-xs sm:text-sm tracking-dossier text-muted uppercase font-medium">FOLLOWERS</div>
            <div className="font-display text-3xl sm:text-5xl text-bone">
              <span ref={followersCountRef}>0</span>
            </div>
          </div>
          <div className="space-y-2 border-l border-rule pl-6">
            <div className="text-xs sm:text-sm tracking-dossier text-muted uppercase font-medium">COMMITS (YR)</div>
            <div className="font-display text-3xl sm:text-5xl text-sun">
              <span ref={commitsCountRef}>0</span>
            </div>
          </div>
        </div>

        {/* Custom Contribution Heatmap */}
        <div className="border border-rule bg-surface/40 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs sm:text-sm uppercase tracking-dossier text-muted border-b border-rule pb-3">
            <span className="font-semibold text-bone/90">ANNUAL ACTIVITY MATRIX (52 WEEKS)</span>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>LESS</span>
              {TINT_COLORS.map((col, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-sharp inline-block border border-rule/30"
                  style={{ backgroundColor: col }}
                />
              ))}
              <span>MORE</span>
            </div>
          </div>

          <div className="overflow-x-auto py-2">
            <div className="w-full min-w-[760px] flex justify-between gap-1 sm:gap-1.5">
              {data.contributionWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5">
                  {week.days.map((day) => (
                    <div
                      key={day.date}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          text: `${day.count} contributions on ${day.date}`,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 28,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className="w-full aspect-square rounded-sharp transition-transform hover:scale-125 cursor-crosshair"
                      style={{
                        backgroundColor: TINT_COLORS[day.level] || TINT_COLORS[0],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Bar & Recent Repos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Language Breakdown */}
          <div className="lg:col-span-5 border border-rule bg-surface/40 p-6 space-y-4 font-mono">
            <div className="text-xs uppercase tracking-dossier text-muted border-b border-rule pb-2">
              PRIMARY CODE COMPOSITION
            </div>

            {/* Continuous Bar */}
            <div className="h-3 w-full flex overflow-hidden border border-rule">
              {data.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* Language Legend */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              {data.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-sharp shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-bone/80">{lang.name}</span>
                  <span className="text-muted ml-auto">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Latest Repos */}
          <div className="lg:col-span-7 border border-rule bg-surface/40 p-6 space-y-4 font-mono">
            <div className="text-xs uppercase tracking-dossier text-muted border-b border-rule pb-2 flex items-center justify-between">
              <span>ACTIVE REPOSITORIES</span>
              <span>LATEST COMMITS</span>
            </div>

            <div className="divide-y divide-rule/30">
              {data.repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN"
                  className="group py-3 flex items-start justify-between gap-4 hover:bg-surface/60 transition-colors block"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[13px] text-bone group-hover:text-sun transition-colors font-bold">
                      <span>{repo.name}</span>
                      <span className="text-muted text-xs font-normal border border-rule px-1.5 py-0.5">
                        {repo.language}
                      </span>
                    </div>
                    <p className="text-xs text-muted/80 line-clamp-1 max-w-md font-sans">
                      {repo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted shrink-0">
                    <span className="hidden sm:inline">★ {repo.stars}</span>
                    <span>{repo.updatedAt}</span>
                    <span className="text-bone group-hover:text-sun group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {tooltip && (
        <div
          role="tooltip"
          aria-hidden="true"
          className="fixed pointer-events-none z-[99999] -translate-x-1/2 px-2.5 py-1 bg-surface text-bone border border-bone/60 font-mono text-xs tracking-dossier shadow-lg whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
