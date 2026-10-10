"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string | null;
  title?: string;
  order?: number;
  glyph?: string;
  className?: string;
  autoPlay?: boolean;
  aspectRatio?: "16/9" | "16/10";
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function VideoPlayer({
  src,
  poster,
  title,
  order = 1,
  glyph = "Α",
  className,
  autoPlay = false,
  aspectRatio = "16/9",
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [transientAction, setTransientAction] = useState<"play" | "pause" | "mute" | "unmute" | null>(null);
  const transientTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scrubber hover state
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState<boolean>(false);

  const showTransient = (action: "play" | "pause" | "mute" | "unmute") => {
    setTransientAction(action);
    if (transientTimeoutRef.current) clearTimeout(transientTimeoutRef.current);
    transientTimeoutRef.current = setTimeout(() => {
      setTransientAction(null);
    }, 600);
  };

  // Schedule auto-hide of controls
  const resetControlsTimer = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        if (!isDraggingProgress) {
          setIsControlsVisible(false);
        }
      }, 2400);
    }
  }, [isPlaying, isDraggingProgress]);

  // Handle Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        showTransient("play");
        resetControlsTimer();
      }).catch((err) => {
        console.warn("Playback prevented:", err);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      showTransient("pause");
      setIsControlsVisible(true);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    }
  }, [resetControlsTimer]);

  // Handle Mute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      if (video.volume === 0) {
        video.volume = 0.8;
        setVolume(0.8);
      }
      showTransient("unmute");
    } else {
      video.muted = true;
      setIsMuted(true);
      showTransient("mute");
    }
    resetControlsTimer();
  }, [isMuted, resetControlsTimer]);

  // Handle volume slider change
  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    video.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    resetControlsTimer();
  }, [isMuted, resetControlsTimer]);

  // Seek video
  const seekRelative = useCallback((deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + deltaSeconds));
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Cycle playback speed
  const cyclePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
    resetControlsTimer();
  };

  // Scrubber drag & click
  const handleProgressMove = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      const track = progressTrackRef.current;
      const video = videoRef.current;
      if (!track || !video || !duration) return;

      const rect = track.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverPosition(pos);
      setHoverTime(pos * duration);

      if (isDraggingProgress) {
        video.currentTime = pos * duration;
        setCurrentTime(pos * duration);
      }
    },
    [duration, isDraggingProgress]
  );

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProgress(true);
    const track = progressTrackRef.current;
    const video = videoRef.current;
    if (track && video && duration) {
      const rect = track.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  useEffect(() => {
    if (!isDraggingProgress) return;

    const onMouseMove = (e: MouseEvent) => {
      handleProgressMove(e);
    };

    const onMouseUp = () => {
      setIsDraggingProgress(false);
      resetControlsTimer();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingProgress, handleProgressMove, resetControlsTimer]);

  // Sync fullscreen change event
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside an input or form
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      // Check if container is focused or active
      const isFocused =
        container.contains(document.activeElement) ||
        isHovered ||
        isFullscreen;

      if (!isFocused) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          e.stopPropagation();
          togglePlay();
          break;
        case "KeyM":
          e.preventDefault();
          e.stopPropagation();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          e.stopPropagation();
          toggleFullscreen();
          break;
        case "ArrowLeft":
          e.preventDefault();
          e.stopPropagation();
          seekRelative(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          seekRelative(5);
          break;
        case "KeyJ":
          e.preventDefault();
          e.stopPropagation();
          seekRelative(-10);
          break;
        case "KeyL":
          e.preventDefault();
          e.stopPropagation();
          seekRelative(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          handleVolumeChange(volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          handleVolumeChange(volume - 0.1);
          break;
        case "Home":
          e.preventDefault();
          e.stopPropagation();
          if (videoRef.current) videoRef.current.currentTime = 0;
          break;
        case "End":
          e.preventDefault();
          e.stopPropagation();
          if (videoRef.current && duration) videoRef.current.currentTime = duration;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isHovered,
    isFullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seekRelative,
    handleVolumeChange,
    volume,
    duration,
  ]);

  // Video event handlers
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    // Update buffered
    if (video.buffered.length > 0) {
      setBufferedEnd(video.buffered.end(video.buffered.length - 1));
    }
  };

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsMuted(video.muted);
    setVolume(video.volume);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setIsControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
  };

  // Clean pause on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
      }
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
      if (transientTimeoutRef.current) clearTimeout(transientTimeoutRef.current);
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      data-cursor={isPlaying ? "CLICK" : "PLAY"}
      onMouseEnter={() => {
        setIsHovered(true);
        resetControlsTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverTime(null);
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }}
      onMouseMove={resetControlsTimer}
      className={cn(
        "group/player relative w-full bg-surface overflow-hidden border border-rule outline-none focus-visible:ring-1 focus-visible:ring-sun/60 select-none",
        aspectRatio === "16/9" ? "aspect-[16/9]" : "aspect-[16/10]",
        className
      )}
    >
      {/* 1. Underlying HTML5 Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        playsInline
        preload="metadata"
        autoPlay={autoPlay}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer bg-bg"
      />

      {/* 2. Dossier Scanline & Grid Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_45%,var(--bone)_50%,transparent_55%)] bg-[length:12px_12px]"
        aria-hidden="true"
      />

      {/* 3. Top Telemetry Bar */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gradient-to-b from-bg/90 via-bg/60 to-transparent transition-opacity duration-300 pointer-events-none",
          isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-dossier text-muted">
          <span className="text-sun font-bold">{glyph}</span>
          <span>DOSSIER // 0{order}</span>
          {title && (
            <>
              <span className="text-muted/40 hidden sm:inline">✦</span>
              <span className="text-bone/80 hidden sm:inline truncate max-w-[240px]">
                {title}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-dossier">
          <div className="flex items-center gap-1.5 text-bone/70 border border-rule/60 bg-bg/70 px-2 py-0.5">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isPlaying ? "bg-sun animate-pulse" : "bg-muted"
              )}
            />
            <span>{isPlaying ? "FEED ACTIVE" : "PAUSED"}</span>
          </div>
          <span className="text-muted hidden md:inline">1080P // 60FPS</span>
        </div>
      </div>

      {/* 4. Center Play Button Overlay (when paused / not started) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          data-cursor="PLAY"
          className="absolute inset-0 z-15 flex flex-col items-center justify-center bg-bg/40 backdrop-blur-[2px] transition-all cursor-pointer group-hover/player:bg-bg/30"
        >
          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border border-bone/60 bg-surface/90 shadow-2xl transition-all duration-300 group-hover/player:scale-105 group-hover/player:border-sun group-hover/player:shadow-sun/20">
            {/* Viewfinder corner brackets */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-sun" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-sun" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-sun" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-sun" />

            {/* Play Triangle Icon */}
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-bone translate-x-0.5 group-hover/player:text-sun transition-colors fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div className="mt-4 text-center space-y-1">
            <div className="font-mono text-xs uppercase tracking-dossier text-bone group-hover/player:text-sun transition-colors font-semibold">
              {hasStarted ? "RESUME VIDEO DOSSIER" : "PLAY VIDEO DOSSIER"}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-dossier text-muted">
              [SPACE] OR CLICK TO INITIALIZE
            </div>
          </div>
        </div>
      )}

      {/* 5. Transient Center Feedback Badge (brief icon flash on user action) */}
      {transientAction && (
        <div className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-bone/40 bg-surface/80 backdrop-blur-md flex items-center justify-center animate-out fade-out zoom-out duration-500">
            {transientAction === "play" && (
              <svg className="w-7 h-7 text-sun fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {transientAction === "pause" && (
              <svg className="w-7 h-7 text-bone fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
            {transientAction === "mute" && (
              <svg className="w-7 h-7 text-bone fill-current" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            )}
            {transientAction === "unmute" && (
              <svg className="w-7 h-7 text-sun fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* 6. Bottom Controls Bar Overlay */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 z-20 px-4 sm:px-6 pb-3 pt-12 bg-gradient-to-t from-bg via-bg/85 to-transparent transition-opacity duration-300",
          isControlsVisible || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Timeline Scrubber */}
        <div
          ref={progressTrackRef}
          onMouseDown={handleProgressMouseDown}
          onMouseMove={handleProgressMove}
          onMouseLeave={() => setHoverTime(null)}
          data-cursor="SEEK"
          className="group/track relative w-full h-5 flex items-center cursor-pointer select-none mb-2"
        >
          {/* Background rail */}
          <div className="relative w-full h-1 bg-bone/20 group-hover/track:h-1.5 transition-all">
            {/* Buffered bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-bone/30 transition-all duration-200"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Played bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-sun transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Scrubber thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-bone border border-sun shadow-md opacity-0 group-hover/track:opacity-100 transition-opacity"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Time hover tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 font-mono text-[10px] tracking-dossier uppercase text-bone bg-surface border border-rule px-1.5 py-0.5 pointer-events-none shadow-md"
              style={{ left: `${hoverPosition * 100}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Buttons and Telemetry Row */}
        <div className="flex items-center justify-between gap-3 text-bone font-mono text-xs">
          {/* Left group: Play/Pause, Skip 5s, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              data-cursor="CLICK"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="w-8 h-8 flex items-center justify-center border border-rule hover:border-sun text-bone hover:text-sun transition-colors bg-surface/60"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip Backward 5s */}
            <button
              onClick={() => seekRelative(-5)}
              data-cursor="CLICK"
              title="Rewind 5s [←]"
              aria-label="Rewind 5 seconds"
              className="w-7 h-7 hidden xs:flex items-center justify-center border border-rule/60 hover:border-bone text-muted hover:text-bone transition-colors text-[11px]"
            >
              -5s
            </button>

            {/* Skip Forward 5s */}
            <button
              onClick={() => seekRelative(5)}
              data-cursor="CLICK"
              title="Forward 5s [→]"
              aria-label="Forward 5 seconds"
              className="w-7 h-7 hidden xs:flex items-center justify-center border border-rule/60 hover:border-bone text-muted hover:text-bone transition-colors text-[11px]"
            >
              +5s
            </button>

            {/* Sound Mute / Unmute & Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                data-cursor={isMuted ? "SOUND" : "MUTE"}
                aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
                className={cn(
                  "w-8 h-8 flex items-center justify-center border transition-colors",
                  isMuted
                    ? "border-rule text-muted hover:border-bone hover:text-bone"
                    : "border-sun/80 text-sun bg-sun/10"
                )}
              >
                {isMuted || volume === 0 ? (
                  /* Muted Icon */
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  /* Speaker Icon */
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Volume Slider (expands on hover) */}
              <div className="hidden sm:flex items-center w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume slider"
                  className="w-16 h-1 accent-sun cursor-pointer bg-bone/30"
                />
              </div>
            </div>

            {/* Time Readout: 00:12 // 00:24 */}
            <div className="font-mono text-[11px] sm:text-xs tracking-dossier text-muted pl-1">
              <span className="text-bone">{formatTime(currentTime)}</span>
              <span className="text-muted/50 mx-1.5">//</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right group: Speed multiplier, Fullscreen, Shortcuts hint */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed toggle: 1.0x */}
            <button
              onClick={cyclePlaybackRate}
              data-cursor="CLICK"
              title="Playback rate"
              aria-label={`Playback speed: ${playbackRate}x`}
              className="h-8 px-2 border border-rule hover:border-bone text-muted hover:text-bone text-[11px] transition-colors"
            >
              {playbackRate}×
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              data-cursor="CLICK"
              aria-label={isFullscreen ? "Exit fullscreen [F]" : "Enter fullscreen [F]"}
              title="Fullscreen [F]"
              className="w-8 h-8 flex items-center justify-center border border-rule hover:border-sun text-bone hover:text-sun transition-colors bg-surface/60"
            >
              {isFullscreen ? (
                /* Exit Fullscreen Icon */
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                /* Enter Fullscreen Icon */
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcut legend (subtle) */}
        <div className="hidden md:flex items-center justify-between text-[9px] font-mono tracking-dossier uppercase text-muted/60 pt-2 border-t border-rule/30 mt-2">
          <span>[SPACE] PLAY/PAUSE · [M] MUTE · [←/→] ±5S · [↑/↓] VOL · [F] FULLSCREEN</span>
          <span>SOLARQUACK // MEDIA ENGINE</span>
        </div>
      </div>
    </div>
  );
}
