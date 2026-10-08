"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { heroVertexShader, heroFragmentShader } from "./shaders/heroShaders";
import { BoneImage } from "@/components/ui/BoneImage";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

function ShaderMesh({
  mousePos,
}: {
  mousePos: React.MutableRefObject<{ x: number; y: number; lastMoved: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();

  // Load textures
  const [colorMap, depthMap, maskMap] = useTexture([
    "/art/hero-hercules.color.webp",
    "/art/hero-hercules.depth.png",
    "/art/hero-hercules.mask.png",
  ]);

  const lerpedMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lerpedTorch = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uColorMap: { value: colorMap },
      uDepthMap: { value: depthMap },
      uMaskMap: { value: maskMap },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTorch: { value: new THREE.Vector2(0.5, 0.5) },
      uTorchRadius: { value: 0.28 },
      uTorchStrength: { value: 1.0 },
      uScroll: { value: 0 },
      uSun: { value: new THREE.Vector3(0.898, 0.22, 0.106) }, // #E5381B
      uBone: { value: new THREE.Vector3(0.914, 0.890, 0.824) }, // #E9E3D2
      uDitherScale: { value: 2.0 },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [colorMap, depthMap, maskMap, size.width, size.height]
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.getElapsedTime();

    const now = Date.now();
    const isIdle = now - mousePos.current.lastMoved > 2500;

    let targetTorchX = mousePos.current.x;
    let targetTorchY = mousePos.current.y;

    if (isIdle) {
      // Slow Lissajous figure-8 curve drift when idle or on mobile
      const t = state.clock.getElapsedTime() * 0.4;
      targetTorchX = 0.5 + Math.sin(t) * 0.22;
      targetTorchY = 0.5 + Math.sin(t * 2.0) * 0.18;
    }

    // Lerp mouse displacement and torch UV coordinates
    lerpedMouse.current.x += (targetTorchX - lerpedMouse.current.x) * 0.06;
    lerpedMouse.current.y += (targetTorchY - lerpedMouse.current.y) * 0.06;

    lerpedTorch.current.x += (targetTorchX - lerpedTorch.current.x) * 0.08;
    lerpedTorch.current.y += (targetTorchY - lerpedTorch.current.y) * 0.08;

    material.uniforms.uMouse.value.copy(lerpedMouse.current);
    material.uniforms.uTorch.value.copy(lerpedTorch.current);
  });

  // Calculate plane aspect ratio to preserve statue proportions
  const imageAspect = 3388 / 5056; // 0.67
  const planeHeight = viewport.height * 0.92;
  const planeWidth = planeHeight * imageAspect;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight, 1, 1]} />
      <shaderMaterial
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HeroScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const prefersReduced = usePrefersReducedMotion();

  const mousePos = useRef({ x: 0.5, y: 0.5, lastMoved: Date.now() });

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const win = window as unknown as { requestIdleCallback?: (cb: () => void) => void };
    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(() => setMounted(true));
    } else {
      const timer = setTimeout(() => setMounted(true), 150);
      return () => clearTimeout(timer);
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight, // invert Y for UV coordinates
        lastMoved: Date.now(),
      };
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        mousePos.current = {
          x: touch.clientX / window.innerWidth,
          y: 1.0 - touch.clientY / window.innerHeight,
          lastMoved: Date.now(),
        };
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  // Static Fallback for reduced motion or no WebGL
  if (prefersReduced || !hasWebGL) {
    return (
      <div className={className || "relative w-full h-full flex items-center justify-center"}>
        <div className="relative w-full max-w-[540px] aspect-[3/4]">
          <BoneImage
            src="/art/hero-hercules.bone.png"
            hoverSrc="/art/hero-hercules.color.webp"
            alt="Marble Hercules sculpture"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className || "relative w-full h-full flex items-center justify-center"}
      data-cursor="torch"
    >
      {/* Instant Poster for LCP */}
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-[540px] aspect-[3/4]">
            <BoneImage
              src="/art/hero-hercules.bone.png"
              alt="Marble Hercules sculpture"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* 3D R3F Canvas */}
      {mounted && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom: 1 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full absolute inset-0 pointer-events-none"
        >
          <ShaderMesh mousePos={mousePos} />
        </Canvas>
      )}
    </div>
  );
}
