"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "./ShareableFrame";

export const FoundersScanCard = forwardRef<HTMLDivElement, { text: string }>(
  function FoundersScanCard({ text }, ref) {
    // Split archetype (first line) from diagnostic if present.
    const colonIdx = text.indexOf(":");
    const archetype =
      colonIdx > 0 ? text.slice(0, colonIdx).trim() : "Founder brain scan";
    const diagnostic = colonIdx > 0 ? text.slice(colonIdx + 1).trim() : text;

    return (
      <ShareableFrame
        ref={ref}
        className="bg-gradient-to-br from-cyan-950/40 via-zinc-950 to-zinc-950"
      >
        <div className="h-full w-full flex flex-col p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/90">
            Founder brain scan
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Archetype
            </p>
            <h2 className="mt-1 font-serif text-4xl md:text-5xl text-zinc-50 tracking-tight">
              {archetype}
            </h2>
            <p className="mt-4 font-serif text-lg md:text-xl text-zinc-300 leading-snug">
              {diagnostic}
            </p>
          </div>
        </div>
      </ShareableFrame>
    );
  }
);
