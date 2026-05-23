"use client";

import type { MasterAnalysis } from "./types";
import { MasterAnalysisSchema } from "./schema";

const HISTORY_KEY = "chatback:analysis_history";
const MAX_SNAPSHOTS = 3;

export interface AnalysisSnapshot {
  analysis: MasterAnalysis;
  importedAt: number;
}

function safeParseList(raw: string | null): AnalysisSnapshot[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.flatMap((entry: unknown): AnalysisSnapshot[] => {
      if (
        !entry ||
        typeof entry !== "object" ||
        typeof (entry as AnalysisSnapshot).importedAt !== "number"
      ) {
        return [];
      }
      const parsed = MasterAnalysisSchema.safeParse(
        (entry as AnalysisSnapshot).analysis
      );
      if (!parsed.success) return [];
      return [
        {
          analysis: parsed.data,
          importedAt: (entry as AnalysisSnapshot).importedAt,
        },
      ];
    });
  } catch {
    return [];
  }
}

/** All snapshots, oldest first. Stale entries (schema mismatch) are dropped. */
export function getAnalysisHistory(): AnalysisSnapshot[] {
  if (typeof window === "undefined") return [];
  return safeParseList(window.localStorage.getItem(HISTORY_KEY));
}

/** The most recent snapshot strictly before this moment (excludes the one
 *  you just imported). Returns null if none. */
export function getPreviousSnapshot(): AnalysisSnapshot | null {
  const all = getAnalysisHistory();
  // Last entry is the current one. Return the second-to-last if it exists.
  if (all.length < 2) return null;
  return all[all.length - 2];
}

/** Append a new snapshot. Caps history at MAX_SNAPSHOTS (oldest discarded).
 *  De-dupes if the most recent snapshot is identical (avoids spam from
 *  repeated sample-data clicks). */
export function recordAnalysisSnapshot(analysis: MasterAnalysis) {
  if (typeof window === "undefined") return;
  const existing = getAnalysisHistory();
  const last = existing[existing.length - 1];
  if (last && JSON.stringify(last.analysis) === JSON.stringify(analysis)) {
    return; // identical to the most recent — no-op
  }
  const next = [
    ...existing,
    { analysis, importedAt: Date.now() },
  ].slice(-MAX_SNAPSHOTS);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearAnalysisHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}
