"use client";

import { useLayoutEffect, useEffect, useRef, type DependencyList } from "react";
import { gsap } from "@/lib/gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsap(
  callback: (context: gsap.Context) => void,
  dependencies: DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>
) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      savedCallback.current(self);
    }, scope?.current || undefined);

    return () => {
      ctx.revert();
    };
  }, dependencies);
}
