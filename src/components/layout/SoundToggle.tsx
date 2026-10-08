"use client";

import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { soundEnabled, toggleSound, hasAudioFiles } = useSound();

  if (!hasAudioFiles) return null;

  return (
    <button
      onClick={toggleSound}
      data-cursor={soundEnabled ? "MUTE" : "SOUND"}
      aria-label={soundEnabled ? "Mute audio" : "Enable sound"}
      className={cn(
        "sound-toggle-btn group relative flex items-center gap-1.5 font-mono text-[11px] tracking-dossier uppercase px-2.5 py-1 border border-rule transition-colors",
        soundEnabled
          ? "border-sun text-sun bg-sun/10"
          : "text-muted hover:border-bone/40 hover:text-bone",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current transition-all" />
      <span>{soundEnabled ? "SFX ON" : "SFX"}</span>
    </button>
  );
}
