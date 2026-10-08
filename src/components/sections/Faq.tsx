"use client";

import { useState } from "react";
import { faqItems } from "@/data/faq";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <GhostGlyph
        glyph={glyphs.faq.giantLetter}
        className="top-12 -left-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-rule pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
              <span className="text-sun font-bold">08 //</span>
              <span>QUESTIONS & ANSWERS</span>
              <span className="text-muted/40">✦</span>
              <span className="font-greek text-bone/60">{glyphs.faq.greekWord}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-bone font-light tracking-tight">
              Honest answers.
            </h2>
            <p className="font-mono text-xs text-muted tracking-dossier uppercase">
              AVAILABILITY, SYSTEM STACKS, AND COLLABORATION TERMS
            </p>
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto divide-y divide-rule border-t border-b border-rule">
          {faqItems.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="py-4">
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  data-cursor="CLICK"
                  className="w-full text-left py-3 flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-muted">0{idx + 1}</span>
                    <span className="font-display text-xl sm:text-2xl text-bone font-light group-hover:text-sun transition-colors">
                      {item.question}
                    </span>
                  </div>

                  <div className="w-6 h-6 border border-rule flex items-center justify-center font-mono text-sm text-bone group-hover:border-sun group-hover:text-sun shrink-0 transition-colors">
                    {isOpen ? "−" : "+"}
                  </div>
                </button>

                {/* Animated Dropdown Answer */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-out pl-8 sm:pl-12 pr-4",
                    isOpen ? "max-h-60 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
                  )}
                >
                  <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed max-w-2xl border-l-2 border-sun/60 pl-4 py-1">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
