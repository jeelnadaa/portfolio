"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { glyphs } from "@/data/glyphs";

export function PageTransition() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReduced = usePrefersReducedMotion();

  const overlayRef = useRef<HTMLDivElement>(null);
  const glyphTextRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeGlyph, setActiveGlyph] = useState("ΦΑΚΕΛΟΣ");
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // Reset scroll on genuine route change
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  useEffect(() => {
    if (prefersReduced) return;

    const overlay = overlayRef.current;
    const glyphText = glyphTextRef.current;
    if (!overlay || !glyphText) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, email, telephone, pdf, new tabs
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.endsWith(".pdf") ||
        target.target === "_blank"
      ) {
        return;
      }

      // CRITICAL: Ignore any hash navigation (e.g. #armory, /#armory, /#path, etc.)
      if (href.startsWith("#") || href.startsWith("/#") || href.includes("#")) {
        return;
      }

      // Same route check
      if (href === pathname) return;

      // Find appropriate Greek glyph
      let nextGreek = "ΦΑΚΕΛΟΣ";
      if (href.startsWith("/work")) nextGreek = glyphs.work.greekWord;
      else if (href.startsWith("/about")) nextGreek = glyphs.about.greekWord;
      else if (href.startsWith("/resume")) nextGreek = glyphs.resume.greekWord;
      else if (href.startsWith("/contact")) nextGreek = glyphs.contact.greekWord;
      else if (href.startsWith("/log")) nextGreek = glyphs.log.greekWord;
      else if (href.startsWith("/path")) nextGreek = glyphs.path.greekWord;

      setActiveGlyph(nextGreek);
      isTransitioningRef.current = true;

      // Butter-smooth GPU accelerated entrance
      gsap.killTweensOf([overlay, glyphText]);
      gsap.set(overlay, { display: "flex", opacity: 0, scale: 0.96 });
      gsap.set(glyphText, { opacity: 0, y: 20 });

      gsap.to(overlay, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      gsap.to(glyphText, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: 0.08,
      });

      // FAIL-SAFE: Never allow screen to remain locked if route navigation stalls
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        dismissTransition();
      }, 1200);
    };

    window.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("click", handleAnchorClick, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, prefersReduced]);

  const dismissTransition = () => {
    const overlay = overlayRef.current;
    const glyphText = glyphTextRef.current;
    if (!overlay || !glyphText) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    gsap.killTweensOf([overlay, glyphText]);
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.set(overlay, { display: "none" });
      },
    });

    tl.to(glyphText, { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" });
    tl.to(overlay, { opacity: 0, scale: 1.04, duration: 0.3, ease: "power2.inOut" }, "-=0.08");
  };

  // When pathname changes and overlay was active, dismiss smoothly
  useEffect(() => {
    if (!isTransitioningRef.current || prefersReduced) return;
    dismissTransition();
  }, [pathname, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[99990] hidden items-center justify-center bg-sun select-none pointer-events-none will-change-[transform,opacity]"
    >
      <div
        ref={glyphTextRef}
        className="font-greek font-bold text-bone text-5xl sm:text-7xl md:text-9xl tracking-widest text-center will-change-[transform,opacity]"
      >
        {activeGlyph}
      </div>
    </div>
  );
}
