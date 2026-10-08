"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { glyphs } from "@/data/glyphs";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "/work", label: "Work", greek: glyphs.work.greekWord, numeral: "Α" },
  { href: "/#armory", label: "Armory", greek: glyphs.skills.greekWord, numeral: "Β" },
  { href: "/path", label: "Path", greek: glyphs.path.greekWord, numeral: "Γ" },
  { href: "/about", label: "About", greek: glyphs.about.greekWord, numeral: "Δ" },
  { href: "/log", label: "Log", greek: glyphs.log.greekWord, numeral: "Ε" },
  { href: "/contact", label: "Contact", greek: glyphs.contact.greekWord, numeral: "Ζ" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-[99900] bg-bg flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div className="font-mono text-xs uppercase tracking-dossier text-bone flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
          <span>{siteConfig.brand} // MENU</span>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-xs uppercase tracking-dossier text-muted hover:text-bone border border-rule px-3 py-1 flex items-center gap-2"
          data-cursor="CLICK"
        >
          <span>ESC</span>
          <span className="text-sun">✕</span>
        </button>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col gap-4 my-auto">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              onClose();
              if (link.href === "/#armory") {
                try {
                  sessionStorage.setItem("scroll_to_armory", "true");
                } catch {}
                if (typeof window !== "undefined" && window.location.pathname === "/") {
                  const el = document.getElementById("armory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            className="group flex items-baseline justify-between py-2 border-b border-rule/30 text-bone hover:text-sun transition-colors"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted font-normal">
                {link.numeral}
              </span>
              <span className="font-display text-4xl sm:text-5xl font-light tracking-tight group-hover:translate-x-2 transition-transform duration-200">
                {link.label}
              </span>
            </div>
            <span className="font-greek text-sm text-muted/60 tracking-widest uppercase">
              {link.greek}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom Footer Info */}
      <div className="border-t border-rule pt-6 flex flex-col gap-3 font-mono text-xs tracking-dossier text-muted">
        <div className="flex items-center justify-between">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bone"
          >
            GITHUB ↗
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bone"
          >
            LINKEDIN ↗
          </a>
          <a
            href={siteConfig.resumePdf}
            download={siteConfig.resumeDownloadName}
            className="hover:text-sun"
          >
            RESUME PDF ↓
          </a>
        </div>
        <div className="text-[11px] text-muted/70 text-center">
          {siteConfig.email}
        </div>
      </div>
    </div>
  );
}
