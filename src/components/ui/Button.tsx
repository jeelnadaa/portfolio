"use client";

import { forwardRef, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "outline" | "sun" | "ghost";
  arrow?: boolean;
  external?: boolean;
  download?: string | boolean;
  cursorLabel?: string;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      href,
      variant = "outline",
      arrow = false,
      external = false,
      download,
      cursorLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "group relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-dossier px-5 py-3 select-none transition-all duration-200",
      variant === "outline" && "border border-bone text-bone btn-dossier",
      variant === "sun" && "btn-dossier-sun border border-sun",
      variant === "ghost" && "text-muted hover:text-bone hover:border-b hover:border-bone",
      className
    );

    const content = (
      <>
        <span>{children}</span>
        {arrow && (
          <span
            className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            ↗
          </span>
        )}
      </>
    );

    const cursorData = cursorLabel
      ? { "data-cursor": cursorLabel }
      : { "data-cursor": arrow ? "OPEN" : "CLICK" };

    if (href) {
      if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.endsWith(".pdf")) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            download={typeof download === "string" ? download : undefined}
            className={baseClasses}
            target={external || href.startsWith("http") ? "_blank" : undefined}
            rel={external || href.startsWith("http") ? "noopener noreferrer" : undefined}
            {...cursorData}
            onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          {...cursorData}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClasses}
        onClick={onClick}
        {...cursorData}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
