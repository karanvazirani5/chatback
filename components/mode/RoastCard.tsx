"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "./ShareableFrame";

export const RoastCard = forwardRef<HTMLDivElement, { roast: string }>(
  function RoastCard({ roast }, ref) {
    return (
      <ShareableFrame
        ref={ref}
        className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black"
      >
        <div className="h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-400/90">
            Roast my history
          </div>
          <div className="flex-1 flex items-center">
            <p className="font-serif text-2xl md:text-3xl text-zinc-50 leading-[1.18] tracking-tight">
              <span className="text-orange-400/80">&ldquo;</span>
              {roast}
              <span className="text-orange-400/80">&rdquo;</span>
            </p>
          </div>
        </div>
      </ShareableFrame>
    );
  }
);
