"use client";

import { forwardRef, useEffect, useState } from "react";
import { ShareableFrame } from "../../ShareableFrame";

/**
 * Three-phase reveal:
 *   0–0.9s   "intro"   → only the AI WRAPPED label and "You are"
 *   0.9–2.4s "reveal"  → archetype scales in from blur, amber glow blooms
 *   2.4s+    "settled" → tap-to-continue cue appears, slow shimmer
 *
 * Replay-safe: re-mounts run the sequence again. Cheap CSS-only animations
 * so this stays smooth on phones.
 */
export const CoverSlide = forwardRef<HTMLDivElement, { archetype: string }>(
  function CoverSlide({ archetype }, ref) {
    const [phase, setPhase] = useState<"intro" | "reveal" | "settled">("intro");

    useEffect(() => {
      const t1 = setTimeout(() => setPhase("reveal"), 900);
      const t2 = setTimeout(() => setPhase("settled"), 2400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, []);

    return (
      <ShareableFrame
        ref={ref}
        className="bg-[#08080f]"
      >
        {/* Amber glow that blooms in on reveal */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-out pointer-events-none"
          style={{
            background:
              "radial-gradient(65% 60% at 50% 62%, rgba(244,185,66,0.22), transparent 72%)",
            opacity: phase === "intro" ? 0 : 1,
          }}
        />
        {/* Secondary cooler corner glow for depth */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1800ms] pointer-events-none"
          style={{
            background:
              "radial-gradient(50% 40% at 105% -5%, rgba(126,90,200,0.18), transparent 65%)",
            opacity: phase === "intro" ? 0 : 0.9,
          }}
        />

        <div className="relative h-full w-full flex flex-col items-center justify-center p-7 md:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-7 shimmer-text">
            ✺ AI Wrapped · Issue №01
          </p>

          <p
            className={`font-mono text-[10px] uppercase tracking-[0.32em] text-warm-muted mb-5 transition-opacity duration-500 ${
              phase === "intro" ? "opacity-100" : "opacity-50"
            }`}
          >
            You are
          </p>

          <h1
            className={`font-serif italic text-warm tracking-[-0.04em] leading-[0.85] text-center px-3 transition-all duration-[900ms] ease-out
              ${
                phase === "intro"
                  ? "opacity-0 scale-90 blur-md text-4xl md:text-5xl"
                  : "opacity-100 scale-100 blur-0 text-5xl md:text-6xl"
              }`}
            style={{
              textShadow:
                phase !== "intro"
                  ? "0 0 40px rgba(244,185,66,0.25)"
                  : undefined,
            }}
          >
            {archetype}
          </h1>

          <p
            className={`mt-12 font-mono text-[10px] uppercase tracking-[0.32em] text-primary transition-all duration-700 ${
              phase === "settled"
                ? "opacity-100 translate-y-0 animate-pulse"
                : "opacity-0 translate-y-1"
            }`}
          >
            tap to continue →
          </p>
        </div>
      </ShareableFrame>
    );
  }
);
