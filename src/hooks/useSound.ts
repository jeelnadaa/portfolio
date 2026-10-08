"use client";

import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSlash: () => void;
  playMarble: () => void;
  hasAudioFiles: boolean;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: false,
  toggleSound: () => {},
  playSlash: () => {},
  playMarble: () => {},
  hasAudioFiles: false,
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasAudioFiles, setHasAudioFiles] = useState(false);

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const slashAudioRef = useRef<HTMLAudioElement | null>(null);
  const marbleAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastMarbleTime = useRef(0);

  // Check if audio files exist
  useEffect(() => {
    async function checkAudio() {
      try {
        const res = await fetch("/audio/sfx-slash.mp3", { method: "HEAD" });
        if (res.ok) {
          setHasAudioFiles(true);
        }
      } catch {
        setHasAudioFiles(false);
      }
    }
    checkAudio();
  }, []);

  // Initialize audio elements if enabled
  useEffect(() => {
    if (!hasAudioFiles) return;

    if (!slashAudioRef.current) {
      slashAudioRef.current = new Audio("/audio/sfx-slash.mp3");
      slashAudioRef.current.volume = 0.3;
    }
    if (!marbleAudioRef.current) {
      marbleAudioRef.current = new Audio("/audio/sfx-marble.mp3");
      marbleAudioRef.current.volume = 0.2;
    }
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio("/audio/ambient-wind.mp3");
      ambientAudioRef.current.volume = 0.15;
      ambientAudioRef.current.loop = true;
    }

    if (soundEnabled) {
      ambientAudioRef.current.play().catch(() => {});
    } else {
      ambientAudioRef.current.pause();
    }

    return () => {
      ambientAudioRef.current?.pause();
    };
  }, [soundEnabled, hasAudioFiles]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const playSlash = useCallback(() => {
    if (!soundEnabled || !hasAudioFiles) return;
    try {
      if (slashAudioRef.current) {
        slashAudioRef.current.currentTime = 0;
        slashAudioRef.current.play().catch(() => {});
      }
    } catch {}
  }, [soundEnabled, hasAudioFiles]);

  const playMarble = useCallback(() => {
    if (!soundEnabled || !hasAudioFiles) return;
    const now = Date.now();
    if (now - lastMarbleTime.current < 400) return; // throttle 400ms
    lastMarbleTime.current = now;
    try {
      if (marbleAudioRef.current) {
        marbleAudioRef.current.currentTime = 0;
        marbleAudioRef.current.play().catch(() => {});
      }
    } catch {}
  }, [soundEnabled, hasAudioFiles]);

  return React.createElement(
    SoundContext.Provider,
    {
      value: {
        soundEnabled,
        toggleSound,
        playSlash,
        playMarble,
        hasAudioFiles,
      },
    },
    children
  );
}

