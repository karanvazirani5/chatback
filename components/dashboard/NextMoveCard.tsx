"use client";

import { useCallback, useEffect, useState } from "react";
import type { MasterAnalysis, NextMove } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  formatRelative,
  recordNextMoveOutcome,
  useUserActions,
} from "@/lib/user-actions";
import { getRawContext } from "@/lib/storage";

interface NextMoveCardProps {
  analysis: MasterAnalysis;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; move: NextMove }
  | { status: "error"; error: string }
  | { status: "exhausted" };

export function NextMoveCard({ analysis }: NextMoveCardProps) {
  const actions = useUserActions();
  const [state, setState] = useState<FetchState>({ status: "idle" });
  const [copied, setCopied] = useState(false);

  const excludeNames = Object.keys(actions.nextMoves);
  const lastMoveOutcome =
    state.status === "ready" ? actions.nextMoves[state.move.source_name] : null;

  const fetchMove = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/next-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          rawContext: getRawContext() ?? undefined,
          excludeNames,
        }),
      });
      let data: { move?: NextMove; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Hit a snag (HTTP ${res.status}).`);
      }
      if (!res.ok || data.error || !data.move) {
        throw new Error(data.error ?? "Couldn't pick your next move.");
      }
      setState({ status: "ready", move: data.move });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis]);

  // Initial fetch — only once per mount. Refresh manually via "next move" button.
  useEffect(() => {
    if (state.status === "idle") fetchMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (state.status !== "ready") return;
    try {
      await navigator.clipboard.writeText(state.move.asset_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleOutcome = (outcome: "done" | "skipped") => {
    if (state.status !== "ready") return;
    recordNextMoveOutcome(state.move.source_name, outcome);
  };

  const handleNext = () => {
    fetchMove();
  };

  if (state.status === "loading") {
    return (
      <section className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-7 md:p-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ Your next move
        </p>
        <p className="mt-3 font-serif italic text-lg text-warm">
          Picking the one thing worth doing this week…
        </p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="rounded-2xl border border-rose-300/30 bg-rose-950/20 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-rose-200">
          ✺ Your next move
        </p>
        <p className="mt-2 font-serif italic text-base text-rose-100">
          {state.error}
        </p>
        <button
          type="button"
          onClick={fetchMove}
          className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-rose-100 hover:text-warm cursor-pointer"
        >
          Try again →
        </button>
      </section>
    );
  }

  if (state.status === "exhausted" || state.status === "idle") {
    return null;
  }

  // state.status === "ready"
  const { move } = state;
  const outcome = lastMoveOutcome?.outcome;

  return (
    <section className="relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.10] via-primary/[0.04] to-transparent p-5 md:p-8 overflow-hidden card-lift">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent"
      />

      <div className="relative">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Your next move
          </p>
          {outcome && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">
              {outcome === "done" ? "✓ Sent" : "✗ Skipped"} ·{" "}
              {formatRelative(lastMoveOutcome!.at)}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-serif text-3xl md:text-4xl tracking-[-0.02em] leading-[1.1] text-warm">
          {move.headline}
        </h2>

        <p className="mt-3 text-sm md:text-base text-warm-muted leading-relaxed italic">
          {move.action}
        </p>

        <div className="mt-5 rounded-xl border border-warm bg-[#0a0a14] p-5">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              {move.asset_label}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-primary transition-colors cursor-pointer"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <p className="font-serif italic text-base md:text-lg text-warm leading-snug whitespace-pre-wrap">
            {move.asset_text}
          </p>
        </div>

        {!outcome ? (
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={() => handleOutcome("done")}
              className="h-12 bg-primary text-primary-foreground hover:bg-[#fcd34d] font-serif italic rounded-full btn-glow cursor-pointer"
            >
              Sent it ✓
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOutcome("skipped")}
              className="h-12 bg-surface border border-warm text-warm-muted hover:text-warm font-serif italic rounded-full cursor-pointer"
            >
              Skip this one
            </Button>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="font-serif italic text-sm text-warm-muted">
              {outcome === "done"
                ? "Nice. One loop closed."
                : "Skipped. We'll find something else."}
            </p>
            <Button
              type="button"
              onClick={handleNext}
              size="sm"
              className="bg-primary/[0.08] border border-primary/30 text-warm hover:bg-primary/[0.14] hover:text-warm font-mono text-[10px] uppercase tracking-[0.22em] rounded-full cursor-pointer"
            >
              Show me the next one →
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
