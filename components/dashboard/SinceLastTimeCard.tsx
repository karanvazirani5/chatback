"use client";

import { useEffect, useState } from "react";
import type { MasterAnalysis } from "@/lib/types";
import {
  getAnalysisHistory,
  type AnalysisSnapshot,
} from "@/lib/analysis-history";
import { computeDiff, type AnalysisDiff } from "@/lib/diff";
import { formatRelative } from "@/lib/user-actions";

interface SinceLastTimeCardProps {
  analysis: MasterAnalysis;
}

export function SinceLastTimeCard({ analysis }: SinceLastTimeCardProps) {
  const [previous, setPrevious] = useState<AnalysisSnapshot | null>(null);

  useEffect(() => {
    // The current analysis was just saved as the latest snapshot. The PRIOR
    // one (if any) is what we diff against.
    const history = getAnalysisHistory();
    if (history.length < 2) {
      setPrevious(null);
      return;
    }
    setPrevious(history[history.length - 2]);
  }, [analysis]);

  if (!previous) return null;

  const diff = computeDiff(analysis, previous.analysis);
  if (diff.totalChanges === 0) return null;

  return (
    <section className="relative rounded-2xl border border-primary/25 bg-[#0a0a14] overflow-hidden p-5 md:p-7">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 0% 0%, rgba(244,185,66,0.10), transparent 65%)",
        }}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Since last time
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
            {formatRelative(previous.importedAt)}
          </span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl tracking-[-0.02em] leading-[1.1] text-warm mb-5">
          {summarise(diff)}
        </h2>

        <ul className="space-y-3.5">
          <DiffGroup
            label="Loops you closed"
            tone="emerald"
            items={diff.closedOpenLoops.map((l) => l.question)}
          />
          <DiffGroup
            label="New questions you're circling"
            tone="amber"
            items={diff.newOpenLoops.map((l) => l.question)}
          />
          <DiffGroup
            label="Themes that emerged"
            tone="amber"
            items={diff.newThemes.map((t) => `${t.theme} (×${t.count})`)}
          />
          <DiffGroup
            label="Themes that quieted"
            tone="muted"
            items={diff.droppedThemes.map((t) => t.theme)}
          />
          <DiffGroup
            label="Projects that disappeared"
            tone="muted"
            items={diff.droppedUnfinished.map((u) => u.name)}
          />
          <DiffGroup
            label="New unfinished projects"
            tone="amber"
            items={diff.newUnfinished.map((u) => u.name)}
          />
          <DiffGroup
            label="Decisions you've landed on"
            tone="emerald"
            items={diff.newDecisions.map((d) => `${d.topic} → ${d.verdict}`)}
          />
        </ul>
      </div>
    </section>
  );
}

function DiffGroup({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "emerald" | "amber" | "muted";
  items: string[];
}) {
  if (items.length === 0) return null;
  const dotColor =
    tone === "emerald"
      ? "bg-emerald-400/80"
      : tone === "amber"
      ? "bg-primary"
      : "bg-zinc-500/60";
  return (
    <li>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted mb-1.5">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm md:text-base text-warm leading-snug"
          >
            <span
              className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`}
              aria-hidden
            />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

function summarise(diff: AnalysisDiff): string {
  const parts: string[] = [];
  if (diff.closedOpenLoops.length > 0) {
    parts.push(
      `${diff.closedOpenLoops.length} loop${
        diff.closedOpenLoops.length === 1 ? "" : "s"
      } closed`
    );
  }
  if (diff.newOpenLoops.length > 0) {
    parts.push(
      `${diff.newOpenLoops.length} new question${
        diff.newOpenLoops.length === 1 ? "" : "s"
      }`
    );
  }
  if (diff.newThemes.length > 0) {
    parts.push(
      `${diff.newThemes.length} theme${
        diff.newThemes.length === 1 ? "" : "s"
      } emerged`
    );
  }
  if (diff.newDecisions.length > 0) {
    parts.push(
      `${diff.newDecisions.length} decision${
        diff.newDecisions.length === 1 ? "" : "s"
      } made`
    );
  }
  if (parts.length === 0) return "Some small shifts in your archive.";
  if (parts.length === 1) return parts[0] + ".";
  if (parts.length === 2) return parts.join(" and ") + ".";
  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1] + ".";
}
