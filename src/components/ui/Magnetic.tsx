"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { magnetic } from "@/lib/motion";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMedia";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.25,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFinePointer = useIsFinePointer();
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current || !isFinePointer || prefersReduced) return;
    const cleanup = magnetic(ref.current, strength);
    return cleanup;
  }, [strength, isFinePointer, prefersReduced]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
