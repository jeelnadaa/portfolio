"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { TextRoll } from "@/components/ui/TextRoll";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useBengaluruTime } from "@/hooks/useTime";
import { useSound } from "@/hooks/useSound";
import { useLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

interface NavProps {
  githubStats?: { stars: number; repos: number };
}

const NAV_ITEMS = [
  { href: "/work", label: "Work", numeral: "Α" },
  { href: "/#armory", label: "Armory", numeral: "Β" },
  { href: "/path", label: "Path", numeral: "Γ" },
  { href: "/about", label: "About", numeral: "Δ" },
  { href: "/log", label: "Log", numeral: "Ε" },
  { href: "/resume", label: "Resume", numeral: "Ϛ" },
  { href: "/contact", label: "Contact", numeral: "Ζ" },
];

export function Nav({ githubStats = { stars: 42, repos: 18 } }: NavProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const { playBubble } = useSound();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const blrTime = useBengaluruTime();

  // Instant scroll detection: 0ms lag tracking for top orange indicator
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentY / docHeight) * 100 : 0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }

      if (currentY > 60) {
        setScrolledPast(true);
        if (currentY > lastScrollY.current && currentY - lastScrollY.current > 10) {
          setNavVisible(false); // scrolling down
        } else if (lastScrollY.current - currentY > 5) {
          setNavVisible(true); // scrolling up
        }
      } else {
        setScrolledPast(false);
        setNavVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 2px Sun-red scroll progress bar along top: instant zero-lag GPU scaleX */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-sun z-[99950] origin-left pointer-events-none will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <header
        className={cn(
          "nav-header fixed top-0 left-0 right-0 z-[99900] transition-all duration-300 px-4 sm:px-8 py-3.5",
          navVisible ? "translate-y-0" : "-translate-y-full",
          scrolledPast
            ? "bg-bg/90 backdrop-blur-md border-b border-rule shadow-sm"
            : "bg-transparent border-b border-rule/30"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo GitHub PFP avatar + solarquack */}
          <Link
            href="/"
            onClick={() => {
              if (pathname !== "/") playBubble();
            }}
            className="flex items-center gap-2.5 group select-none"
            data-cursor="OPEN"
          >
            <div className="w-7 h-7 rounded-full border border-bone/60 overflow-hidden flex items-center justify-center relative group-hover:border-sun transition-colors">
              <Image
                src="/avatar.jpg"
                alt={siteConfig.brand}
                width={28}
                height={28}
                className="w-full h-full object-cover"
                priority
              />
              <span className="w-1.5 h-1.5 rounded-full bg-sun absolute -top-0.5 -right-0.5 ring-1 ring-bg" />
            </div>
            <span className="font-mono text-xs font-semibold tracking-dossier uppercase text-bone group-hover:text-sun transition-colors">
              {siteConfig.brand}
            </span>
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 font-mono text-xs sm:text-sm uppercase tracking-dossier text-bone/90 font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  playBubble();
                  if (item.href === "/#armory") {
                    try {
                      sessionStorage.setItem("scroll_to_armory", "true");
                    } catch {}
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("armory");
                      if (el) {
                        if (lenis) {
                          lenis.scrollTo(el, { offset: -40, duration: 1.2 });
                        } else {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }
                  }
                }}
                className="py-1"
                data-cursor="VIEW"
              >
                <TextRoll greekNumeral={item.numeral}>{item.label}</TextRoll>
              </Link>
            ))}
          </nav>

          {/* Right: Info chips & actions */}
          <div className="flex items-center gap-3">
            {/* Live Bengaluru Time */}
            <span
              className="hidden xl:inline-block font-mono text-xs tracking-dossier text-muted border border-rule px-2.5 py-1"
              title="Current time in Bengaluru (IST)"
            >
              {blrTime}
            </span>

            {/* GitHub Stars Chip */}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-mono text-xs sm:text-sm tracking-dossier text-muted hover:text-bone border border-rule px-2.5 py-1 transition-colors font-medium"
              title="GitHub Profile"
              data-cursor="OPEN"
            >
              <span className="text-sun">★</span>
              <span>{githubStats.stars}</span>
              <span className="text-muted/60">/</span>
              <span>{githubStats.repos}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden font-mono text-xs uppercase tracking-dossier border border-rule px-2.5 py-1 text-bone"
              data-cursor="OPEN"
              aria-label="Open navigation menu"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
