import Link from "next/link";
import { MODES, type ModeId } from "@/lib/types";

const MODE_TAGLINES: Record<ModeId, string> = {
  "past-you": "step inside the version of you that didn't know yet.",
  "future-you": "ask the version of you six months ahead.",
  roast: "it will drag you. specifically.",
  wrapped: "your year, in seven slides.",
  graveyard: "every idea that quietly died this year.",
  forgot: "the goal you stopped chasing without noticing.",
  future: "a letter from six-months-from-now you.",
  founder: "one line that diagnoses how your brain works.",
};

export function ModePickerRow() {
  return (
    <section className="mt-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-5">
        ✺ Other ways to read your history
      </p>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className="mode-tile group relative rounded-2xl border border-warm bg-surface/60 hover:border-primary/60 hover:bg-surface p-5 min-h-36 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <span className="text-3xl" aria-hidden>
              {m.emoji}
            </span>
            <div>
              <span className="font-serif text-base md:text-lg text-warm leading-snug block">
                {m.label}
              </span>
              <span className="font-serif italic text-xs text-warm-muted leading-snug block mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {MODE_TAGLINES[m.id]}
              </span>
            </div>
            <span
              aria-hidden
              className="mode-tile__arrow absolute top-3 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted/50 group-hover:text-primary"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
