"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { useSound } from "@/hooks/useSound";
import { glyphs } from "@/data/glyphs";

export function PageTransition() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReduced = usePrefersReducedMotion();
  const { playBubble } = useSound();

  const overlayRef = useRef<HTMLDivElement>(null);
  const glyphTextRef = useRef<HTMLDivElement>(null);

  const [activeGlyph, setActiveGlyph] = useState("ΦΑΚΕΛΟΣ");
  const isTransitioningRef = useRef(false);

  // Preserve hash scrolling (e.g. #armory) across route changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.location.hash === "#armory" ||
        sessionStorage.getItem("scroll_to_armory") === "true"
      ) {
        return;
      }
    }
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

      // Ignore in-page hash navigation (e.g. #armory, /#armory, /#path)
      if (href.startsWith("#") || href.startsWith("/#") || href.includes("#")) {
        return;
      }

      // Same route check
      if (href === pathname) return;

      // Trigger navigation bubble sound
      playBubble();

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

      const clickX = e.clientX || window.innerWidth / 2;
      const clickY = e.clientY || window.innerHeight / 2;

      // Self-orchestrating circular expand & contract timeline:
      // Plays with identical luxury on every click whether route is cold or cached.
      gsap.killTweensOf([overlay, glyphText]);
      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
          gsap.set(overlay, { display: "none" });
        },
      });

      tl.set(overlay, {
        display: "flex",
        opacity: 1,
        clipPath: `circle(0% at ${clickX}px ${clickY}px)`,
      })
      .set(glyphText, {
        opacity: 0,
        scale: 0.84,
      })
      .to(overlay, {
        clipPath: `circle(150% at ${clickX}px ${clickY}px)`,
        duration: 0.54,
        ease: "power3.inOut",
      })
      .to(
        glyphText,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.34"
      )
      // Brief elegant plateau while page changes in background
      .to({}, { duration: 0.14 })
      // Smooth reveal contraction to center
      .to(glyphText, {
        opacity: 0,
        scale: 1.08,
        duration: 0.22,
        ease: "power2.in",
      })
      .to(
        overlay,
        {
          clipPath: "circle(0% at 50% 50%)",
          duration: 0.52,
          ease: "power3.inOut",
        },
        "-=0.1"
      );
    };

    window.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname, prefersReduced, playBubble]);

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
