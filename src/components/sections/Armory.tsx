"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { armoryGroups, armoryStats } from "@/data/skills";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { useGsap } from "@/hooks/useGsap";
import { useLenis } from "@/lib/lenis";
import { countUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Armory() {
  const lenis = useLenis();
  const [filterQuery, setFilterQuery] = useState("");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const langCountRef = useRef<HTMLSpanElement>(null);
  const frameCountRef = useRef<HTMLSpanElement>(null);
  const projCountRef = useRef<HTMLSpanElement>(null);

  // Automatic smooth scroll to armory when navigated from other pages with /#armory
  useEffect(() => {
    const shouldScrollToArmory = () => {
      if (typeof window === "undefined") return false;
      return (
        window.location.hash === "#armory" ||
        sessionStorage.getItem("scroll_to_armory") === "true"
      );
    };

    const performScroll = () => {
      if (!shouldScrollToArmory()) return;
      const el = document.getElementById("armory");
      if (!el) return;

      try {
        sessionStorage.removeItem("scroll_to_armory");
      } catch {}

      if (lenis) {
        lenis.scrollTo(el, { offset: -40, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Staggered attempts to ensure scroll fires after layout, hydration, and fonts settle
    performScroll();
    const t1 = setTimeout(performScroll, 80);
    const t2 = setTimeout(performScroll, 250);
    const t3 = setTimeout(performScroll, 600);
    const t4 = setTimeout(performScroll, 1100);

    window.addEventListener("hashchange", performScroll);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("hashchange", performScroll);
    };
  }, [lenis]);

  useGsap(() => {
    if (langCountRef.current) countUp(langCountRef.current, armoryStats.languagesCount, 1.6);
    if (frameCountRef.current) countUp(frameCountRef.current, armoryStats.frameworksCount, 1.6);
    if (projCountRef.current) countUp(projCountRef.current, armoryStats.shippedProjectsCount, 1.6);
  }, []);

  // Keyboard shortcut '/' focuses search, 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setFilterQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter skills by query
  const filteredGroups = armoryGroups.map((grp) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return grp;
    return {
      ...grp,
      skills: grp.skills.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.usedInName && s.usedInName.toLowerCase().includes(q))
      ),
    };
  }).filter((grp) => grp.skills.length > 0);

  return (
    <section
      id="armory"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.skills.giantLetter}
        className="top-12 -left-12 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header Pattern */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">04 //</span>
              <span>ARMORY MANIFEST</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.skills.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              Everything I reach for.
            </h2>
            <p className="font-mono text-xs text-muted tracking-dossier uppercase">
              TECHNICAL REPERTOIRE // RECORDED WITHOUT ARBITRARY PERCENTAGE GAUGES
            </p>
          </div>

          {/* Search/Filter Bar */}
          <div className="flex items-center gap-2 border border-rule px-3 py-1.5 bg-surface/50 max-w-xs w-full">
            <span className="font-mono text-xs text-sun">&gt;</span>
            <input
              ref={searchInputRef}
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter armory (press /)..."
              className="w-full bg-transparent font-mono text-xs uppercase tracking-dossier text-bone placeholder:text-muted/60 focus:outline-none"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="font-mono text-[10px] text-muted hover:text-sun"
              >
                ESC ✕
              </button>
            )}
          </div>
        </div>

        {/* Big Counter Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border border-rule bg-surface/30 p-6 sm:p-8 font-mono select-none">
          <div className="space-y-1">
            <div className="text-[10px] tracking-dossier uppercase text-muted">PRIMARY LANGUAGES</div>
            <div className="font-display text-4xl sm:text-5xl text-bone">
              <span ref={langCountRef}>0</span>
            </div>
            <div className="text-[10px] text-bone/60 tracking-dossier">C++, TYPESCRIPT, PYTHON & MORE</div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-rule sm:pl-8">
            <div className="text-[10px] tracking-dossier uppercase text-muted">FRAMEWORKS & ENGINES</div>
            <div className="font-display text-4xl sm:text-5xl text-bone">
              <span ref={frameCountRef}>0</span>
            </div>
            <div className="text-[10px] text-bone/60 tracking-dossier">NEXT.JS, THREE.JS, PYTORCH</div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-rule sm:pl-8">
            <div className="text-[10px] tracking-dossier uppercase text-muted">SYSTEMS SHIPPED</div>
            <div className="font-display text-4xl sm:text-5xl text-sun">
              <span ref={projCountRef}>0</span>
            </div>
            <div className="text-[10px] text-bone/60 tracking-dossier">VERIFIED OPEN SOURCE BUILDS</div>
          </div>
        </div>

        {/* Grouped Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredGroups.map((grp) => (
            <div
              key={grp.id}
              className="border border-rule bg-surface/40 p-6 flex flex-col justify-between space-y-6"
            >
              {/* Block Header */}
              <div className="flex items-center justify-between border-b border-rule pb-3 font-mono text-xs uppercase tracking-dossier">
                <div className="flex items-center gap-2 text-bone font-semibold">
                  <span className="text-sun font-bold">{grp.badge}</span>
                  <span>// {grp.title}</span>
                </div>
                <span className="text-muted text-[10px]">{grp.skills.length} PACKAGES</span>
              </div>

              {/* Skills Manifest List */}
              <div className="space-y-3 font-mono text-xs">
                {grp.skills.map((skill) => (
                  <div
                    key={skill.name}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={cn(
                      "group relative pl-3 py-1.5 transition-all flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-rule/20",
                      hoveredSkill === skill.name && "border-sun/60 bg-surface/80",
                      hoveredSkill !== null && hoveredSkill !== skill.name && "opacity-50"
                    )}
                  >
                    {/* Left Sun-Red Indicator */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-sun transition-opacity",
                        hoveredSkill === skill.name ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <div>
                      <span className="text-bone font-semibold mr-2">{skill.name}</span>
                      <span className="text-muted text-[11px] font-normal leading-normal">
                        {skill.description}
                      </span>
                    </div>

                    {skill.usedInSlug && (
                      <Link
                        href={`/work/${skill.usedInSlug}`}
                        className="text-[10px] text-muted hover:text-sun shrink-0 uppercase tracking-dossier border border-rule px-1.5 py-0.5"
                        data-cursor="OPEN"
                      >
                        used in: {skill.usedInName} ↗
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Block Path Footer */}
              <div className="font-mono text-[10px] tracking-dossier text-muted/60 border-t border-rule/40 pt-2 flex items-center justify-between">
                <span>{grp.pathKey}</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
