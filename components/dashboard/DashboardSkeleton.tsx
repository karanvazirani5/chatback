"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Typewriter } from "@/components/Typewriter";
import { ModePickerRow } from "./ModePickerRow";

const SECTIONS = [
  { label: "What you've been thinking about", rows: 5 },
  { label: "Open loops", rows: 4 },
  { label: "What you've already decided", rows: 3 },
  { label: "Do this week", rows: 2 },
  { label: "Your unfinished list", rows: 4 },
];

const PHASES = [
  "Reading your archive…",
  "Pulling out the themes you keep circling…",
  "Watching for the questions you can't stop asking…",
  "Naming the patterns you'd never name yourself…",
  "Almost there. Just sharpening the verdicts…",
];

interface DashboardSkeletonProps {
  elapsedSeconds?: number;
}

export function DashboardSkeleton({ elapsedSeconds }: DashboardSkeletonProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, 5_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 flex items-center justify-between gap-3 fade-up">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Building your archive
          </p>
          <p className="mt-1.5 font-serif italic text-base text-warm leading-snug min-h-[1.5em]">
            <Typewriter key={phase} text={PHASES[phase]} />
          </p>
        </div>
        <span className="font-mono text-xs tabular-nums text-primary/80 shrink-0">
          {elapsedSeconds !== undefined ? `${elapsedSeconds}s` : "…"}
        </span>
      </div>

      {SECTIONS.map((s, i) => (
        <section
          key={s.label}
          className="rounded-2xl border border-warm bg-surface/60 p-7 md:p-9 fade-up"
          style={{ ["--i" as never]: i + 1 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-5">
            ✺ {s.label}
          </p>
          <div className="space-y-3">
            {Array.from({ length: s.rows }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-surface-2" />
                <Skeleton className="h-3 w-full bg-surface-2/70" />
              </div>
            ))}
          </div>
        </section>
      ))}

      <ModePickerRow />
    </div>
  );
}
