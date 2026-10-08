"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

export function ContactCta() {
  return (
    <section className="relative w-full pt-28 pb-16 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="font-mono text-xs uppercase tracking-dossier text-sun font-semibold">
          TRANSMISSION INITIATION // 09
        </div>

        <div className="max-w-4xl space-y-6">
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl text-bone font-light tracking-tight leading-[1.05]">
            Let&rsquo;s build{" "}
            <span className="italic text-sun font-normal">something</span>.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-muted uppercase tracking-dossier max-w-xl leading-relaxed">
            AVAILABLE FOR SOFTWARE ENGINEERING INTERNSHIPS, SYSTEMS OPTIMIZATION, AND AMBITIOUS TECHNICAL BUILDS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          <Magnetic strength={0.3}>
            <Button href="/contact" variant="sun" arrow>
              Transmit message
            </Button>
          </Magnetic>

          <Magnetic strength={0.3}>
            <Button href={`mailto:${siteConfig.email}`} variant="outline" external arrow>
              Direct email ({siteConfig.email})
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
