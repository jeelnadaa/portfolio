"use client";

import { useEffect, useRef, useState } from "react";
import { scrambleText } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

interface ScrambleProps {
  text: string;
  duration?: number;
  className?: string;
  trigger?: boolean;
}

export function Scramble({
  text,
  duration = 0.6,
  className,
  trigger = true,
}: ScrambleProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [hasScrambled, setHasScrambled] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!spanRef.current || hasScrambled || !trigger) return;
    if (prefersReduced) {
      spanRef.current.textContent = text;
      return;
    }

    setHasScrambled(true);
    scrambleText(spanRef.current, text, duration);
  }, [text, duration, trigger, hasScrambled, prefersReduced]);

  return (
    <span ref={spanRef} className={className}>
      {text}
    </span>
  );
}
