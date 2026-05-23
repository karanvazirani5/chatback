import type { Decision } from "@/lib/types";

export function DecisionsCard({ decisions }: { decisions: Decision[] }) {
  return (
    <section className="rounded-2xl border border-warm bg-surface/60 p-7 md:p-9 card-lift">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-5">
        ✺ What you&apos;ve already decided
      </p>
      <ul className="space-y-6">
        {decisions.map((d) => (
          <li key={d.topic}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted mb-1.5">
              {d.topic}
            </p>
            <p className="font-serif text-xl md:text-2xl text-warm italic leading-snug tracking-tight">
              &ldquo;{d.verdict}&rdquo;
            </p>
            <p className="mt-2 text-sm text-warm-muted leading-relaxed">
              {d.evidence}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
