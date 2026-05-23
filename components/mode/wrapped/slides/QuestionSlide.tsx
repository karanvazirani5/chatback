"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "../../ShareableFrame";
import type { OpenLoop } from "@/lib/types";

export const QuestionSlide = forwardRef<HTMLDivElement, { loop: OpenLoop }>(
  function QuestionSlide({ loop }, ref) {
    return (
      <ShareableFrame ref={ref} className="bg-[#0a0a14]">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 60% at 50% -10%, rgba(126,90,200,0.20), transparent 65%)",
          }}
        />
        <div className="relative h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ The question you can&apos;t stop asking
          </div>

          <div className="flex-1 flex items-center">
            <h2 className="font-serif italic text-2xl md:text-3xl text-warm leading-[1.15] tracking-tight">
              <span className="text-primary">&ldquo;</span>
              {loop.question}
              <span className="text-primary">&rdquo;</span>
            </h2>
          </div>

          <div className="flex items-baseline justify-between gap-3 pt-3 border-t border-warm">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
                Asked
              </p>
              <p className="font-serif italic text-2xl text-primary tabular-nums leading-none mt-1">
                ×{loop.times_asked}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
                First asked
              </p>
              <p className="font-mono text-sm text-warm tabular-nums leading-none mt-1.5">
                {loop.first_seen}
              </p>
            </div>
          </div>
        </div>
      </ShareableFrame>
    );
  }
);
