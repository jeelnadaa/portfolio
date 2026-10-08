"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { siteConfig } from "@/data/site";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/components/ui/Toast";

interface CommandItemEntry {
  id: string;
  label: string;
  shortcut?: string;
  category: "Navigation" | "Projects" | "Transmission" | "Controls";
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toggleSound, soundEnabled } = useSound();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K or / (when not typing in an input)
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target as HTMLElement)?.matches("input, textarea"))) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const items: CommandItemEntry[] = [
    // Navigation
    { id: "nav-home", label: "Navigate: Dossier Home (/) ", category: "Navigation", action: () => { router.push("/"); setOpen(false); } },
    { id: "nav-work", label: "Navigate: Work Showroom (/work)", category: "Navigation", action: () => { router.push("/work"); setOpen(false); } },
    { id: "nav-about", label: "Navigate: About Dossier (/about)", category: "Navigation", action: () => { router.push("/about"); setOpen(false); } },
    { id: "nav-resume", label: "Navigate: Résumé Dossier (/resume)", category: "Navigation", action: () => { router.push("/resume"); setOpen(false); } },
    { id: "nav-contact", label: "Navigate: Transmission (/contact)", category: "Navigation", action: () => { router.push("/contact"); setOpen(false); } },
    { id: "nav-log", label: "Navigate: Changelog (/log)", category: "Navigation", action: () => { router.push("/log"); setOpen(false); } },

    // Projects
    { id: "proj-alpha", label: "Project: Alpha (Broker Architecture)", category: "Projects", action: () => { router.push("/work/project-alpha"); setOpen(false); } },
    { id: "proj-beta", label: "Project: Beta (Quantized Neural Engine)", category: "Projects", action: () => { router.push("/work/project-beta"); setOpen(false); } },
    { id: "proj-gamma", label: "Project: Gamma (Bayer WebGL Canvas)", category: "Projects", action: () => { router.push("/work/project-gamma"); setOpen(false); } },
    { id: "proj-delta", label: "Project: Delta (Database Sentinel)", category: "Projects", action: () => { router.push("/work/project-delta"); setOpen(false); } },

    // Transmission
    {
      id: "copy-email",
      label: `Copy Email (${siteConfig.email})`,
      category: "Transmission",
      action: () => {
        navigator.clipboard.writeText(siteConfig.email);
        showToast("EMAIL COPIED ✓");
        setOpen(false);
      },
    },
    {
      id: "copy-phone",
      label: `Copy Phone (${siteConfig.phone})`,
      category: "Transmission",
      action: () => {
        navigator.clipboard.writeText(siteConfig.phone);
        showToast("PHONE COPIED ✓");
        setOpen(false);
      },
    },
    {
      id: "download-resume",
      label: "Download Résumé (PDF)",
      category: "Transmission",
      action: () => {
        window.open(siteConfig.resumePdf, "_blank");
        setOpen(false);
      },
    },
    {
      id: "open-github",
      label: "Open GitHub Profile ↗",
      category: "Transmission",
      action: () => {
        window.open(siteConfig.github, "_blank");
        setOpen(false);
      },
    },
    {
      id: "open-linkedin",
      label: `Open LinkedIn (${siteConfig.linkedinLabel}) ↗`,
      category: "Transmission",
      action: () => {
        window.open(siteConfig.linkedin, "_blank");
        setOpen(false);
      },
    },

    // Controls
    {
      id: "toggle-theme",
      label: "Toggle Theme: Dark ⇄ Bone",
      category: "Controls",
      action: () => {
        const cur = document.documentElement.getAttribute("data-theme") || "dark";
        const next = cur === "dark" ? "bone" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        showToast(`THEME: ${next.toUpperCase()}`);
        setOpen(false);
      },
    },
    {
      id: "toggle-sound",
      label: `Toggle Sound (${soundEnabled ? "Mute" : "Enable"})`,
      category: "Controls",
      action: () => {
        toggleSound();
        showToast(`SFX: ${!soundEnabled ? "ON" : "OFF"}`);
        setOpen(false);
      },
    },
    {
      id: "add-project-docs",
      label: "Add Project CLI Guide (pnpm add-project)",
      category: "Controls",
      action: () => {
        router.push("/#armory");
        showToast("CLI: pnpm add-project");
        setOpen(false);
      },
    },
  ];

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="command-palette-backdrop fixed inset-0 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-150"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl border border-bone/40 bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 z-10">
        <Command className="w-full">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-rule px-4 py-2 font-mono text-[10px] tracking-dossier uppercase text-muted bg-bg/40">
            <span>{siteConfig.brand} // COMMAND PALETTE</span>
            <span>ESC ✕</span>
          </div>

          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-rule">
            <span className="font-mono text-sun text-sm mr-2">&gt;</span>
            <Command.Input
              autoFocus
              placeholder="Type a command or jump to page..."
              className="w-full bg-transparent py-3.5 font-mono text-xs uppercase tracking-dossier text-bone placeholder:text-muted focus:outline-none"
            />
          </div>

          {/* List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 font-mono text-xs uppercase tracking-dossier divide-y divide-rule/20">
            <Command.Empty className="py-6 text-center text-muted text-xs">
              NO MATCHING COMMANDS FOUND //
            </Command.Empty>

            {(["Navigation", "Projects", "Transmission", "Controls"] as const).map(
              (category) => (
                <Command.Group
                  key={category}
                  heading={category}
                  className="py-1 text-[10px] text-muted tracking-widest px-2"
                >
                  {items
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <Command.Item
                        key={item.id}
                        onSelect={item.action}
                        className="flex items-center justify-between px-3 py-2 text-bone/90 hover:bg-bone hover:text-bg cursor-pointer transition-colors"
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] opacity-60">ENTER ↵</span>
                      </Command.Item>
                    ))}
                </Command.Group>
              )
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
