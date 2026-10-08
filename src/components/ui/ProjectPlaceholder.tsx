"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProjectPlaceholderProps {
  seed: string;
  order?: number;
  glyph?: string;
  className?: string;
}

export function ProjectPlaceholder({
  seed,
  order = 1,
  glyph = "Α",
  className,
}: ProjectPlaceholderProps) {
  // Deterministic values from seed
  const { angle, dotDensity, dotSize } = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    return {
      angle: (absHash % 180) - 90,
      dotDensity: 4 + (absHash % 6),
      dotSize: 1 + (absHash % 2),
    };
  }, [seed]);

  const indexStr = String(order).padStart(2, "0");

  return (
    <div
      className={cn(
        "group relative w-full aspect-[16/10] overflow-hidden border border-rule bg-surface flex flex-col justify-between p-6 select-none",
        className
      )}
    >
      {/* Generative dithered gradient canvas effect */}
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{
          backgroundImage: `radial-gradient(var(--bone) ${dotSize}px, transparent 0)`,
          backgroundSize: `${dotDensity}px ${dotDensity}px`,
          transform: `rotate(${angle}deg) scale(1.5)`,
        }}
      />

      {/* Diagonal scanline / rule */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(45deg,transparent_45%,var(--bone)_50%,transparent_55%)] bg-[length:10px_10px]"
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-dossier uppercase text-muted">
        <span>PROJECT {indexStr} // PLACEHOLDER</span>
        <span className="text-sun font-semibold">PENDING CASE STUDY</span>
      </div>

      {/* Center Giant Greek Numeral */}
      <div
        className="relative z-10 self-center font-greek text-7xl sm:text-8xl md:text-9xl text-bone/20 transition-transform duration-500 group-hover:scale-105 group-hover:text-bone/40 select-none"
        aria-hidden="true"
      >
        {glyph}
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[11px] tracking-dossier uppercase text-bone/70 border-t border-rule/60 pt-3">
        <span>SEED: {seed}</span>
        <span className="text-muted group-hover:text-sun transition-colors">
          IN PROGRESS ↗
        </span>
      </div>
    </div>
  );
}
