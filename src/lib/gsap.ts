"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

// Register plugins once in client context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, Draggable);
}

export { gsap, ScrollTrigger, Flip, Draggable };
