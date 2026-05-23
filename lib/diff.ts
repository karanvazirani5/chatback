import type { MasterAnalysis, Theme, OpenLoop, Unfinished, Decision } from "./types";

export interface AnalysisDiff {
  /** Themes present in current that weren't in previous. */
  newThemes: Theme[];
  /** Themes that were in previous and are gone now. */
  droppedThemes: Theme[];
  /** Open loops present in current that weren't in previous. */
  newOpenLoops: OpenLoop[];
  /** Open loops that were open last time and aren't in the new analysis
   *  (resolved either explicitly or implicitly). */
  closedOpenLoops: OpenLoop[];
  /** Unfinished items new in this analysis. */
  newUnfinished: Unfinished[];
  /** Unfinished items that disappeared (likely shipped or abandoned). */
  droppedUnfinished: Unfinished[];
  /** Decisions made in this analysis that weren't there last time. */
  newDecisions: Decision[];
  /** Total number of meaningful changes. */
  totalChanges: number;
}

/** Case-insensitive set-membership by a string key. */
function byName<T>(items: T[], key: (t: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(key(item).toLowerCase().trim(), item);
  }
  return map;
}

export function computeDiff(
  current: MasterAnalysis,
  previous: MasterAnalysis
): AnalysisDiff {
  const prevThemes = byName(previous.themes, (t) => t.theme);
  const curThemes = byName(current.themes, (t) => t.theme);
  const prevLoops = byName(previous.open_loops, (l) => l.question);
  const curLoops = byName(current.open_loops, (l) => l.question);
  const prevUnfinished = byName(previous.unfinished, (u) => u.name);
  const curUnfinished = byName(current.unfinished, (u) => u.name);
  const prevDecisions = byName(previous.decisions_made, (d) => d.topic);
  const curDecisions = byName(current.decisions_made, (d) => d.topic);

  const newThemes = current.themes.filter(
    (t) => !prevThemes.has(t.theme.toLowerCase().trim())
  );
  const droppedThemes = previous.themes.filter(
    (t) => !curThemes.has(t.theme.toLowerCase().trim())
  );
  const newOpenLoops = current.open_loops.filter(
    (l) => !prevLoops.has(l.question.toLowerCase().trim())
  );
  const closedOpenLoops = previous.open_loops.filter(
    (l) => !curLoops.has(l.question.toLowerCase().trim())
  );
  const newUnfinished = current.unfinished.filter(
    (u) => !prevUnfinished.has(u.name.toLowerCase().trim())
  );
  const droppedUnfinished = previous.unfinished.filter(
    (u) => !curUnfinished.has(u.name.toLowerCase().trim())
  );
  const newDecisions = current.decisions_made.filter(
    (d) => !prevDecisions.has(d.topic.toLowerCase().trim())
  );

  const totalChanges =
    newThemes.length +
    droppedThemes.length +
    newOpenLoops.length +
    closedOpenLoops.length +
    newUnfinished.length +
    droppedUnfinished.length +
    newDecisions.length;

  return {
    newThemes,
    droppedThemes,
    newOpenLoops,
    closedOpenLoops,
    newUnfinished,
    droppedUnfinished,
    newDecisions,
    totalChanges,
  };
}
