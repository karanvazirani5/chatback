"use client";

import { useEffect, useState } from "react";

const ACTIONS_KEY = "chatback:actions";

export type UnfinishedChoice = "kill" | "revive" | "ship_small";

export interface UnfinishedAction {
  choice: UnfinishedChoice;
  chosenAt: number;
}

export interface ThisWeekAction {
  doneAt: number;
}

export interface ResolvedLoopAction {
  resolvedAt: number;
}

export type NextMoveOutcome = "done" | "skipped";

export interface NextMoveAction {
  outcome: NextMoveOutcome;
  at: number;
}

export interface UserActions {
  /** Keyed by Unfinished.name. */
  unfinished: Record<string, UnfinishedAction>;
  /** Keyed by analysis.this_week string. */
  thisWeek: Record<string, ThisWeekAction>;
  /** Keyed by OpenLoop.question. */
  resolvedLoops: Record<string, ResolvedLoopAction>;
  /** Keyed by NextMove.source_name — both done + skipped go here. */
  nextMoves: Record<string, NextMoveAction>;
}

const EMPTY_ACTIONS: UserActions = {
  unfinished: {},
  thisWeek: {},
  resolvedLoops: {},
  nextMoves: {},
};

let cached: UserActions | null = null;
const listeners = new Set<() => void>();

function load(): UserActions {
  if (typeof window === "undefined") return EMPTY_ACTIONS;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(ACTIONS_KEY);
    if (!raw) {
      cached = { ...EMPTY_ACTIONS };
      return cached;
    }
    const parsed = JSON.parse(raw) as Partial<UserActions>;
    cached = {
      unfinished: parsed.unfinished ?? {},
      thisWeek: parsed.thisWeek ?? {},
      resolvedLoops: parsed.resolvedLoops ?? {},
      nextMoves: parsed.nextMoves ?? {},
    };
    return cached;
  } catch {
    cached = { ...EMPTY_ACTIONS };
    return cached;
  }
}

function persist(next: UserActions) {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ACTIONS_KEY, JSON.stringify(next));
    } catch {
      // quota or denied — silent
    }
  }
  for (const listener of listeners) listener();
}

function update(mutator: (current: UserActions) => UserActions) {
  const current = load();
  const next = mutator(current);
  if (next === current) return;
  persist(next);
}

export function getUserActions(): UserActions {
  return load();
}

export function subscribeUserActions(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearUserActions() {
  cached = { ...EMPTY_ACTIONS };
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACTIONS_KEY);
  }
  for (const listener of listeners) listener();
}

// — Unfinished —

export function setUnfinishedChoice(name: string, choice: UnfinishedChoice) {
  update((current) => ({
    ...current,
    unfinished: {
      ...current.unfinished,
      [name]: { choice, chosenAt: Date.now() },
    },
  }));
}

export function clearUnfinishedChoice(name: string) {
  update((current) => {
    if (!current.unfinished[name]) return current;
    const next = { ...current.unfinished };
    delete next[name];
    return { ...current, unfinished: next };
  });
}

// — This week —

export function markThisWeekDone(recommendation: string) {
  update((current) => ({
    ...current,
    thisWeek: {
      ...current.thisWeek,
      [recommendation]: { doneAt: Date.now() },
    },
  }));
}

export function unmarkThisWeek(recommendation: string) {
  update((current) => {
    if (!current.thisWeek[recommendation]) return current;
    const next = { ...current.thisWeek };
    delete next[recommendation];
    return { ...current, thisWeek: next };
  });
}

// — Resolved loops —

export function resolveLoop(question: string) {
  update((current) => ({
    ...current,
    resolvedLoops: {
      ...current.resolvedLoops,
      [question]: { resolvedAt: Date.now() },
    },
  }));
}

export function unresolveLoop(question: string) {
  update((current) => {
    if (!current.resolvedLoops[question]) return current;
    const next = { ...current.resolvedLoops };
    delete next[question];
    return { ...current, resolvedLoops: next };
  });
}

// — Next moves —

export function recordNextMoveOutcome(
  sourceName: string,
  outcome: NextMoveOutcome
) {
  update((current) => ({
    ...current,
    nextMoves: {
      ...current.nextMoves,
      [sourceName]: { outcome, at: Date.now() },
    },
  }));
}

export function clearNextMoveOutcome(sourceName: string) {
  update((current) => {
    if (!current.nextMoves[sourceName]) return current;
    const next = { ...current.nextMoves };
    delete next[sourceName];
    return { ...current, nextMoves: next };
  });
}

// — Hook —

export function useUserActions(): UserActions {
  const [snapshot, setSnapshot] = useState<UserActions>(EMPTY_ACTIONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSnapshot(load());
    setHydrated(true);
    const unsubscribe = subscribeUserActions(() => setSnapshot(load()));
    return unsubscribe;
  }, []);

  return hydrated ? snapshot : EMPTY_ACTIONS;
}

// — Helpers —

export function formatRelative(timestamp: number, now = Date.now()): string {
  const diffMs = now - timestamp;
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
