import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug, getNextProject } from "@/lib/projects";
import { siteConfig } from "@/data/site";
import { ProjectPlaceholder } from "@/components/ui/ProjectPlaceholder";
import { BoneImage } from "@/components/ui/BoneImage";
import { Button } from "@/components/ui/Button";
import { ProjectNarrative } from "@/components/project/ProjectNarrative";
import { Gallery } from "@/components/project/Gallery";
import { NextProject } from "@/components/project/NextProject";
import { MetaTable } from "@/components/project/MetaTable";
import { GhostGlyph } from "@/components/ui/GhostGlyph";

interface CaseStudyProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: `Not Found · ${siteConfig.brand}` };

  return {
    title: `${project.title} · ${siteConfig.brand}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${siteConfig.legalName}`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const nextProj = await getNextProject(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    programmingLanguage: project.stack,
    author: {
      "@type": "Person",
      name: siteConfig.legalName,
      alternateName: siteConfig.brand,
    },
    codeRepository: project.github || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen pt-28 pb-0 bg-bg text-bone select-none">
        <GhostGlyph glyph={project.glyph} className="top-16 -right-12 opacity-6" />

        <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-16">
          {/* 1. Hero Dossier */}
          <div className="space-y-6 border-b border-rule pb-12">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">{project.glyph}</span>
              <span>PROJECT 0{project.order} // CASE STUDY DOSSIER</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-bone">
              {project.title}
            </h1>

            <p className="font-mono text-xs sm:text-sm text-muted uppercase tracking-dossier max-w-2xl leading-relaxed">
              {project.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.github && (
                <Button href={project.github} variant="sun" external arrow>
                  Open code
                </Button>
              )}
              {project.live && (
                <Button href={project.live} variant="outline" external arrow>
                  Live preview
                </Button>
              )}
              {project.demo_video && (
                <Button href={project.demo_video} variant="outline" external arrow>
                  Watch demo
                </Button>
              )}
            </div>

            {/* Metadata Table */}
            <MetaTable project={project} />
          </div>

          {/* 2. Cover Plate */}
          <div className="relative w-full aspect-[16/10] border border-rule bg-surface overflow-hidden">
            {project.cover ? (
              <BoneImage
                src={project.cover}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            ) : (
              <ProjectPlaceholder
                seed={project.slug}
                order={project.order}
                glyph={project.glyph}
              />
            )}
          </div>

          {/* 3. Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-rule">
            <div className="md:col-span-4 font-mono text-xs uppercase tracking-dossier text-sun font-semibold">
              00 // SUMMARY STATEMENT
            </div>
            <div className="md:col-span-8 font-sans text-base sm:text-lg text-bone/90 leading-relaxed space-y-4">
              <p>{project.summary}</p>
            </div>
          </div>

          {/* 4. Core Narrative Sections */}
          <ProjectNarrative project={project} />

          {/* 7. Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="border border-rule bg-surface/40 p-6 space-y-4 font-mono">
              <div className="text-[10px] tracking-dossier uppercase text-sun font-bold border-b border-rule pb-2">
                EMPIRICAL METRICS & BENCHMARKS
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {project.metrics.map((m) => (
                  <div key={m.label} className="space-y-1">
                    <span className="text-[10px] text-muted uppercase block">{m.label}</span>
                    <span className="font-display text-3xl text-bone">
                      {m.value}
                      <span className="text-xs text-sun ml-1 font-mono">{m.suffix}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Stack With Reasons */}
          {project.stackReasons && project.stackReasons.length > 0 && (
            <div className="border border-rule bg-surface/40 p-6 space-y-4 font-mono">
              <div className="text-[10px] tracking-dossier uppercase text-muted border-b border-rule pb-2">
                TOOLING JUSTIFICATION
              </div>
              <div className="divide-y divide-rule/30">
                {project.stackReasons.map((item) => (
                  <div key={item.tool} className="py-2.5 flex items-baseline justify-between gap-4 text-xs">
                    <span className="text-sun font-semibold shrink-0">{item.tool}</span>
                    <span className="text-muted text-right font-sans text-[11px]">{item.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <Gallery images={project.gallery} title={project.title} />
        )}

        {/* 10. Next Project Teaser */}
        {nextProj && <NextProject project={nextProj} />}
      </main>
    </>
  );
}
