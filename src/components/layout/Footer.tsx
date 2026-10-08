"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useLenis } from "@/lib/lenis";
import { useToast } from "@/components/ui/Toast";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

const EXPLORE_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#armory", label: "Armory" },
  { href: "/#path", label: "Path" },
  { href: "/about", label: "About" },
  { href: "/log", label: "Log" },
];

const ELSEWHERE_LINKS = [
  { href: siteConfig.github, label: "GitHub ↗", external: true },
  { href: siteConfig.linkedin, label: "LinkedIn ↗", external: true },
  { href: siteConfig.instagram, label: "Instagram ↗", external: true },
  { href: siteConfig.resumePdf, label: "Resume (PDF) ↓", download: true },
];

export function Footer() {
  const lenis = useLenis();
  const { showToast } = useToast();
  const isFine = useIsFinePointer();
  const prefersReduced = usePrefersReducedMotion();

  const brandRowRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Variable font proximity effect on giant solarquack
  useEffect(() => {
    if (!isFine || prefersReduced) return;
    const container = brandRowRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - letterCenterX, mouseY - letterCenterY);
        const maxDist = 320;
        const proximity = Math.max(0, 1 - dist / maxDist);

        const wght = Math.round(300 + proximity * 600); // 300 -> 900
        const soft = Math.round(proximity * 100);
        const scaleY = 1 + proximity * 0.06;

        el.style.fontVariationSettings = `'wght' ${wght}, 'SOFT' ${soft}, 'opsz' 144, 'WONK' 1`;
        el.style.transform = `scaleY(${scaleY})`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFine, prefersReduced]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} COPIED ✓`);
  };

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const brandLetters = siteConfig.brand.split("");

  return (
    <footer className="nav-footer relative bg-surface border-t border-rule mt-24 pt-16 pb-12 px-6 sm:px-12 select-none">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Tagline */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-rule/50 pb-8">
          <div>
            <p className="font-display italic text-2xl sm:text-3xl text-bone">
              &ldquo;{siteConfig.taglineDisplay}&rdquo;
            </p>
            <p className="font-greek text-xs tracking-widest text-sun uppercase mt-1">
              {siteConfig.taglineGreek}
            </p>
          </div>
          <div className="font-mono text-xs tracking-dossier text-muted uppercase">
            DOSSIER REF // 2026-SQ-PES
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 font-mono text-xs tracking-dossier">
          {/* Col 1: Explore */}
          <div className="space-y-4">
            <div className="text-muted text-[11px] uppercase border-b border-rule/40 pb-2">
              01 // EXPLORE
            </div>
            <ul className="space-y-2">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bone hover:text-sun transition-colors inline-block py-0.5"
                    data-cursor="VIEW"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Elsewhere */}
          <div className="space-y-4">
            <div className="text-muted text-[11px] uppercase border-b border-rule/40 pb-2">
              02 // ELSEWHERE
            </div>
            <ul className="space-y-2">
              {ELSEWHERE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    download={link.download ? siteConfig.resumeDownloadName : undefined}
                    className="text-bone hover:text-sun transition-colors inline-block py-0.5"
                    data-cursor="OPEN"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 & 4: Contact & Identity */}
          <div className="sm:col-span-2 space-y-4">
            <div className="text-muted text-[11px] uppercase border-b border-rule/40 pb-2">
              03 // TRANSMISSION
            </div>
            <div className="space-y-3">
              {/* Giant Email Row */}
              <button
                onClick={() => copyToClipboard(siteConfig.email, "EMAIL")}
                className="w-full text-left p-3 border border-rule hover:border-sun hover:bg-surface/80 transition-all flex items-center justify-between group"
                data-cursor="COPY"
              >
                <div>
                  <span className="text-[10px] text-muted block">EMAIL // PRIMARY</span>
                  <span className="font-mono text-sm sm:text-base text-bone group-hover:text-sun transition-colors">
                    {siteConfig.email}
                  </span>
                </div>
                <span className="text-xs text-muted group-hover:text-sun font-bold">
                  COPY ↗
                </span>
              </button>

              {/* Phone Row */}
              <button
                onClick={() => copyToClipboard(siteConfig.phone, "PHONE")}
                className="w-full text-left p-3 border border-rule hover:border-sun hover:bg-surface/80 transition-all flex items-center justify-between group"
                data-cursor="COPY"
              >
                <div>
                  <span className="text-[10px] text-muted block">PHONE // CELL</span>
                  <span className="font-mono text-sm text-bone group-hover:text-sun transition-colors">
                    {siteConfig.phone}
                  </span>
                </div>
                <span className="text-xs text-muted group-hover:text-sun font-bold">
                  COPY ↗
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Giant full-width brand name "solarquack" */}
        <div
          ref={brandRowRef}
          aria-label={siteConfig.brand}
          className="border-t border-b border-rule/60 py-6 text-center select-none overflow-hidden"
        >
          <div className="flex justify-between items-center text-bone font-display tracking-tightest leading-none text-[clamp(2.8rem,14vw,14rem)]">
            {brandLetters.map((char, idx) => (
              <span
                key={idx}
                ref={(el) => {
                  letterRefs.current[idx] = el;
                }}
                className="inline-block transition-transform duration-75 will-change-transform"
                style={{
                  fontVariationSettings:
                    "'wght' 300, 'SOFT' 100, 'opsz' 144, 'WONK' 1",
                }}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row: credits and back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] tracking-dossier text-muted pt-2">
          <div>
            © 2026 {siteConfig.brand} · {siteConfig.legalName}. Artwork dithered from classical marble.
          </div>
          <div className="flex items-center gap-6">
            <span>UPDATED OCT 2026</span>
            <button
              onClick={scrollToTop}
              className="text-bone hover:text-sun transition-colors flex items-center gap-1 font-semibold"
              data-cursor="CLICK"
            >
              <span>BACK TO TOP</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
