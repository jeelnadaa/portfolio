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
        "flex items-baseline font-mono text-[13px] tracking-dossier uppercase py-1",
        className
      )}
    >
      <span className="text-muted shrink-0">{label}</span>
      <span className="dossier-leader shrink" aria-hidden="true" />
      <span className={cn("text-bone font-medium text-right shrink-0", valueClassName)}>
        {value}
      </span>
    </div>
  );
}
