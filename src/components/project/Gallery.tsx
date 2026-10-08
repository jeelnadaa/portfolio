"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { BoneImage } from "@/components/ui/BoneImage";

interface GalleryProps {
  images: string[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced || images.length <= 1) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const totalWidth = track.scrollWidth - window.innerWidth + 80;
    if (totalWidth <= 0) return;

    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, [images, prefersReduced]);

  if (!images || images.length === 0) return null;

  return (
    <section ref={containerRef} className="relative w-full py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 font-mono text-xs uppercase tracking-dossier text-muted flex items-center justify-between">
        <span>05 // ARTIFACT GALLERY ({images.length})</span>
        <span className="hidden sm:inline text-sun">HORIZONTAL INSPECTION ➔</span>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col sm:flex-row gap-8 px-6 sm:px-12 will-change-transform"
      >
        {images.map((imgSrc, idx) => (
          <div
            key={idx}
            className="relative shrink-0 w-full sm:w-[640px] md:w-[780px] aspect-[16/10] border border-rule bg-surface overflow-hidden group select-none"
            data-cursor="VIEW"
          >
            <BoneImage
              src={imgSrc}
              alt={`${title} preview ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 780px"
              className="object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-dossier text-bone/70 bg-bg/70 px-2 py-0.5 border border-rule">
              PLATE 0{idx + 1} // {title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
