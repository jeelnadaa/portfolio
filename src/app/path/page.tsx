import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { glyphs } from "@/data/glyphs";
import { pathMilestones } from "@/data/experience";
import { educationRecords } from "@/data/education";
import { achievements } from "@/data/achievements";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: `Path | The Engineering Journey | ${siteConfig.brand}`,
  description: `Chronological roadmap, academic education at PES University, and engineering milestones for ${siteConfig.legalName} (${siteConfig.brand}).`,
};

export default function PathPage() {
  return (
    <div className="relative min-h-screen bg-bg text-bone pt-28 pb-24 px-4 sm:px-8">
      {/* Background Ghost Glyph */}
      <GhostGlyph glyph={glyphs.path.giantLetter} className="top-24 right-10 opacity-5" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <header className="border-b border-rule pb-10 mb-16">
          <div className="font-mono text-xs uppercase tracking-dossier text-sun mb-3 flex items-center gap-2">
            <span>{glyphs.path.numeral} // PATH & DOSSIER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sun" />
            <span className="text-muted">{glyphs.path.greekWord}</span>
          </div>
          <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-tightest mb-4">
            The Engineering Journey
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted max-w-2xl leading-relaxed uppercase tracking-dossier">
            Chronological log of academic foundations at PES University, distributed systems milestones,
            and software engineering telemetry.
          </p>
        </header>

        {/* Part 1: Milestones Timeline */}
        <section className="mb-20">
          <div className="flex items-center justify-between border-b border-rule/50 pb-3 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-light">Milestones & Telemetry</h2>
            <span className="font-mono text-xs text-muted">2023 — 2026</span>
          </div>

          <div className="relative border-l border-rule/60 pl-6 sm:pl-10 space-y-12 ml-2 sm:ml-4">
            {pathMilestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node marker on vertical rule */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-bg border-2 border-sun flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-sun" />
                </div>

                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-sun tracking-dossier">
                    {item.year}
                  </span>
                  <span className="font-mono text-xs text-muted/60">//</span>
                  <span className="font-mono text-xs text-muted uppercase tracking-dossier">
                    {item.period}
                  </span>
                  {item.badge && (
                    <span className="ml-auto font-mono text-xs tracking-dossier uppercase px-2.5 py-0.5 border border-rule text-bone bg-surface/60">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-light text-bone group-hover:text-sun transition-colors">
                  {item.role}
                </h3>

                <div className="font-mono text-[13px] text-muted uppercase tracking-dossier mb-3">
                  {item.organization} &bull; {item.location}
                </div>

                <p className="font-sans text-base text-bone/90 leading-relaxed mb-4 max-w-3xl">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Part 2: Academic Dossier */}
        <section className="mb-20">
          <div className="flex items-center justify-between border-b border-rule/50 pb-3 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-light">Academic Foundation</h2>
            <span className="font-mono text-xs text-muted">PES University</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationRecords.map((edu, idx) => (
              <div key={idx} className="border border-rule p-6 bg-surface/30 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs text-sun uppercase tracking-dossier">
                      {edu.duration}
                    </div>
                    <h3 className="font-display text-xl font-light text-bone mt-1">
                      {edu.institution}
                    </h3>
                  </div>
                  {edu.grade && (
                    <div className="font-mono text-xs border border-rule px-2 py-1 text-bone">
                      {edu.grade}
                    </div>
                  )}
                </div>

                <div className="font-mono text-[13px] text-muted uppercase tracking-dossier">
                  {edu.degree} &bull; {edu.location}
                </div>

                {edu.coursework && (
                  <div className="pt-2 border-t border-rule/40">
                    <div className="font-mono text-xs uppercase text-muted tracking-dossier mb-2">
                      Coursework Focus:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.coursework.map((course) => (
                        <span
                          key={course}
                          className="font-mono text-xs px-2.5 py-0.5 border border-rule/60 text-bone/80"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Part 3: Honors & Distinctions */}
        <section>
          <div className="flex items-center justify-between border-b border-rule/50 pb-3 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-light">Honors & Distinctions</h2>
            <span className="font-mono text-xs text-muted">Field Recognitions</span>
          </div>

          <div className="border border-rule divide-y divide-rule/60 bg-surface/30">
            {achievements.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sun">{item.year}</span>
                    <h3 className="font-display text-lg font-light text-bone">{item.title}</h3>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-muted max-w-2xl">
                    {item.description}
                  </p>
                </div>
                {item.organization && (
                  <span className="font-mono text-[11px] uppercase tracking-dossier text-bone/70 border border-rule px-2.5 py-1 self-start sm:self-center whitespace-nowrap">
                    {item.organization}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
