"use client";

import { cn } from "@/lib/utils";

interface TextRollProps {
  children: string;
  greekNumeral?: string;
  className?: string;
}

export function TextRoll({
  children,
  greekNumeral,
  className,
}: TextRollProps) {
  return (
    <span className={cn("group relative inline-flex flex-col items-center overflow-hidden", className)}>
      {greekNumeral && (
        <span
          className="absolute -top-3 font-greek text-[8px] text-sun opacity-0 transition-all duration-200 group-hover:top-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          {greekNumeral}
        </span>
      )}
      <span className="relative inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-full inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-sun"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1px] w-full bg-sun scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </span>
  );
}
