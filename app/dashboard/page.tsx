"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalysis } from "@/lib/use-analysis";
import { clearAll } from "@/lib/storage";
import { resetAnalysisJob } from "@/lib/analysis-job";
import { ThemesCard } from "@/components/dashboard/ThemesCard";
import { OpenLoopsCard } from "@/components/dashboard/OpenLoopsCard";
import { DecisionsCard } from "@/components/dashboard/DecisionsCard";
import { ThisWeekCard } from "@/components/dashboard/ThisWeekCard";
import { UnfinishedCard } from "@/components/dashboard/UnfinishedCard";
import { ModePickerRow } from "@/components/dashboard/ModePickerRow";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { NextMoveCard } from "@/components/dashboard/NextMoveCard";
import { SinceLastTimeCard } from "@/components/dashboard/SinceLastTimeCard";

export default function DashboardPage() {
  const router = useRouter();
  const { status, analysis, error, elapsedSeconds } = useAnalysis();

  useEffect(() => {
    if (status === "missing") router.replace("/");
  }, [status, router]);

  if (status === "missing") return null;

  return (
    <main className="flex-1 px-5 md:px-0 pt-8 md:pt-14 pb-16 max-w-2xl mx-auto w-full">
      <header className="mb-12">
        <div className="flex items-center justify-between mb-7">
          <Link
            href="/"
            className="font-serif text-2xl text-warm hover:text-primary transition-colors"
          >
            Chat<span className="italic">back</span>.
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAll();
              resetAnalysisJob();
              router.push("/");
            }}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors cursor-pointer"
          >
            Start over
          </button>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
          ✺ Your archive
        </p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95] text-warm">
          What the AI noticed.
        </h1>
      </header>

      {status === "error" && (
        <div className="mb-7 rounded-xl border border-rose-300/30 bg-rose-950/20 p-5 text-sm text-rose-100">
          <p className="font-serif italic text-base mb-1">
            Couldn&apos;t build your archive.
          </p>
          <p className="text-rose-200/80 mb-3">{error}</p>
          <button
            type="button"
            onClick={() => {
              resetAnalysisJob();
              router.push("/");
            }}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm hover:text-primary"
          >
            Try again →
          </button>
        </div>
      )}

      {status === "loading" && (
        <DashboardSkeleton elapsedSeconds={elapsedSeconds} />
      )}

      {status === "ready" && analysis && (
        <>
          <StatusBanner />
          <div className="space-y-5">
            <SinceLastTimeCard analysis={analysis} />
            <NextMoveCard analysis={analysis} />
            <ThemesCard themes={analysis.themes} />
            <OpenLoopsCard loops={analysis.open_loops} />
            <DecisionsCard decisions={analysis.decisions_made} />
            <ThisWeekCard recommendation={analysis.this_week} />
            <UnfinishedCard items={analysis.unfinished} />
          </div>
          <ModePickerRow />
        </>
      )}

      <footer className="mt-20 pt-8 border-t border-warm flex items-center justify-between text-warm-muted">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
          chatback.app
        </p>
        <p className="font-serif italic text-sm">
          close the tab — it&apos;s yours alone.
        </p>
      </footer>
    </main>
  );
}
