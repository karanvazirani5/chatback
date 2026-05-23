import type { Theme } from "@/lib/types";

export function ThemesCard({ themes }: { themes: Theme[] }) {
  return (
    <section className="rounded-2xl border border-warm bg-surface/60 p-5 md:p-7 card-lift">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-5">
        ✺ What you&apos;ve been thinking about
      </p>
      <ol className="space-y-6">
        {themes.map((t, i) => (
          <li key={t.theme} className="flex gap-5">
            <span className="font-serif italic text-2xl text-primary/80 w-8 pt-0.5 shrink-0 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-xl md:text-2xl text-warm leading-tight tracking-tight">
                  {t.theme}
                </h3>
                <span className="font-mono text-xs text-warm-muted shrink-0 tabular-nums">
                  ×{t.count}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-warm-muted leading-relaxed">
                {t.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
