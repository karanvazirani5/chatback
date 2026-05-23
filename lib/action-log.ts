import type { UserActions } from "./user-actions";

export type ActivityType =
  | "kill"
  | "revive"
  | "ship_small"
  | "this_week_done"
  | "loop_resolved"
  | "next_move_done"
  | "next_move_skipped";

export interface Activity {
  type: ActivityType;
  /** The item that was acted on (project name, loop question, etc.). */
  itemName: string;
  /** Unix ms. */
  at: number;
  /** Single emoji for the activity (used as the leading glyph). */
  emoji: string;
  /** Past-tense verb, shown next to the item name. */
  verb: string;
}

const VERB_BY_TYPE: Record<ActivityType, { emoji: string; verb: string }> = {
  kill: { emoji: "💀", verb: "Killed" },
  revive: { emoji: "⚡", verb: "Reviving" },
  ship_small: { emoji: "🚀", verb: "Shipping" },
  this_week_done: { emoji: "✓", verb: "Did this week's" },
  loop_resolved: { emoji: "↻", verb: "Resolved loop" },
  next_move_done: { emoji: "📨", verb: "Sent" },
  next_move_skipped: { emoji: "✗", verb: "Skipped" },
};

export function buildActivityLog(actions: UserActions): Activity[] {
  const items: Activity[] = [];

  for (const [name, a] of Object.entries(actions.unfinished)) {
    const meta = VERB_BY_TYPE[a.choice];
    items.push({
      type: a.choice,
      itemName: name,
      at: a.chosenAt,
      emoji: meta.emoji,
      verb: meta.verb,
    });
  }
  for (const [recommendation, a] of Object.entries(actions.thisWeek)) {
    const meta = VERB_BY_TYPE.this_week_done;
    items.push({
      type: "this_week_done",
      itemName: recommendation,
      at: a.doneAt,
      emoji: meta.emoji,
      verb: meta.verb,
    });
  }
  for (const [question, a] of Object.entries(actions.resolvedLoops)) {
    const meta = VERB_BY_TYPE.loop_resolved;
    items.push({
      type: "loop_resolved",
      itemName: question,
      at: a.resolvedAt,
      emoji: meta.emoji,
      verb: meta.verb,
    });
  }
  for (const [sourceName, a] of Object.entries(actions.nextMoves)) {
    const type: ActivityType =
      a.outcome === "done" ? "next_move_done" : "next_move_skipped";
    const meta = VERB_BY_TYPE[type];
    items.push({
      type,
      itemName: sourceName,
      at: a.at,
      emoji: meta.emoji,
      verb: meta.verb,
    });
  }

  // Newest first.
  items.sort((a, b) => b.at - a.at);
  return items;
}

/** Group activities by their day. Returns `[{ label, items }]` newest-first
 *  where label is "Today", "Yesterday", or an absolute date like "Mar 14". */
export function groupActivitiesByDay(items: Activity[]): {
  label: string;
  items: Activity[];
}[] {
  const groups = new Map<string, Activity[]>();
  for (const item of items) {
    const key = dayKey(item.at);
    const list = groups.get(key);
    if (list) list.push(item);
    else groups.set(key, [item]);
  }
  return Array.from(groups.entries()).map(([key, list]) => ({
    label: humanDay(key),
    items: list,
  }));
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function humanDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";

  const sameYear = date.getFullYear() === today.getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}

/** Bucketed counts by activity type for stat headers. */
export function summariseActivity(items: Activity[]) {
  const counts: Record<string, number> = {};
  for (const i of items) counts[i.type] = (counts[i.type] ?? 0) + 1;
  return {
    total: items.length,
    counts,
    killed: counts.kill ?? 0,
    reviving: counts.revive ?? 0,
    shipping: counts.ship_small ?? 0,
    sent: counts.next_move_done ?? 0,
    skipped: counts.next_move_skipped ?? 0,
    resolved: counts.loop_resolved ?? 0,
    thisWeekDone: counts.this_week_done ?? 0,
  };
}
