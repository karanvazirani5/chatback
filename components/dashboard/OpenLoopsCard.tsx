"use client";

import type { OpenLoop } from "@/lib/types";
import {
  formatRelative,
  resolveLoop,
  unresolveLoop,
  useUserActions,
} from "@/lib/user-actions";

export function OpenLoopsCard({ loops }: { loops: OpenLoop[] }) {
  const actions = useUserActions();
  const open = loops.filter((l) => !actions.resolvedLoops[l.question]);
  const resolved = loops.filter((l) => actions.resolvedLoops[l.question]);

  return (
    <section className="rounded-2xl border border-warm bg-surface/60 p-5 md:p-7 card-lift">
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ Open loops
        </p>
        {resolved.length > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70">
            ✓ {resolved.length} resolved
          </span>
        )}
      </div>

      {open.length === 0 && (
        <p className="font-serif italic text-base text-warm-muted">
          Every loop is resolved. Look at you.
        </p>
      )}

      <ul className="divide-y divide-warm">
        {open.map((l) => (
          <li key={l.question} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-lg md:text-xl text-warm leading-snug flex-1 min-w-0 tracking-tight">
                {l.question}
              </h3>
              <span className="font-mono text-xs text-warm-muted shrink-0 tabular-nums">
                ×{l.times_asked}
              </span>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
              First asked {l.first_seen}
            </p>
            <p className="mt-2 text-sm text-warm-muted italic leading-relaxed">
              {l.notes}
            </p>
            <button
              type="button"
              onClick={() => resolveLoop(l.question)}
              className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-primary transition-colors cursor-pointer"
            >
              Mark resolved →
            </button>
          </li>
        ))}
      </ul>

      {resolved.length > 0 && (
        <details className="mt-6 pt-5 border-t border-warm">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm list-none [&::-webkit-details-marker]:hidden">
            <span className="text-primary">→</span> {resolved.length} resolved
          </summary>
          <ul className="mt-3 space-y-3">
            {resolved.map((l) => {
              const r = actions.resolvedLoops[l.question];
              return (
                <li key={l.question} className="text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-base text-warm-muted line-through decoration-warm-muted/40 leading-snug flex-1 min-w-0">
                      {l.question}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary/70 shrink-0">
                      {formatRelative(r.resolvedAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => unresolveLoop(l.question)}
                    className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-warm-muted/70 hover:text-warm cursor-pointer"
                  >
                    Undo
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </section>
  );
}
