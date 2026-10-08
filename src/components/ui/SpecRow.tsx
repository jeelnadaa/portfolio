"use client";

import { cn } from "@/lib/utils";

interface SpecRowProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function SpecRow({
  label,
  value,
  className,
  valueClassName,
}: SpecRowProps) {
  return (
    <div
      className={cn(
        "flex items-baseline font-mono text-xs sm:text-sm tracking-dossier uppercase py-1.5 min-w-0",
        className
      )}
    >
      <span className="text-muted shrink-0 font-medium">{label}</span>
      <span className="dossier-leader shrink min-w-[0.75rem]" aria-hidden="true" />
      <span
        className={cn(
          "text-bone font-medium text-right shrink min-w-0 break-words leading-relaxed",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  );
}
