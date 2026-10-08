"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { TextRoll } from "@/components/ui/TextRoll";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useBengaluruTime } from "@/hooks/useTime";
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
];

export function Nav({ githubStats = { stars: 42, repos: 18 } }: NavProps) {
  const pathname = usePathname();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBoneTheme, setIsBoneTheme] = useState(false);

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

  // Theme detection from DOM
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsBoneTheme(currentTheme === "bone");
  }, []);

  // Theme toggle with circular clip-path wipe
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isBoneTheme ? "dark" : "bone";
    const x = e.clientX;
    const y = e.clientY;

    if (!document.startViewTransition) {
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      setIsBoneTheme(!isBoneTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      setIsBoneTheme(!isBoneTheme);
    });

    transition.ready.then(() => {
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

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
          {/* Left: Logo sq monogram + solarquack */}
          <Link
            href="/"
            className="flex items-center gap-2 group select-none"
            data-cursor="OPEN"
          >
            <div className="w-7 h-7 rounded-full border border-bone flex items-center justify-center font-display font-bold text-xs text-bone group-hover:border-sun group-hover:text-sun transition-colors relative">
              <span>sq</span>
              <span className="w-1 h-1 rounded-full bg-sun absolute -top-0.5 -right-0.5" />
            </div>
            <span className="font-mono text-xs font-semibold tracking-dossier uppercase text-bone group-hover:text-sun transition-colors">
              {siteConfig.brand}
            </span>
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-dossier text-bone/90">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "/#armory" && pathname === "/") {
                    e.preventDefault();
                    const el = document.getElementById("armory");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Bengaluru Time */}
            <span
              className="hidden lg:inline-block font-mono text-[11px] tracking-dossier text-muted border border-rule px-2 py-1"
              title="Current time in Bengaluru (IST)"
            >
              {blrTime}
            </span>

            {/* GitHub Stars Chip */}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] tracking-dossier text-muted hover:text-bone border border-rule px-2.5 py-1 transition-colors"
              title="GitHub Profile"
              data-cursor="OPEN"
            >
              <span className="text-sun">★</span>
              <span>{githubStats.stars}</span>
              <span className="text-muted/60">/</span>
              <span>{githubStats.repos}</span>
            </a>

            {/* Sound Toggle */}
            <SoundToggle />

            {/* Resume Button */}
            <a
              href={siteConfig.resumePdf}
              download={siteConfig.resumeDownloadName}
              className="hidden sm:inline-flex items-center font-mono text-[11px] tracking-dossier uppercase text-bone hover:text-bg hover:bg-bone border border-bone px-3 py-1 transition-colors select-none"
              data-cursor="OPEN"
            >
              Resume ↓
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/bone theme"
              data-cursor="CLICK"
              className="w-7 h-7 flex items-center justify-center border border-rule text-bone/80 hover:text-sun hover:border-sun transition-colors font-mono text-xs"
              title={isBoneTheme ? "Switch to Dark Mode" : "Switch to Bone Mode"}
            >
              {isBoneTheme ? "☾" : "☼"}
            </button>

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
