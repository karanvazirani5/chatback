"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "../../ShareableFrame";

export const ClosingSlide = forwardRef<HTMLDivElement, { tagline: string }>(
  function ClosingSlide({ tagline }, ref) {
    return (
      <ShareableFrame ref={ref} className="bg-[#08080f]">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 110%, rgba(244,185,66,0.18), transparent 70%)",
          }}
        />
        <div className="relative h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Your year, in one sentence
          </div>

          <div className="flex-1 flex items-center">
            <p className="font-serif italic text-3xl md:text-4xl text-warm leading-[1.15] tracking-[-0.02em]">
              <span className="text-primary">&ldquo;</span>
              {tagline}
              <span className="text-primary">&rdquo;</span>
            </p>
          </div>

          <p className="text-right font-serif italic text-sm md:text-base text-primary/80">
            — your AI history
          </p>
        </div>
      </ShareableFrame>
    );
  }
);
