"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "./ShareableFrame";

export const FutureLetterCard = forwardRef<HTMLDivElement, { letter: string }>(
  function FutureLetterCard({ letter }, ref) {
    return (
      <ShareableFrame
        ref={ref}
        className="bg-gradient-to-br from-amber-950/40 via-zinc-950 to-zinc-950"
      >
        <div className="h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-200/90">
            Future me letter
          </div>
          <p className="mt-2 font-mono text-xs text-amber-100/60">
            From you, six months from now —
          </p>
          <div className="flex-1 flex items-center">
            <p className="font-serif italic text-xl md:text-2xl text-zinc-50 leading-snug">
              {letter}
            </p>
          </div>
          <p className="mt-2 text-right font-serif text-base text-amber-200/80">
            — you, later.
          </p>
        </div>
      </ShareableFrame>
    );
  }
);
