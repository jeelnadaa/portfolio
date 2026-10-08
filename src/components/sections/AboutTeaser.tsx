"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { BoneImage } from "@/components/ui/BoneImage";
import { Button } from "@/components/ui/Button";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

export function AboutTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const artWrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGsap(() => {
    if (prefersReduced || !containerRef.current) return;

    // Art clip-path wipe in on scroll
    if (artWrapperRef.current) {
      gsap.fromTo(
        artWrapperRef.current,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    }

    // Spark burst trigger at 60% in view
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparksFired = false;

    const triggerSparks = () => {
      if (sparksFired) return;
      sparksFired = true;

      const width = (canvas.width = canvas.offsetWidth);
      const height = (canvas.height = canvas.offsetHeight);

      // Anvil contact point roughly at center 48% x, 52% y
      const originX = width * 0.48;
      const originY = height * 0.52;

      const sparks = Array.from({ length: 45 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        return {
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 2 + 1,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
        };
      });

      let animId: number;

      const loop = () => {
        ctx.clearRect(0, 0, width, height);
        let alive = 0;

        for (const s of sparks) {
          if (s.life > 0) {
            alive++;
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.15; // gravity
            s.life -= s.decay;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229, 56, 27, ${Math.max(0, s.life)})`; // --sun
            ctx.fill();
          }
        }

        if (alive > 0) {
          animId = requestAnimationFrame(loop);
        }
      };

      animId = requestAnimationFrame(loop);
    };

    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          onEnter: triggerSparks,
        },
      }
    );
  }, [prefersReduced]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-bg overflow-hidden border-b border-rule"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Forge Art with Spark Canvas */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div
              ref={artWrapperRef}
              className="relative w-full max-w-[500px] aspect-[4/5] border border-rule bg-surface/60 overflow-hidden group select-none"
            >
              <BoneImage
                src="/art/forge-anvil.bone.png"
                hoverSrc="/art/forge-anvil.color.webp"
                alt="Classical blacksmith forge and anvil sculpture"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />

              {/* Spark Canvas */}
              <canvas
                ref={sparkCanvasRef}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />

              <div className="absolute bottom-3 left-3 bg-bg/80 border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-dossier text-bone/70">
                ΤΕΧΝΗ // FORGE
              </div>
            </div>
          </div>

          {/* Right: Plain 3 sentences + CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-dossier text-sun font-semibold">
                ANVIL & HAMMER // DISCIPLINE
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight">
                Forging software from first principles.
              </h2>
            </div>

            <div className="space-y-4 font-sans text-muted text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                I study computer science at PES University in Bengaluru. Most of my hours go into systems programming, testing algorithmic boundaries, and crafting bespoke interfaces.
              </p>
              <p>
                I prefer reading the specification directly over copying StackOverflow answers. When something crashes in production, I run the debugger and trace the memory leak until it is resolved.
              </p>
            </div>

            <div className="pt-4">
              <Button href="/about" variant="sun" arrow>
                More about me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
