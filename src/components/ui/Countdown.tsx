"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface CountdownProps {
  className?: string;
}

export function Countdown({ className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  } | null>(null);

  useEffect(() => {
    if (!siteConfig.availableFrom) return;

    const target = new Date(siteConfig.availableFrom).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!siteConfig.availableFrom || !timeLeft) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-dossier px-3 py-1.5 border border-rule bg-surface/50",
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
        <span className="text-bone">{siteConfig.openStatus}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-dossier",
        className
      )}
    >
      <span className="text-muted text-[11px]">AVAILABLE IN</span>
      <div className="flex items-center gap-1">
        <span className="px-1.5 py-0.5 border border-rule text-bone">
          {timeLeft.days}D
        </span>
        <span className="px-1.5 py-0.5 border border-rule text-bone">
          {timeLeft.hours}H
        </span>
        <span className="px-1.5 py-0.5 border border-rule text-bone">
          {timeLeft.minutes}M
        </span>
        <span className="px-1.5 py-0.5 border border-sun text-sun font-bold">
          {timeLeft.seconds}S
        </span>
      </div>
    </div>
  );
}
