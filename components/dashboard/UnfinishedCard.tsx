"use client";

import type { Recommendation, Unfinished } from "@/lib/types";
import {
  formatRelative,
  setUnfinishedChoice,
  useUserActions,
  type UnfinishedChoice,
} from "@/lib/user-actions";

const ACTION_META: Record<
  Recommendation,
  { label: string; emoji: string; verb: string }
> = {
  kill: { label: "Kill it", emoji: "💀", verb: "Killed" },
  revive: { label: "Revive it", emoji: "⚡", verb: "Reviving" },
  ship_small: { label: "Ship smallest", emoji: "🚀", verb: "Shipping" },
};

const ALL_ACTIONS: Recommendation[] = ["kill", "revive", "ship_small"];

export function UnfinishedCard({ items }: { items: Unfinished[] }) {
  const actions = useUserActions();

  return (
    <section className="rounded-2xl border border-warm bg-surface/60 p-5 md:p-7 card-lift">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-5">
        ✺ Your unfinished list
      </p>
      <ul className="space-y-7">
        {items.map((item) => (
          <UnfinishedRow
            key={item.name}
            item={item}
            chosen={
              (actions.unfinished[item.name]?.choice as UnfinishedChoice) ??
              null
            }
            chosenAt={actions.unfinished[item.name]?.chosenAt}
          />
        ))}
      </ul>
    </section>
  );
}

function UnfinishedRow({
  item,
  chosen,
  chosenAt,
}: {
  item: Unfinished;
  chosen: UnfinishedChoice | null;
  chosenAt?: number;
}) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg md:text-xl text-warm leading-snug tracking-tight">
          {item.name}
        </h3>
        <span className="font-mono text-xs text-warm-muted shrink-0 tabular-nums">
          ×{item.mentions}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-warm-muted italic leading-relaxed">
        {item.why}
      </p>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {ALL_ACTIONS.map((action) => {
          const meta = ACTION_META[action];
          const isChosen = chosen === action;
          const isRecommended = action === item.recommendation;
          return (
            <button
              key={action}
              type="button"
              onClick={() => setUnfinishedChoice(item.name, action)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${
                isChosen
                  ? "bg-primary text-primary-foreground border-primary"
                  : isRecommended
                  ? "border-primary/40 text-warm hover:bg-primary/[0.08]"
                  : "border-warm text-warm-muted hover:border-primary/60 hover:text-warm"
              }`}
              aria-pressed={isChosen}
            >
              <span className="mr-1.5">{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>
      {chosen && chosenAt !== undefined && (
        <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">
          {ACTION_META[chosen].verb} · {formatRelative(chosenAt)}
        </p>
      )}
    </li>
  );
}
