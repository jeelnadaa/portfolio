"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PortraitPlaceholderProps {
  className?: string;
}

export function PortraitPlaceholder({ className }: PortraitPlaceholderProps) {
  return (
    <div
      className={cn(
        "group relative aspect-square w-full max-w-[380px] border border-rule bg-surface overflow-hidden flex flex-col items-center justify-center p-4",
        className
      )}
    >
      {/* Background Bayer Dither */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--bone) 1px, transparent 0)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* Fractured bust silhouette */}
      <div className="relative w-3/4 h-3/4 flex items-center justify-center">
        <Image
          src="/art/bust-fractured.bone.png"
          alt="Dossier portrait silhouette"
          fill
          className="object-contain opacity-60 filter blur-[0.5px] transition-all duration-500 group-hover:opacity-90 group-hover:blur-0"
          sizes="380px"
        />
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-rule/50 pt-2 font-mono text-[10px] tracking-dossier uppercase text-muted">
        <span>DOSSIER // 00</span>
        <span className="text-sun">PORTRAIT PENDING</span>
      </div>
    </div>
  );
}
