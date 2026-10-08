"use client";

import { useEffect, useState } from "react";

export function useMedia(query: string, defaultState = false) {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (mounted) setState(mql.matches);
    };

    setState(mql.matches);
    mql.addEventListener("change", onChange);

    return () => {
      mounted = false;
      mql.removeEventListener("change", onChange);
    };
  }, [query]);

  return state;
}

export function useIsFinePointer() {
  return useMedia("(pointer: fine)", true);
}

export function usePrefersReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)", false);
}
