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
          <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier">
            <button
              onClick={() => setViewMode("web")}
              className={cn(
                "px-3.5 py-1.5 border transition-colors",
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
                "px-3.5 py-1.5 border transition-colors",
                viewMode === "pdf"
                  ? "bg-bone text-bg border-bone font-semibold"
                  : "border-rule text-muted hover:text-bone"
              )}
              data-cursor="CLICK"
            >
              PDF PREVIEW
            </button>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-dossier">
            <a
              href={siteConfig.resumePdf}
              download={siteConfig.resumeDownloadName}
              data-cursor="OPEN"
              className="px-3.5 py-1.5 bg-sun text-bg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>DOWNLOAD PDF</span>
              <span>↓</span>
            </a>
            <button
              onClick={copyEmail}
              data-cursor="COPY"
              className="px-3.5 py-1.5 border border-rule hover:border-bone hover:text-bone text-muted transition-colors"
            >
              COPY EMAIL
            </button>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="px-3.5 py-1.5 border border-rule hover:border-bone hover:text-bone text-muted transition-colors"
            >
              LINKEDIN ↗
            </a>
          </div>
        </div>

        {/* 1. PDF VIEW */}
        {viewMode === "pdf" && (
          <div className="border border-rule bg-surface p-4 space-y-4">
            <div className="flex items-center justify-between font-mono text-sm text-muted">
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
                  <p className="font-mono text-sm text-muted">
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
                  <span className="font-mono text-sm uppercase tracking-dossier text-sun font-semibold mt-1 block">
                    a.k.a. {siteConfig.brand}
                  </span>
                </div>

                <div className="font-mono text-sm sm:text-base text-muted space-y-1 sm:text-right">
                  <div className="text-bone/90 font-medium">{siteConfig.role}</div>
                  <div>{siteConfig.location}</div>
                  <div className="text-sun">{siteConfig.email}</div>
                </div>
              </div>
            </div>

            {/* Layout: Main content + Sticky Laurel Branch Art */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-12">
                {/* Summary */}
                <section className="space-y-4 border-b border-rule pb-8">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    01 // EXECUTIVE SUMMARY
                  </div>
                  <p className="font-sans text-base sm:text-lg text-bone/90 leading-relaxed">
                    Third-year Computer Science student at PES University in Bengaluru (CGPA 8.43). Focused on systems programming, distributed messaging architectures, and low-latency graphical shaders. Passionate about verifiable software that runs with zero runtime bloat.
                  </p>
                </section>

                {/* Education */}
                <section className="space-y-6 border-b border-rule pb-8">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    02 // EDUCATION
                  </div>
                  {educationRecords.map((edu) => (
                    <div key={edu.degree} className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono">
                        <span className="text-bone text-base sm:text-lg font-bold">{edu.degree}</span>
                        <span className="text-muted text-sm sm:text-base shrink-0">{edu.duration}</span>
                      </div>
                      <div className="font-mono text-sm sm:text-base text-sun font-medium">
                        {edu.institution} · {edu.grade}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs sm:text-sm text-bone/70">
                        {edu.coursework.map((course) => (
                          <span key={course} className="border border-rule/60 px-2.5 py-0.5 bg-surface/30">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Experience */}
                <section className="space-y-8 border-b border-rule pb-8">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    03 // EXPERIENCE & MILESTONES
                  </div>
                  <div className="space-y-8">
                    {pathMilestones.map((exp) => (
                      <div key={exp.year + exp.role} className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono">
                          <span className="text-bone text-base sm:text-lg font-bold">{exp.role}</span>
                          <span className="text-muted text-sm sm:text-base shrink-0">{exp.period}</span>
                        </div>
                        <div className="font-mono text-sm sm:text-base text-sun font-medium">
                          {exp.organization} ({exp.location})
                        </div>
                        <p className="font-sans text-sm sm:text-base text-bone/85 leading-relaxed">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs sm:text-sm text-bone/70">
                          {exp.skills.map((s) => (
                            <span key={s} className="border border-rule/50 px-2.5 py-0.5 bg-surface/30">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Featured Projects */}
                <section className="space-y-6 border-b border-rule pb-8">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    04 // FEATURED SYSTEMS
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono">
                        <Link href="/work/kafka-clone" className="text-bone text-base sm:text-lg font-bold hover:text-sun transition-colors">
                          Distributed Message Broker (Kafka Clone) ↗
                        </Link>
                        <span className="text-muted text-sm sm:text-base shrink-0">2026</span>
                      </div>
                      <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed">
                        Event-driven broker in pure Java using raw TCP ServerSockets, an append-only commit log engine with O(1) sequential writes, and binary offset indexing.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono">
                        <Link href="/work/plantiq-capstone" className="text-bone text-base sm:text-lg font-bold hover:text-sun transition-colors">
                          PlantIQ — Coffee Agronomy Advisory Platform ↗
                        </Link>
                        <span className="text-muted text-sm sm:text-base shrink-0">2026</span>
                      </div>
                      <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed">
                        Multimodal coffee agronomy platform with fine-tuned ResNet-50 CNN (96.4% Top-1 accuracy at ~65ms CPU inference), 3-stage Hybrid RAG, and Kannada vernacular pre-routing.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono">
                        <Link href="/work/quacky" className="text-bone text-base sm:text-lg font-bold hover:text-sun transition-colors">
                          Quacky — Pure Offline Android Suite ↗
                        </Link>
                        <span className="text-muted text-sm sm:text-base shrink-0">2026</span>
                      </div>
                      <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed">
                        15+ focused on-device tools with zero network permissions (zero internet permission), monochromatic dark design, and local Room SQLite persistence.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section className="space-y-6 border-b border-rule pb-8">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    05 // TECHNICAL REPERTOIRE
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                    {armoryGroups.map((grp) => (
                      <div key={grp.id} className="border border-rule p-4 space-y-2 bg-surface/30">
                        <div className="text-xs sm:text-sm text-sun uppercase tracking-dossier font-bold">
                          {grp.title}
                        </div>
                        <div className="text-bone text-xs sm:text-sm leading-relaxed">
                          {grp.skills.map((s) => s.name).join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Achievements */}
                <section className="space-y-6">
                  <div className="font-mono text-sm sm:text-base uppercase tracking-dossier text-sun font-bold">
                    06 // HONORS & RECOGNITION
                  </div>
                  <div className="space-y-4 font-mono">
                    {achievements.map((a) => (
                      <div key={a.title} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm sm:text-base border-b border-rule/30 pb-3 last:border-0">
                        <span className="text-bone font-medium">{a.title} ({a.organization})</span>
                        <span className="text-muted shrink-0">{a.year}</span>
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
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] sm:text-xs uppercase tracking-dossier text-muted bg-bg/80 px-2 py-0.5 border border-rule">
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
