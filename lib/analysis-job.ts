"use client";

import type { MasterAnalysis } from "./types";
import { setAnalysis, setRawContext } from "./storage";

/**
 * Single-job state machine for the current analyze call. Lives in
 * module-level state so a background fetch keeps running while the user
 * navigates around. When the job completes, the result is also persisted
 * to sessionStorage so a refresh recovers it.
 */
export type AnalysisJobState =
  | { status: "idle" }
  | { status: "pending"; startedAt: number }
  | { status: "success"; analysis: MasterAnalysis; finishedAt: number }
  | { status: "error"; error: string };

let state: AnalysisJobState = { status: "idle" };
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function getAnalysisJobState(): AnalysisJobState {
  return state;
}

export function subscribeAnalysisJob(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetAnalysisJob() {
  state = { status: "idle" };
  notify();
}

/**
 * Kick off an analysis. Returns immediately — the result lands in module
 * state when the network call resolves. Safe to call again to replace an
 * in-flight job (the previous fetch continues but its result is ignored).
 */
export function startAnalysisJob(rawText: string) {
  const startedAt = Date.now();
  state = { status: "pending", startedAt };
  notify();

  const myStartedAt = startedAt;
  fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText }),
  })
    .then(async (res) => {
      let data: { analysis?: MasterAnalysis; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status === 504 || res.status === 408
            ? "That took too long to read. Try a shorter paste or the sample data."
            : `Hit a snag (HTTP ${res.status}). Try again or use sample data.`
        );
      }
      if (!res.ok || data.error || !data.analysis) {
        throw new Error(
          data.error ?? "Couldn't read this. Try different text or sample data."
        );
      }
      return data.analysis;
    })
    .then((analysis) => {
      // Ignore if a newer job has started.
      if (
        state.status !== "pending" ||
        (state as { startedAt: number }).startedAt !== myStartedAt
      ) {
        return;
      }
      setAnalysis(analysis);
      setRawContext(rawText);
      state = {
        status: "success",
        analysis,
        finishedAt: Date.now(),
      };
      notify();
    })
    .catch((err: unknown) => {
      if (
        state.status !== "pending" ||
        (state as { startedAt: number }).startedAt !== myStartedAt
      ) {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : "Couldn't read this. Try different text or sample data.";
      state = { status: "error", error: message };
      notify();
    });
}
