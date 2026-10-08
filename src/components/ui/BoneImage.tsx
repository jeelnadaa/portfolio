"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AssetPlaceholder } from "./AssetPlaceholder";

interface BoneImageProps {
  src: string;
  hoverSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
}

export function BoneImage({
  src,
  hoverSrc,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className,
  containerClassName,
}: BoneImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (hasError) {
    const filename = src.split("/").pop() || "asset";
    return <AssetPlaceholder name={filename} className={containerClassName} />;
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden select-none",
        fill && "w-full h-full",
        containerClassName
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      data-cursor="VIEW"
    >
      {/* Rest: Bone-dithered image */}
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        sizes={sizes || (fill ? "100vw" : undefined)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-all duration-500 ease-out",
          hoverSrc && isHovered ? "opacity-0" : "opacity-65",
          className
        )}
      />

      {/* Hover: Color/greyscale continuous-tone cross-fade */}
      {hoverSrc && (
        <Image
          src={hoverSrc}
          alt={`${alt} detailed view`}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          priority={false}
          sizes={sizes || (fill ? "100vw" : undefined)}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </div>
  );
}
