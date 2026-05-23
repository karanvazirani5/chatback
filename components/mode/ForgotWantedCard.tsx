"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "./ShareableFrame";

export const ForgotWantedCard = forwardRef<HTMLDivElement, { text: string }>(
  function ForgotWantedCard({ text }, ref) {
    return (
      <ShareableFrame
        ref={ref}
        className="bg-gradient-to-br from-emerald-950/60 via-zinc-950 to-zinc-950"
      >
        <div className="h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/90">
            What I forgot I wanted
          </div>
          <div className="flex-1 flex items-center">
            <p className="font-serif italic text-2xl md:text-3xl text-zinc-50 leading-snug tracking-tight">
              {text}
            </p>
          </div>
        </div>
      </ShareableFrame>
    );
  }
);
