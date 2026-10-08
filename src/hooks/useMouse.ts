"use client";

import { useEffect, useRef } from "react";

export function useMouse() {
  const mouseRef = useRef({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
    velocityX: 0,
    velocityY: 0,
  });

  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastPos.current.time);
      const vx = (e.clientX - lastPos.current.x) / dt;
      const vy = (e.clientY - lastPos.current.y) / dt;

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.normalizedX = e.clientX / window.innerWidth;
      mouseRef.current.normalizedY = e.clientY / window.innerHeight;
      mouseRef.current.velocityX = vx;
      mouseRef.current.velocityY = vy;

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouseRef;
}
