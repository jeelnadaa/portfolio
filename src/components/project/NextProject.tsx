"use client";

import Link from "next/link";
import { type Project } from "@/lib/schema";
import { cn } from "@/lib/utils";

export function NextProject({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="OPEN"
      className="group block relative w-full border-t border-b border-rule bg-surface hover:bg-sun transition-colors duration-300 py-16 sm:py-24 px-6 sm:px-12 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="font-mono text-xs uppercase tracking-dossier text-muted group-hover:text-bg transition-colors flex items-center gap-2">
            <span>NEXT DOSSIER // 0{project.order}</span>
            <span>✦</span>
            <span className="font-greek">{project.glyph}</span>
          </div>

          <h3 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-bone group-hover:text-bg transition-colors tracking-tight">
            {project.title}
          </h3>

          <p className="font-mono text-xs text-muted group-hover:text-bg/80 transition-colors uppercase tracking-dossier max-w-xl">
            {project.tagline}
          </p>
        </div>

        <div className="font-mono text-2xl sm:text-4xl text-bone group-hover:text-bg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2">
          ↗
        </div>
      </div>
    </Link>
  );
}
