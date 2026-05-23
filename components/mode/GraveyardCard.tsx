"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "./ShareableFrame";
import type { GraveyardEntry } from "@/lib/types";

const VERDICT_META: Record<
  GraveyardEntry["verdict"],
  { emoji: string; label: string; color: string }
> = {
  dead: { emoji: "💀", label: "Dead", color: "text-zinc-500" },
  distraction: { emoji: "👻", label: "Distraction", color: "text-amber-300" },
  revive: { emoji: "⚡", label: "Revive", color: "text-emerald-300" },
};

export const GraveyardCard = forwardRef<
  HTMLDivElement,
  { entries: GraveyardEntry[] }
>(function GraveyardCard({ entries }, ref) {
  return (
    <ShareableFrame
      ref={ref}
      className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
    >
      <div className="h-full w-full flex flex-col p-7 md:p-9">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          Chat graveyard
        </div>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl text-zinc-50 tracking-tight">
          Here lies what you stopped asking about.
        </h2>
        <ul className="flex-1 flex flex-col justify-center gap-3 mt-4">
          {entries.map((e) => {
            const meta = VERDICT_META[e.verdict];
            return (
              <li
                key={e.idea}
                className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-b-0"
              >
                <span className="text-xl" aria-hidden>
                  {meta.emoji}
                </span>
                <span className="flex-1 font-serif text-lg text-zinc-100">
                  {e.idea}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${meta.color}`}
                >
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ShareableFrame>
  );
});
