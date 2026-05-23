"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "../../ShareableFrame";
import type { Theme } from "@/lib/types";

export const TopObsessionSlide = forwardRef<HTMLDivElement, { theme: Theme }>(
  function TopObsessionSlide({ theme }, ref) {
    return (
      <ShareableFrame ref={ref} className="bg-[#0a0a14]">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 50% at -5% 100%, rgba(244,185,66,0.16), transparent 60%)",
          }}
        />
        <div className="relative h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Your top obsession
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl text-warm tracking-[-0.02em] leading-[1.05]">
              {theme.theme}
            </h2>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif italic text-5xl md:text-6xl text-primary tabular-nums leading-none">
                ×{theme.count}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
                times this year
              </span>
            </div>
          </div>

          <p className="text-sm md:text-base text-warm-muted leading-snug italic">
            {theme.description}
          </p>
        </div>
      </ShareableFrame>
    );
  }
);
