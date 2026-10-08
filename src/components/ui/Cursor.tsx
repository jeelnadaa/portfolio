"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMedia";

export function Cursor() {
  const isFine = useIsFinePointer();
  const prefersReduced = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

  const [cursorState, setCursorState] = useState<{
    isText?: boolean;
    isTorch?: boolean;
    isHover?: boolean;
  }>({});

  const mousePos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!isFine || prefersReduced) return;

    // Hide default cursor across page, except form controls
    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Snappy, ultra-responsive quickTo for reticle ring (0.04s duration for instantaneous tracking)
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.04, ease: "power2.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.04, ease: "power2.out" });

    // Slow 20s continuous rotation for ring ticks
    const ringRotation = gsap.to(ring, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Instant dot placement
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      // Immediate responsive ring tracking
      xToRing(e.clientX);
      yToRing(e.clientY);

      // Detect cursor state from target element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      const isInput = target.closest("input, textarea, select, [contenteditable='true']");

      if (isInput) {
        setCursorState({ isText: true });
      } else if (cursorTarget) {
        const val = cursorTarget.getAttribute("data-cursor");
        if (val === "torch") {
          setCursorState({ isTorch: true });
        } else {
          setCursorState({ isHover: true });
        }
      } else if (target.closest("a, button, [role='button']")) {
        setCursorState({ isHover: true });
      } else {
        setCursorState({});
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      // Sun ring pulse
      if (pulseRef.current) {
        gsap.killTweensOf(pulseRef.current);
        gsap.fromTo(
          pulseRef.current,
          {
            x: e.clientX,
            y: e.clientY,
            scale: 0.2,
            opacity: 0.9,
          },
          {
            scale: 1.8,
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
          }
        );
      }

      // 1-frame slash line segment
      if (slashRef.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        gsap.killTweensOf(slashRef.current);
        gsap.fromTo(
          slashRef.current,
          {
            x: e.clientX,
            y: e.clientY,
            rotation: angle,
            scaleX: 0,
            opacity: 1,
          },
          {
            scaleX: 1,
            opacity: 0,
            duration: 0.2,
            ease: "expo.out",
          }
        );
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onClick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      ringRotation.kill();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onClick);
    };
  }, [isFine, prefersReduced]);

  if (!isFine || prefersReduced) return null;

  return (
    <>
      <style jsx global>{`
        .custom-cursor-active {
          cursor: none !important;
        }
        .custom-cursor-active input,
        .custom-cursor-active textarea,
        .custom-cursor-active select {
          cursor: auto !important;
        }
      `}</style>

      {/* 8px Bone Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-bone mix-blend-difference"
      />

      {/* 44px Reticle Ring with 4 tick marks */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference flex items-center justify-center transition-[width,height,background-color,border-color] duration-150 ease-out"
        style={{
          width: cursorState.isHover ? 54 : cursorState.isText ? 2 : 44,
          height: cursorState.isHover ? 54 : cursorState.isText ? 22 : 44,
          borderRadius: cursorState.isText ? 0 : "50%",
          border: cursorState.isText
            ? "none"
            : cursorState.isHover
              ? "1.5px solid var(--sun)"
              : "1px solid rgba(233, 227, 210, 0.4)",
          backgroundColor: cursorState.isText
            ? "var(--bone)"
            : cursorState.isHover
              ? "rgba(217, 119, 6, 0.08)"
              : "transparent",
        }}
      >
        {/* Reticle Tick marks (when not hovered and not text) */}
        {!cursorState.isHover && !cursorState.isText && (
          <>
            <span className="absolute -top-1 w-[1px] h-2 bg-bone opacity-70" />
            <span className="absolute -bottom-1 w-[1px] h-2 bg-bone opacity-70" />
            <span className="absolute -left-1 h-[1px] w-2 bg-bone opacity-70" />
            <span className="absolute -right-1 h-[1px] w-2 bg-bone opacity-70" />
          </>
        )}
      </div>

      {/* Click Sun Pulse Ring */}
      <div
        ref={pulseRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999997] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-sun opacity-0"
      />

      {/* Click Slash Line Segment */}
      <div
        ref={slashRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999997] -translate-x-1/2 -translate-y-1/2 w-8 h-[1.5px] bg-sun opacity-0 origin-center"
      />
    </>
  );
}
