"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { type Project } from "@/lib/schema";
import { ProjectPlaceholder } from "@/components/ui/ProjectPlaceholder";
import { BoneImage } from "@/components/ui/BoneImage";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

interface LightboxProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function Lightbox({ project, onClose, onNext, onPrev }: LightboxProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Lightbox`}
      className="fixed inset-0 z-[80000] flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        data-cursor="CLOSE"
        className="fixed inset-0 bg-bg/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl border border-bone/60 bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col cursor-default"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-rule px-6 py-3 bg-bg/50">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
            <span className="text-sun font-bold">{project.glyph}</span>
            <span>PROJECT {String(project.order).padStart(2, "0")} // DOSSIER</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-[10px] text-muted">
              ← PREV / NEXT →
            </span>
            <button
              onClick={onClose}
              data-cursor="CLICK"
              className="font-mono text-xs uppercase tracking-dossier text-bone hover:text-sun border border-rule px-2 py-0.5"
            >
              ESC ✕
            </button>
          </div>
        </div>

        {/* Media Cover */}
        <div className="relative w-full aspect-[16/9] bg-bg overflow-hidden border-b border-rule">
          {project.cover ? (
            <BoneImage
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
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

        {/* Content & Actions */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-4xl text-bone font-light">
              {project.title}
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              {project.summary}
            </p>
          </div>

          {/* Stack Chips */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-rule/50">
            <Button
              href={`/work/${project.slug}`}
              variant="sun"
              arrow
              onClick={onClose}
            >
              Open case study
            </Button>
            {project.github && (
              <Button href={project.github} variant="outline" external arrow>
                GitHub
              </Button>
            )}
            {project.live && (
              <Button href={project.live} variant="outline" external arrow>
                Live preview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
