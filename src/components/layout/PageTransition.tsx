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

  const [activeGlyph, setActiveGlyph] = useState("ΦΑΚΕΛΟΣ");
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // Reset scroll on route change
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
      // Check if internal navigation link
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.endsWith(".pdf") || target.target === "_blank") {
        return;
      }

      // Check current route
      if (href === pathname) return;

      // Find appropriate Greek glyph
      let nextGreek = "ΦΑΚΕΛΟΣ";
      if (href.startsWith("/work")) nextGreek = glyphs.work.greekWord;
      else if (href.startsWith("/about")) nextGreek = glyphs.about.greekWord;
      else if (href.startsWith("/resume")) nextGreek = glyphs.resume.greekWord;
      else if (href.startsWith("/contact")) nextGreek = glyphs.contact.greekWord;
      else if (href.startsWith("/log")) nextGreek = glyphs.log.greekWord;

      setActiveGlyph(nextGreek);

      const clickX = e.clientX || window.innerWidth / 2;
      const clickY = e.clientY || window.innerHeight / 2;

      isTransitioningRef.current = true;

      // Expand sun-red circle from click position
      gsap.killTweensOf([overlay, glyphText]);
      gsap.fromTo(
        overlay,
        {
          clipPath: `circle(0% at ${clickX}px ${clickY}px)`,
          opacity: 1,
          display: "flex",
        },
        {
          clipPath: `circle(150% at ${clickX}px ${clickY}px)`,
          duration: 0.7,
          ease: "expo.inOut",
        }
      );

      gsap.fromTo(
        glyphText,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out", delay: 0.2 }
      );
    };

    window.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname, prefersReduced]);

  // When pathname changes and overlay was active, contract toward center
  useEffect(() => {
    if (!isTransitioningRef.current || prefersReduced) return;

    const overlay = overlayRef.current;
    const glyphText = glyphTextRef.current;
    if (!overlay || !glyphText) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.set(overlay, { display: "none" });
      },
    });

    tl.to(glyphText, { opacity: 0, scale: 1.1, duration: 0.25, ease: "power2.in" });
    tl.to(
      overlay,
      {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.6,
        ease: "expo.inOut",
      },
      "-=0.1"
    );
  }, [pathname, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[99990] hidden items-center justify-center bg-sun select-none pointer-events-none"
    >
      <div
        ref={glyphTextRef}
        className="font-greek font-bold text-bone text-5xl sm:text-7xl md:text-9xl tracking-widest text-center"
      >
        {activeGlyph}
      </div>
    </div>
  );
}
