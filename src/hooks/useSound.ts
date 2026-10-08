"use client";

import React, { createContext, useContext, useCallback, useRef } from "react";

interface SoundContextType {
  playMetalSlice: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSlash: () => void;
  playMarble: () => void;
  hasAudioFiles: boolean;
}

const SoundContext = createContext<SoundContextType>({
  playMetalSlice: () => {},
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
  const metalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Exclusively for the opening metal slice animation
  const playMetalSlice = useCallback(() => {
    try {
      if (!metalAudioRef.current) {
        metalAudioRef.current = new Audio("/audio/sfx-slash.mp3");
        metalAudioRef.current.volume = 0.65;
      }
      metalAudioRef.current.currentTime = 0;
      metalAudioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  // All other SFX removed as requested
  const playSlash = useCallback(() => {}, []);
  const playMarble = useCallback(() => {}, []);
  const toggleSound = useCallback(() => {}, []);

  return React.createElement(
    SoundContext.Provider,
    {
      value: {
        playMetalSlice,
        soundEnabled: false,
        toggleSound,
        playSlash,
        playMarble,
        hasAudioFiles: false,
      },
    },
    children
  );
}
