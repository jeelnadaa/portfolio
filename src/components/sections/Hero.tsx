"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { heroConfig } from "@/data/hero";
import { glyphs } from "@/data/glyphs";
import { HeroScene } from "@/components/three/HeroScene";
import { Embers } from "@/components/three/Embers";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { Countdown } from "@/components/ui/Countdown";
import { SpecRow } from "@/components/ui/SpecRow";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { countUp } from "@/lib/motion";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMedia";
import { isPreloadedSession } from "@/components/layout/Preloader";
import { cn } from "@/lib/utils";

const GREEK_FLIP_CHARS = ["Ω", "Φ", "Α", "Κ", "Ε", "Λ", "Ο", "Σ", "Ι", "Σ", "Χ", "Υ", "Σ", "Τ", "Ε", "Χ", "Ν", "Η"];

interface HeroProps {
  stats?: { repos: number; stars: number; projects: number; commits: number };
}

export function Hero({ stats = { repos: 18, stars: 42, projects: 6, commits: 348 } }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ruinsRef = useRef<HTMLDivElement>(null);
  const sunDiscRef = useRef<HTMLDivElement>(null);
  const statValRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const isFine = useIsFinePointer();
  const prefersReduced = usePrefersReducedMotion();

  const brandChars = siteConfig.brand.split("");

  useGsap(() => {
    if (!containerRef.current) return;

    // Stat count up
    statValRefs.current.forEach((el, idx) => {
      if (!el) return;
      const values = [stats.repos, stats.stars, stats.projects, stats.commits];
      const suffixes = ["", "★", "", "/yr"];
      countUp(el, values[idx] || 10, 1.8, suffixes[idx]);
    });

    if (prefersReduced) return;

    let isVanished = false;
    let flipTimers: NodeJS.Timeout[] = [];

    const clearFlipTimers = () => {
      flipTimers.forEach((t) => clearInterval(t));
      flipTimers = [];
    };

    // Entrance / Reform animation:
    // Fades in slowly, scrambling Greek letters (proportional size 0.74em) into Fraunces English glyphs
    const playFadeInWithGreek = () => {
      isVanished = false;
      clearFlipTimers();

      letterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const finalChar = brandChars[idx];
        let flipCount = 0;
        const totalFlips = 6;

        // Proportional Greek font size to prevent towering over lowercase Fraunces
        el.style.fontSize = "0.74em";
        el.style.fontFamily = "var(--font-didot)";
        el.textContent = GREEK_FLIP_CHARS[idx % GREEK_FLIP_CHARS.length];

        const flipInterval = setInterval(() => {
          flipCount++;
          if (flipCount >= totalFlips) {
            clearInterval(flipInterval);
            el.textContent = finalChar;
            el.style.fontFamily = "var(--font-fraunces)";
            el.style.fontSize = "";
          } else {
            el.textContent = GREEK_FLIP_CHARS[(idx + flipCount) % GREEK_FLIP_CHARS.length];
            el.style.fontFamily = "var(--font-didot)";
            el.style.fontSize = "0.74em";
          }
        }, 80 + idx * 8);
        flipTimers.push(flipInterval);

        gsap.to(el, {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          delay: idx * 0.035,
          ease: "power2.out",
        });
      });

      if (sunDiscRef.current) {
        gsap.to(sunDiscRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: "power2.out",
        });
      }
    };

    // Check if preloader is active or already completed in this session
    if (isPreloadedSession()) {
      playFadeInWithGreek();
    } else {
      // Keep hidden until sliced orange circle preloader finishes and fades
      letterRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, yPercent: 20 });
      });
      if (sunDiscRef.current) {
        gsap.set(sunDiscRef.current, { opacity: 0, scale: 0.8 });
      }

      let entranceTriggered = false;
      const onPreloaderDone = () => {
        if (entranceTriggered) return;
        entranceTriggered = true;
        playFadeInWithGreek();
      };

      window.addEventListener("solarquack:preloader-done", onPreloaderDone, { once: true });
      setTimeout(onPreloaderDone, 2400); // Safety fallback
    }

    // Vanish on scroll down:
    // Pure smooth fade out without converting to Greek letters, slow visible pace
    const triggerVanish = () => {
      if (isVanished) return;
      isVanished = true;
      clearFlipTimers();

      // Filter only mounted non-null letter elements to prevent null _gsap crashes
      const validLetters = letterRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));

      // Keep letters as English brand letters on fade out (no Greek letters)
      validLetters.forEach((el, idx) => {
        el.textContent = brandChars[idx] || "";
        el.style.fontFamily = "var(--font-fraunces)";
        el.style.fontSize = "";
      });

      if (validLetters.length > 0) {
        gsap.killTweensOf(validLetters);
        gsap.to(validLetters, {
          opacity: 0,
          yPercent: -8,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.01,
        });
      }

      if (sunDiscRef.current) {
        gsap.killTweensOf(sunDiscRef.current);
        gsap.to(sunDiscRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.28,
          ease: "power2.out",
        });
      }
    };

    // Scroll trigger: start fading immediately as soon as user scrolls down even 2px
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrollY > 2) {
        triggerVanish();
      } else if (scrollY <= 2) {
        if (isVanished) {
          playFadeInWithGreek();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Ruins parallax zoom
    if (ruinsRef.current) {
      gsap.to(ruinsRef.current, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      clearFlipTimers();
      const validLetters = letterRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
      gsap.killTweensOf(validLetters);
      if (sunDiscRef.current) gsap.killTweensOf(sunDiscRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stats, prefersReduced]);

  // Cursor proximity effect on variable font axes
  useEffect(() => {
    if (!isFine || prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - letterX, mouseY - letterY);
        const maxDist = 340;
        const proximity = Math.max(0, 1 - dist / maxDist);

        const wght = Math.round(300 + proximity * 600);
        const soft = Math.round(proximity * 100);
        const scaleY = 1 + proximity * 0.06;

        el.style.fontVariationSettings = `'wght' ${wght}, 'SOFT' ${soft}, 'opsz' 144, 'WONK' 1`;
        el.style.transform = `scaleY(${scaleY})`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFine, prefersReduced]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[720px] h-screen overflow-hidden bg-bg flex flex-col justify-between select-none"
    >
      {/* 4 Vertical 1px Grid Lines */}
      <div className="hero-grid-lines" aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
      </div>

      {/* Layer 1: Ruins background */}
      <div
        ref={ruinsRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-40 pointer-events-none will-change-transform"
      >
        <Image
          src="/art/ruins-columns.bone.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Layer 2: Soft Atmospheric Aura behind Hercules */}
      <div
        ref={sunDiscRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62vmin] h-[62vmin] rounded-full pointer-events-none z-10 will-change-[transform,opacity]"
        style={{
          background:
            "radial-gradient(circle, rgba(233, 227, 210, 0.08) 0%, rgba(233, 227, 210, 0.02) 42%, transparent 68%)",
          filter: "blur(12px)",
        }}
      />

      {/* Layer 3: Giant Name "solarquack" sitting behind statue */}
      <div
        aria-label={siteConfig.brand}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20 flex justify-center items-center pointer-events-none px-4"
      >
        <h1 className="font-display font-light text-bone tracking-tightest leading-none text-[clamp(4.2rem,16vw,19rem)] flex justify-between w-full max-w-7xl">
          {brandChars.map((char, idx) => (
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
        </h1>
      </div>

      {/* Layer 4: 3D Depth-Parallax Shader Hercules Statue */}
      <div className="absolute inset-0 z-30 pointer-events-auto">
        <HeroScene />
      </div>

      {/* Layer 5: Foreground Embers */}
      <Embers className="absolute inset-0 z-40 pointer-events-none" />

      {/* Layer 6: Soft Fog Gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/40 to-transparent z-40 pointer-events-none"
      />

      {/* Ghost Glyph Ω */}
      <GhostGlyph
        glyph={glyphs.hero.giantLetter}
        className="top-12 left-1/2 -translate-x-1/2 opacity-5"
      />

      {/* HUD Layer (Overlays on top of 3D Canvas) */}
      <div className="relative z-50 flex flex-col justify-between h-full p-6 sm:p-10 pointer-events-none pt-24 sm:pt-28">
        {/* HUD Top Bar */}
        <div className="flex items-start justify-between w-full max-w-7xl mx-auto">
          {/* Top Left Dossier Tag */}
          <div className="space-y-1 pointer-events-auto">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-dossier text-bone font-medium">
              <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
              <span>{siteConfig.systemLabel}</span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-dossier text-muted">
              {siteConfig.authorDossier}
            </div>
          </div>

          {/* Top Right Availability Countdown */}
          <div className="pointer-events-auto">
            <Countdown />
          </div>
        </div>

        {/* HUD Middle Lateral Columns */}
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto my-auto">
          {/* Left Column Spec Rows */}
          <div className="hidden md:flex flex-col w-64 p-4 border border-rule/60 bg-surface/40 backdrop-blur-xs pointer-events-auto space-y-0.5">
            <div className="font-mono text-[10px] uppercase tracking-dossier text-sun font-bold border-b border-rule pb-1.5 mb-1.5 flex items-center justify-between">
              <span>SYSTEM SPECS</span>
              <span>00 // BASE</span>
            </div>
            {heroConfig.dossierRows.map((row) => (
              <SpecRow key={row.key} label={row.key} value={row.value} />
            ))}
          </div>

          {/* Right Column Stat Counters */}
          <div className="hidden md:flex flex-col w-56 p-4 border border-rule/60 bg-surface/40 backdrop-blur-xs pointer-events-auto space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-dossier text-sun font-bold border-b border-rule pb-1.5 flex items-center justify-between">
              <span>LIVE TELEMETRY</span>
              <span>GITHUB</span>
            </div>
            {heroConfig.stats.map((st, idx) => (
              <div key={st.label} className="flex items-baseline justify-between font-mono text-xs tracking-dossier uppercase">
                <span className="text-muted">{st.label}</span>
                <span
                  ref={(el) => {
                    statValRefs.current[idx] = el;
                  }}
                  className="text-bone font-bold text-sm"
                >
                  {st.value}
                </span>
              </div>
            ))}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono tracking-dossier text-muted/70 hover:text-sun text-right block pt-1 border-t border-rule/30"
              data-cursor="OPEN"
            >
              Tracked live ↗
            </a>
          </div>
        </div>

        {/* HUD Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between w-full max-w-7xl mx-auto gap-6 pointer-events-auto pb-4">
          {/* Bottom Left Positioning & CTAs */}
          <div className="space-y-4 max-w-lg">
            <p className="font-mono text-xs sm:text-sm text-bone/90 leading-relaxed uppercase tracking-dossier">
              {siteConfig.heroPositioning}
            </p>
            <div className="flex items-center gap-4">
              <Magnetic strength={0.3}>
                <Button href="#work" variant="sun" arrow>
                  View work
                </Button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Button href={siteConfig.github} variant="outline" external arrow>
                  Source code
                </Button>
              </Magnetic>
              <span className="hidden sm:inline font-mono text-[11px] text-muted tracking-dossier">
                ★ {stats.stars} stars
              </span>
            </div>
          </div>

          {/* Bottom Right Scroll Cue */}
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted select-none">
            <span>SCROLL ΚΑΤΩ</span>
            <div className="relative w-[1px] h-10 bg-rule overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-3 bg-sun motion-safe:animate-pulse"
                style={{
                  boxShadow: "0 0 6px rgba(217, 119, 6, 0.6)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
