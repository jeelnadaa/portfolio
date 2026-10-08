"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { pathMilestones } from "@/data/experience";
import { educationRecords } from "@/data/education";
import { achievements } from "@/data/achievements";
import { armoryGroups } from "@/data/skills";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { BoneImage } from "@/components/ui/BoneImage";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function ResumePage() {
  const [viewMode, setViewMode] = useState<"web" | "pdf">("web");
  const { showToast } = useToast();

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    showToast("EMAIL COPIED ✓");
  };

  return (
    <main className="min-h-screen pt-28 pb-32 bg-bg text-bone select-none">
      <GhostGlyph
        glyph={glyphs.resume.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Sticky Action Bar & Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-6 sticky top-20 bg-bg/95 backdrop-blur-md z-30 pt-4">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier">
            <button
              onClick={() => setViewMode("web")}
              className={cn(
                "px-3 py-1 border transition-colors",
                viewMode === "web"
                  ? "bg-bone text-bg border-bone font-semibold"
                  : "border-rule text-muted hover:text-bone"
              )}
              data-cursor="CLICK"
            >
              WEB DOSSIER
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={cn(
                "px-3 py-1 border transition-colors",
                viewMode === "pdf"
                  ? "bg-bone text-bg border-bone font-semibold"
                  : "border-rule text-muted hover:text-bone"
              )}
              data-cursor="CLICK"
            >
              PDF PREVIEW
            </button>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier">
            <a
              href={siteConfig.resumePdf}
              download={siteConfig.resumeDownloadName}
              data-cursor="OPEN"
              className="px-3 py-1 bg-sun text-bg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>DOWNLOAD PDF</span>
              <span>↓</span>
            </a>
            <button
              onClick={copyEmail}
              data-cursor="COPY"
              className="px-3 py-1 border border-rule hover:border-bone hover:text-bone text-muted transition-colors"
            >
              COPY EMAIL
            </button>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="px-3 py-1 border border-rule hover:border-bone hover:text-bone text-muted transition-colors"
            >
              LINKEDIN ↗
            </a>
          </div>
        </div>

        {/* 1. PDF VIEW */}
        {viewMode === "pdf" && (
          <div className="border border-rule bg-surface p-4 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-muted">
              <span>DOCUMENT // {siteConfig.resumeDownloadName}</span>
              <span>OCTOBER 2026 EDITION</span>
            </div>
            <div className="w-full h-[850px] border border-rule/60 bg-bg">
              <object
                data={siteConfig.resumePdf}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="p-8 text-center space-y-4">
                  <p className="font-mono text-xs text-muted">
                    PDF plugin not detected in browser.
                  </p>
                  <Button
                    href={siteConfig.resumePdf}
                    download={siteConfig.resumeDownloadName}
                    variant="sun"
                  >
                    Direct PDF Download ↓
                  </Button>
                </div>
              </object>
            </div>
          </div>
        )}

        {/* 2. WEB VIEW: Typographic Dossier */}
        {viewMode === "web" && (
          <div className="print-page space-y-16">
            {/* Header */}
            <div className="space-y-4 border-b border-rule pb-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <h1 className="font-display text-5xl sm:text-7xl font-light text-bone tracking-tight">
                    {siteConfig.legalName}
                  </h1>
                  <span className="font-mono text-xs uppercase tracking-dossier text-sun">
                    a.k.a. {siteConfig.brand}
                  </span>
                </div>

                <div className="font-mono text-xs text-muted space-y-1 sm:text-right">
                  <div>{siteConfig.role}</div>
                  <div>{siteConfig.location}</div>
                  <div className="text-bone">{siteConfig.email}</div>
                </div>
              </div>
            </div>

            {/* Layout: Main content + Sticky Laurel Branch Art */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-12">
                {/* Summary */}
                <section className="space-y-3 border-b border-rule pb-8">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    01 // EXECUTIVE SUMMARY
                  </div>
                  <p className="font-sans text-sm sm:text-base text-bone/90 leading-relaxed">
                    Third-year Computer Science student at PES University in Bengaluru (CGPA 8.43). Focused on systems programming, distributed messaging architectures, and low-latency graphical shaders. Passionate about verifiable software that runs with zero runtime bloat.
                  </p>
                </section>

                {/* Education */}
                <section className="space-y-4 border-b border-rule pb-8">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    02 // EDUCATION
                  </div>
                  {educationRecords.map((edu) => (
                    <div key={edu.degree} className="space-y-2">
                      <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
                        <span className="text-bone font-bold">{edu.degree}</span>
                        <span className="text-muted">{edu.duration}</span>
                      </div>
                      <div className="font-mono text-xs text-sun">
                        {edu.institution} · {edu.grade}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[10px] text-muted">
                        {edu.coursework.map((course) => (
                          <span key={course} className="border border-rule/50 px-1.5 py-0.2">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Experience */}
                <section className="space-y-6 border-b border-rule pb-8">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    03 // EXPERIENCE & MILESTONES
                  </div>
                  <div className="space-y-6">
                    {pathMilestones.map((exp) => (
                      <div key={exp.year + exp.role} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
                          <span className="text-bone font-bold">{exp.role}</span>
                          <span className="text-muted">{exp.period}</span>
                        </div>
                        <div className="font-mono text-xs text-muted">
                          {exp.organization} ({exp.location})
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-bone/80 leading-relaxed">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] text-muted">
                          {exp.skills.map((s) => (
                            <span key={s} className="border border-rule/40 px-1 py-0.2">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Featured Projects */}
                <section className="space-y-4 border-b border-rule pb-8">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    04 // FEATURED SYSTEMS
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
                        <Link href="/work/project-alpha" className="text-bone font-bold hover:text-sun transition-colors">
                          Project Alpha — High-Throughput Broker ↗
                        </Link>
                        <span className="text-muted">2026</span>
                      </div>
                      <p className="font-sans text-xs text-muted">
                        Engineered zero-copy streaming pipeline over ring buffers. Achieved &lt;1.2ms p99 message transit times.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
                        <Link href="/work/project-beta" className="text-bone font-bold hover:text-sun transition-colors">
                          Project Beta — Quantized Neural Engine ↗
                        </Link>
                        <span className="text-muted">2026</span>
                      </div>
                      <p className="font-sans text-xs text-muted">
                        Dynamic INT8 quantization of embedding transformer layers down to 14MB footprint with 8.4ms inference.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section className="space-y-4 border-b border-rule pb-8">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    05 // TECHNICAL REPERTOIRE
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    {armoryGroups.slice(0, 4).map((grp) => (
                      <div key={grp.id} className="border border-rule p-3 space-y-1">
                        <div className="text-[10px] text-muted uppercase tracking-dossier">
                          {grp.title}
                        </div>
                        <div className="text-bone text-[11px] leading-relaxed">
                          {grp.skills.map((s) => s.name).join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Achievements */}
                <section className="space-y-4">
                  <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                    06 // HONORS & RECOGNITION
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    {achievements.map((a) => (
                      <div key={a.title} className="flex items-baseline justify-between gap-4">
                        <span className="text-bone">{a.title} ({a.organization})</span>
                        <span className="text-muted">{a.year}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Decorative Laurel Art Sidebar */}
              <div className="hidden lg:block lg:col-span-4 sticky top-40 space-y-4">
                <div className="relative w-full aspect-[4/5] border border-rule bg-surface/50 overflow-hidden">
                  <BoneImage
                    src="/art/hand-laurel.bone.png"
                    alt="Laurel branch of merit"
                    fill
                    sizes="320px"
                    className="object-contain"
                  />
                  <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-dossier text-muted bg-bg/80 px-1.5 py-0.5 border border-rule">
                    ΒΙΟΣ // MERIT & DISCIPLINE
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
