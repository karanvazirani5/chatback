"use client";

import { forwardRef, useEffect, useState } from "react";
import { ShareableFrame } from "../../ShareableFrame";
import {
  PERSONALITY_META,
  type WrappedFixedPersonality,
} from "@/lib/types";

interface ShapeSlideProps {
  personality: WrappedFixedPersonality;
  active?: boolean;
}

export const ShapeSlide = forwardRef<HTMLDivElement, ShapeSlideProps>(
  function ShapeSlide({ personality, active = true }, ref) {
    const [revealed, setRevealed] = useState(false);
    useEffect(() => {
      if (!active) {
        setRevealed(false);
        return;
      }
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }, [active]);

    return (
      <ShareableFrame ref={ref} className="bg-[#0a0a14]">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 100% 100%, rgba(244,185,66,0.20), transparent 60%)",
          }}
        />
        <div className="relative h-full w-full flex flex-col p-5 md:p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Your shape
          </div>
          <h2 className="mt-1 font-serif text-2xl md:text-3xl text-warm tracking-[-0.02em] leading-none">
            How you scored.
          </h2>

          <div className="mt-4 space-y-2.5">
            {PERSONALITY_META.map((m, i) => {
              const value = personality[m.key];
              return (
                <div key={m.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs md:text-sm text-warm truncate">
                      <span className="mr-1.5" aria-hidden>
                        {m.emoji}
                      </span>
                      {m.label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-primary shrink-0">
                      {value}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-warm/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-[#fcd34d] rounded-full transition-[width] ease-out"
                      style={{
                        width: revealed
                          ? `${Math.min(Math.max(value, 0), 100)}%`
                          : "0%",
                        transitionDuration: "800ms",
                        transitionDelay: `${i * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ShareableFrame>
    );
  }
);
