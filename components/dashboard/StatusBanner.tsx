"use client";

import { formatRelative, useUserActions } from "@/lib/user-actions";

export function StatusBanner() {
  const actions = useUserActions();

  const counts: Record<string, number> = {
    kill: 0,
    revive: 0,
    ship_small: 0,
  };
  let lastAction = 0;
  for (const a of Object.values(actions.unfinished)) {
    counts[a.choice] = (counts[a.choice] ?? 0) + 1;
    if (a.chosenAt > lastAction) lastAction = a.chosenAt;
  }
  for (const a of Object.values(actions.thisWeek)) {
    if (a.doneAt > lastAction) lastAction = a.doneAt;
  }
  const resolvedCount = Object.keys(actions.resolvedLoops).length;
  for (const a of Object.values(actions.resolvedLoops)) {
    if (a.resolvedAt > lastAction) lastAction = a.resolvedAt;
  }

  const totalUnfinished = counts.kill + counts.revive + counts.ship_small;
  const totalActions = totalUnfinished + resolvedCount;
  if (totalActions === 0) return null;

  const parts: string[] = [];
  if (counts.kill > 0) parts.push(`killed ${counts.kill}`);
  if (counts.revive > 0) parts.push(`reviving ${counts.revive}`);
  if (counts.ship_small > 0) parts.push(`shipping ${counts.ship_small}`);
  if (resolvedCount > 0)
    parts.push(`${resolvedCount} loop${resolvedCount === 1 ? "" : "s"} resolved`);

  return (
    <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/[0.05] px-5 py-4 flex items-baseline justify-between gap-3">
      <p className="font-serif italic text-base text-warm">
        You&apos;ve <span className="text-primary">{parts.join(" · ")}</span>.
      </p>
      {lastAction > 0 && (
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70 shrink-0">
          last · {formatRelative(lastAction)}
        </span>
      )}
    </div>
  );
}
