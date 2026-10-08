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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const hasUnlockedRef = useRef(false);

  // Preload audio and initialize Web Audio API on mount
  React.useEffect(() => {
    try {
      // 1. Preload HTML5 Audio
      const audio = new Audio("/audio/sfx-slash.mp3");
      audio.preload = "auto";
      audio.volume = 0.85;
      audio.load();
      metalAudioRef.current = audio;

      // 2. Initialize AudioContext
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Fetch and decode MP3 into memory buffer for instant 0ms playback
        fetch("/audio/sfx-slash.mp3")
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current = decoded;
          })
          .catch(() => {});
      }
    } catch {}

    // Unlock AudioContext on first user interaction anywhere
    const unlock = () => {
      hasUnlockedRef.current = true;
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      if (metalAudioRef.current) {
        metalAudioRef.current.load();
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true, capture: true });
    window.addEventListener("keydown", unlock, { once: true, capture: true });
    window.addEventListener("touchstart", unlock, { once: true, capture: true });
    window.addEventListener("click", unlock, { once: true, capture: true });

    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
      window.removeEventListener("touchstart", unlock, { capture: true });
      window.removeEventListener("click", unlock, { capture: true });
    };
  }, []);

  // Synthesize sharp metallic blade slash via Web Audio oscillators & filtered noise
  const synthesizeMetalSlice = useCallback((ctx: AudioContext) => {
    try {
      const t = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 3.5;
      filter.frequency.setValueAtTime(4200, t);
      filter.frequency.exponentialRampToValueAtTime(750, t + 0.2);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseNode.start(t);

      // Metallic resonance chimes
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const metalGain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(2600, t);
      osc1.frequency.exponentialRampToValueAtTime(1400, t + 0.28);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(3800, t);
      osc2.frequency.exponentialRampToValueAtTime(2100, t + 0.28);

      metalGain.gain.setValueAtTime(0.35, t);
      metalGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc1.connect(metalGain);
      osc2.connect(metalGain);
      metalGain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.28);
      osc2.stop(t + 0.28);
    } catch {}
  }, []);

  // Exclusively for the opening metal slice animation
  const playMetalSlice = useCallback(() => {
    try {
      const ctx = audioCtxRef.current;
      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        // Play decoded buffer if ready
        if (audioBufferRef.current) {
          const src = ctx.createBufferSource();
          src.buffer = audioBufferRef.current;
          const gain = ctx.createGain();
          gain.gain.value = 0.9;
          src.connect(gain);
          gain.connect(ctx.destination);
          src.start(0);
        } else {
          // Play synthesized slash
          synthesizeMetalSlice(ctx);
        }
      }

      // Also trigger HTML5 Audio element
      if (metalAudioRef.current) {
        metalAudioRef.current.currentTime = 0;
        metalAudioRef.current.play().catch(() => {
          // If browser blocked autoplay, attempt to play on next user click
          const playOnNextClick = () => {
            if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
              audioCtxRef.current.resume().catch(() => {});
            }
            if (metalAudioRef.current) {
              metalAudioRef.current.play().catch(() => {});
            }
            window.removeEventListener("click", playOnNextClick);
          };
          window.addEventListener("click", playOnNextClick, { once: true });
        });
      }
    } catch {}
  }, [synthesizeMetalSlice]);

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
