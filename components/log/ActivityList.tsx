"use client";

import { formatRelative, useUserActions } from "@/lib/user-actions";
import {
  buildActivityLog,
  groupActivitiesByDay,
  summariseActivity,
  type Activity,
} from "@/lib/action-log";

export function ActivityList() {
  const actions = useUserActions();
  const items = buildActivityLog(actions);
  const groups = groupActivitiesByDay(items);
  const summary = summariseActivity(items);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-warm bg-surface/40 p-8 md:p-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
          ✺ Empty
        </p>
        <p className="font-serif italic text-xl text-warm leading-snug">
          Nothing in the log yet.
        </p>
        <p className="mt-3 text-sm text-warm-muted leading-relaxed max-w-xs mx-auto">
          Send your next move, kill an unfinished project, or mark a loop
          resolved on the dashboard. Receipts land here.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-7">
      <StatRow summary={summary} />

      {groups.map(({ label, items }) => (
        <section key={label}>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
            ✺ {label}
          </p>
          <ul className="rounded-2xl border border-warm bg-surface/60 divide-y divide-warm overflow-hidden">
            {items.map((item, i) => (
              <ActivityRow key={`${item.type}-${item.at}-${i}`} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function StatRow({
  summary,
}: {
  summary: ReturnType<typeof summariseActivity>;
}) {
  const stats = [
    { value: summary.sent, label: "sent" },
    { value: summary.resolved, label: "loops closed" },
    { value: summary.killed, label: "killed" },
    { value: summary.thisWeekDone, label: "weekly wins" },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
        ✺ Receipts
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-serif italic text-3xl md:text-4xl text-primary tabular-nums leading-none">
              {s.value}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityRow({ item }: { item: Activity }) {
  return (
    <li className="px-5 py-4 flex items-start gap-4">
      <span className="text-xl shrink-0 leading-none mt-0.5" aria-hidden>
        {item.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm md:text-base text-warm leading-snug">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mr-2">
            {item.verb}
          </span>
          <span className="font-serif italic text-warm">{item.itemName}</span>
        </p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-muted shrink-0 mt-1">
        {formatRelative(item.at)}
      </span>
    </li>
  );
}
