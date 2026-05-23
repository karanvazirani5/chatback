import type { MasterAnalysis } from "./types";
import { MasterAnalysisSchema } from "./schema";
import { clearUserActions } from "./user-actions";
import { clearAnalysisHistory } from "./analysis-history";

const ANALYSIS_KEY = "chatback:analysis";
const RAW_CONTEXT_KEY = "chatback:raw_context";

function store(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function setAnalysis(a: MasterAnalysis) {
  const s = store();
  if (!s) return;
  s.setItem(ANALYSIS_KEY, JSON.stringify(a));
}

export function getAnalysis(): MasterAnalysis | null {
  const s = store();
  if (!s) return null;
  const v = s.getItem(ANALYSIS_KEY);
  if (!v) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(v);
  } catch {
    s.removeItem(ANALYSIS_KEY);
    return null;
  }
  // Validate against the current schema. Stale shapes (from an older deploy)
  // get cleared so the user is sent back to the import page instead of
  // crashing on missing fields.
  const result = MasterAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    console.warn(
      "[storage] cached analysis is from an older schema, clearing.",
      result.error.issues.slice(0, 3)
    );
    s.removeItem(ANALYSIS_KEY);
    s.removeItem(RAW_CONTEXT_KEY);
    return null;
  }
  return result.data;
}

export function setRawContext(text: string) {
  const s = store();
  if (!s) return;
  s.setItem(RAW_CONTEXT_KEY, text);
}

export function getRawContext(): string | null {
  const s = store();
  if (!s) return null;
  return s.getItem(RAW_CONTEXT_KEY);
}

export function clearAll() {
  const s = store();
  if (!s) return;
  s.removeItem(ANALYSIS_KEY);
  s.removeItem(RAW_CONTEXT_KEY);
  clearUserActions();
  clearAnalysisHistory();
}
