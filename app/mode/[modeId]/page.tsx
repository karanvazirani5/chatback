"use client";

import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { ModeId } from "@/lib/types";
import { useAnalysis } from "@/lib/use-analysis";
import { RoastCard } from "@/components/mode/RoastCard";
import { WrappedStory } from "@/components/mode/wrapped/WrappedStory";
import { GraveyardCard } from "@/components/mode/GraveyardCard";
import { ForgotWantedCard } from "@/components/mode/ForgotWantedCard";
import { FutureLetterCard } from "@/components/mode/FutureLetterCard";
import { FoundersScanCard } from "@/components/mode/FoundersScanCard";
import { ShareButtons } from "@/components/ShareButtons";
import { Skeleton } from "@/components/ui/skeleton";

const VALID_MODES = [
  "roast",
  "wrapped",
  "graveyard",
  "forgot",
  "future",
  "founder",
] as const;

const MODE_TITLES: Record<(typeof VALID_MODES)[number], string> = {
  roast: "Roast my history",
  wrapped: "AI Wrapped",
  graveyard: "Chat graveyard",
  forgot: "What I forgot I wanted",
  future: "Future me letter",
  founder: "Founder brain scan",
};

export default function ModePage() {
  const router = useRouter();
  const params = useParams<{ modeId: string }>();
  const modeId = params.modeId as ModeId;
  const { status, analysis, elapsedSeconds } = useAnalysis();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!VALID_MODES.includes(modeId as (typeof VALID_MODES)[number])) {
      router.replace("/dashboard");
      return;
    }
    if (status === "missing") {
      router.replace("/");
    }
  }, [modeId, router, status]);

  if (status === "missing") return null;

  const title = MODE_TITLES[modeId as (typeof VALID_MODES)[number]];

  return (
    <main className="flex-1 px-5 py-8 md:py-14 max-w-2xl mx-auto w-full">
      <header className="mb-7 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors"
        >
          ← Back to archive
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ {title}
        </span>
      </header>

      {status === "loading" && (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 mb-4 flex items-center justify-between gap-3">
            <p className="font-serif italic text-base text-warm">
              Building your archive… come back in a moment.
            </p>
            <span className="font-mono text-xs tabular-nums text-primary/80 shrink-0">
              {elapsedSeconds ?? 0}s
            </span>
          </div>
          <Skeleton className="aspect-square w-full rounded-2xl bg-surface-2" />
        </div>
      )}

      {status === "error" && (
        <div className="max-w-md mx-auto rounded-2xl border border-rose-300/30 bg-rose-950/20 p-5 font-serif italic text-base text-rose-100">
          Couldn&apos;t build your archive.{" "}
          <Link
            href="/"
            className="not-italic font-mono uppercase text-[10px] tracking-[0.22em] text-warm hover:text-primary ml-2"
          >
            Try again →
          </Link>
        </div>
      )}

      {status === "ready" && analysis && (
        <>
          {modeId === "wrapped" ? (
            <WrappedStory
              wrapped={analysis.viral_modes.wrapped}
              topTheme={analysis.themes[0]}
              topOpenLoop={analysis.open_loops[0]}
            />
          ) : (
            <>
              <div className="mb-2">
                {modeId === "roast" && (
                  <RoastCard ref={cardRef} roast={analysis.viral_modes.roast} />
                )}
                {modeId === "graveyard" && (
                  <GraveyardCard
                    ref={cardRef}
                    entries={analysis.viral_modes.graveyard}
                  />
                )}
                {modeId === "forgot" && (
                  <ForgotWantedCard
                    ref={cardRef}
                    text={analysis.viral_modes.forgot_wanted}
                  />
                )}
                {modeId === "future" && (
                  <FutureLetterCard
                    ref={cardRef}
                    letter={analysis.viral_modes.future_letter}
                  />
                )}
                {modeId === "founder" && (
                  <FoundersScanCard
                    ref={cardRef}
                    text={analysis.viral_modes.founder_scan}
                  />
                )}
              </div>

              <div className="max-w-md mx-auto">
                <ShareButtons mode={modeId as ModeId} targetRef={cardRef} />
                {modeId === "future" && (
                  <Link
                    href="/mode/future-you"
                    className="block mt-4 text-center font-serif italic text-base text-primary hover:text-[#fcd34d] transition-colors"
                  >
                    Reply to your future self →
                  </Link>
                )}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
