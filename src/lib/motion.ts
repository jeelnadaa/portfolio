import { gsap, Flip } from "./gsap";

export const EASES = {
  expoOut: "expo.out",
  expoInOut: "expo.inOut",
  power3Out: "power3.out",
  power2InOut: "power2.inOut",
  sineInOut: "sine.inOut",
} as const;

export const DURATIONS = {
  fast: 0.3,
  base: 0.7,
  slow: 1.2,
} as const;

const GREEK_CHARS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const LATIN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Scramble text effect: cycles randomly through Greek and Latin glyphs before resolving.
 */
export function scrambleText(
  element: HTMLElement,
  targetText: string,
  duration = 0.6,
  onComplete?: () => void
): gsap.core.Tween {
  const chars = GREEK_CHARS + LATIN_CHARS;
  const original = targetText;
  const len = original.length;
  const obj = { progress: 0 };

  return gsap.to(obj, {
    progress: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const revealed = Math.floor(obj.progress * len);
      let output = "";
      for (let i = 0; i < len; i++) {
        if (i < revealed) {
          output += original[i];
        } else if (original[i] === " ") {
          output += " ";
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = output;
    },
    onComplete: () => {
      element.textContent = original;
      if (onComplete) onComplete();
    },
  });
}

/**
 * Mask-up reveal helper
 */
export function maskUp(
  targets: gsap.DOMTarget,
  vars: gsap.TweenVars = {}
): gsap.core.Tween {
  return gsap.fromTo(
    targets,
    {
      yPercent: 100,
      opacity: 0,
      clipPath: "inset(0% 0% 100% 0%)",
    },
    {
      yPercent: 0,
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: DURATIONS.base,
      ease: EASES.expoOut,
      stagger: 0.08,
      ...vars,
    }
  );
}

/**
 * Draw SVG line helper
 */
export function drawLine(
  target: SVGPathElement | SVGLineElement,
  vars: gsap.TweenVars = {}
): gsap.core.Tween {
  const length =
    target instanceof SVGPathElement && target.getTotalLength
      ? target.getTotalLength()
      : 1000;

  return gsap.fromTo(
    target,
    {
      strokeDasharray: length,
      strokeDashoffset: length,
    },
    {
      strokeDashoffset: 0,
      duration: DURATIONS.slow,
      ease: EASES.expoOut,
      ...vars,
    }
  );
}

/**
 * Count-up helper for stats
 */
export function countUp(
  target: HTMLElement,
  endValue: number,
  duration = 1.6,
  suffix = ""
): gsap.core.Tween {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: endValue,
    duration,
    ease: EASES.power3Out,
    onUpdate: () => {
      target.textContent = Math.round(obj.val).toLocaleString() + suffix;
    },
  });
}

/**
 * Magnetic button / cursor helper
 */
export function magnetic(
  element: HTMLElement,
  strength = 0.3
): () => void {
  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  element.addEventListener("mousemove", onMouseMove);
  element.addEventListener("mouseleave", onMouseLeave);

  return () => {
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("mouseleave", onMouseLeave);
  };
}
