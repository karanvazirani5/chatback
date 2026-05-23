"use client";

import { useEffect, useState } from "react";
import type { MasterAnalysis } from "./types";
import { getAnalysis } from "./storage";
import {
  getAnalysisJobState,
  subscribeAnalysisJob,
  type AnalysisJobState,
} from "./analysis-job";

export type AnalysisStatus = "loading" | "ready" | "missing" | "error";

export interface UseAnalysisResult {
  status: AnalysisStatus;
  analysis?: MasterAnalysis;
  error?: string;
  /** Seconds elapsed since the job started, only relevant while loading. */
  elapsedSeconds?: number;
}

/**
 * Reactive view over (job state + sessionStorage). Used by dashboard + mode
 * pages to decide whether to show real data, a skeleton, or redirect home.
 */
export function useAnalysis(): UseAnalysisResult {
  const [job, setJob] = useState<AnalysisJobState>(() => getAnalysisJobState());
  const [cached, setCached] = useState<MasterAnalysis | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Subscribe to job updates.
  useEffect(() => {
    const unsubscribe = subscribeAnalysisJob(() => {
      setJob(getAnalysisJobState());
    });
    return unsubscribe;
  }, []);

  // Hydrate cached analysis from sessionStorage once on mount.
  useEffect(() => {
    setCached(getAnalysis());
    setHydrated(true);
  }, []);

  // Tick once a second while pending so elapsed seconds updates.
  useEffect(() => {
    if (job.status !== "pending") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [job.status]);

  if (!hydrated) return { status: "loading" };

  if (job.status === "success") {
    return { status: "ready", analysis: job.analysis };
  }
  if (job.status === "pending") {
    return {
      status: "loading",
      elapsedSeconds: Math.floor((now - job.startedAt) / 1000),
    };
  }
  if (job.status === "error") {
    return { status: "error", error: job.error };
  }
  // job idle — fall back to cached analysis from sessionStorage.
  if (cached) return { status: "ready", analysis: cached };
  return { status: "missing" };
}
