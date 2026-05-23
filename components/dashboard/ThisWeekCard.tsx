"use client";

import {
  formatRelative,
  markThisWeekDone,
  unmarkThisWeek,
  useUserActions,
} from "@/lib/user-actions";

export function ThisWeekCard({ recommendation }: { recommendation: string }) {
  const actions = useUserActions();
  const done = actions.thisWeek[recommendation];
  const isDone = !!done;

  return (
    <section
      className={`relative rounded-2xl overflow-hidden p-7 md:p-9 transition-opacity ${
        isDone
          ? "border border-warm bg-surface/40 opacity-80"
          : "border border-primary/30 bg-gradient-to-br from-primary/[0.10] via-primary/[0.04] to-transparent shadow-[0_24px_60px_-30px_rgba(244,185,66,0.45)]"
      }`}
    >
      {!isDone && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent"
        />
      )}
      <div className="relative">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Do this week
          </p>
          {isDone && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">
              ✓ Done · {formatRelative(done.doneAt)}
            </span>
          )}
        </div>

        <p
          className={`font-serif text-3xl md:text-4xl tracking-[-0.02em] ${
            isDone
              ? "text-warm-muted line-through decoration-warm-muted/40 leading-snug"
              : "text-warm leading-[1.1]"
          }`}
        >
          {recommendation}
        </p>

        <div className="mt-7">
          {isDone ? (
            <button
              type="button"
              onClick={() => unmarkThisWeek(recommendation)}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors cursor-pointer"
            >
              Undo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => markThisWeekDone(recommendation)}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[#fcd34d] font-serif italic text-lg py-3 transition-colors cursor-pointer shadow-[0_8px_24px_-12px_rgba(244,185,66,0.6)]"
            >
              I did it ✓
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
