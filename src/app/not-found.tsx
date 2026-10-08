"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const [easterEgg, setEasterEgg] = useState(false);

  return (
    <main className="min-h-screen pt-28 pb-32 flex flex-col items-center justify-center px-6 bg-bg text-bone text-center select-none relative overflow-hidden">
      <GhostGlyph
        glyph={glyphs.notFound.giantLetter}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
      />

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        {/* Fractured bust with gold seams */}
        <div className="relative w-48 h-48 mx-auto" data-cursor="torch">
          <Image
            src="/art/bust-fractured.bone.png"
            alt="Fractured bust"
            fill
            sizes="192px"
            className="object-contain opacity-70"
          />
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen animate-pulse duration-[3000ms]"
            style={{ filter: "drop-shadow(0 0 12px rgba(201, 162, 75, 0.7))" }}
          >
            <Image
              src="/art/bust-fractured.color.webp"
              alt=""
              fill
              sizes="192px"
              className="object-contain"
            />
          </div>
        </div>

        {/* 404 Label */}
        <div className="space-y-3">
          <div className="font-mono text-xs uppercase tracking-dossier text-sun font-semibold">
            ERROR 404 // {glyphs.notFound.greekWord}
          </div>
          <h1 className="font-display text-6xl sm:text-8xl text-bone font-light tracking-tight">
            404
          </h1>
          <p className="font-mono text-sm sm:text-base text-muted uppercase tracking-dossier max-w-md mx-auto">
            This page doesn&rsquo;t exist. The work does.
          </p>
        </div>

        <div>
          <Button href="/" variant="sun" arrow>
            Return to Dossier
          </Button>
        </div>
      </div>

      {/* Subtle Easter Egg in bottom-left corner */}
      <div
        onMouseEnter={() => setEasterEgg(true)}
        onMouseLeave={() => setEasterEgg(false)}
        className="absolute bottom-4 left-4 p-2 cursor-default select-none"
      >
        <span className="font-mono text-[10px] text-muted/30 hover:text-sun transition-colors">
          {easterEgg ? "quack." : "·"}
        </span>
      </div>
    </main>
  );
}
