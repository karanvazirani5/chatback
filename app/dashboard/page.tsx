"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

type TabKey = "today" | "archive" | "modes";

export default function DashboardPage() {
  const router = useRouter();
  const { status, analysis, error, elapsedSeconds } = useAnalysis();
  const [tab, setTab] = useState<TabKey>("today");

  useEffect(() => {
    if (status === "missing") router.replace("/");
  }, [status, router]);

  if (status === "missing") return null;

  return (
    <main className="flex-1 px-5 md:px-0 pt-6 md:pt-12 pb-16 max-w-2xl mx-auto w-full">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/"
            className="font-serif text-xl text-warm hover:text-primary transition-colors"
          >
            Chat<span className="italic">back</span>.
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/log"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-primary transition-colors"
            >
              Log →
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
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-2">
          ✺ Your archive
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-[-0.02em] leading-[1.05] text-warm">
          What the AI noticed.
        </h1>
      </header>

      {status === "error" && (
        <div className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-950/20 p-5 text-sm text-rose-100">
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
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm hover:text-primary cursor-pointer"
          >
            Try again →
          </button>
        </div>
      )}

      {status === "loading" && (
        <DashboardSkeleton elapsedSeconds={elapsedSeconds} />
      )}

      {status === "ready" && analysis && (
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabKey)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-transparent p-0 h-auto border-b border-warm rounded-none gap-0 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <TabsTrigger
              value="today"
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-warm data-[state=active]:shadow-none text-warm-muted py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-warm transition-colors cursor-pointer"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-warm data-[state=active]:shadow-none text-warm-muted py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-warm transition-colors cursor-pointer"
            >
              Archive
            </TabsTrigger>
            <TabsTrigger
              value="modes"
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-warm data-[state=active]:shadow-none text-warm-muted py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-warm transition-colors cursor-pointer"
            >
              Modes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0 space-y-4">
            <StatusBanner />
            <SinceLastTimeCard analysis={analysis} />
            <NextMoveCard analysis={analysis} />
            <ThisWeekCard recommendation={analysis.this_week} />
          </TabsContent>

          <TabsContent value="archive" className="mt-0 space-y-4">
            <ThemesCard themes={analysis.themes} />
            <OpenLoopsCard loops={analysis.open_loops} />
            <DecisionsCard decisions={analysis.decisions_made} />
            <UnfinishedCard items={analysis.unfinished} />
          </TabsContent>

          <TabsContent value="modes" className="mt-0">
            <ModePickerRow />
          </TabsContent>
        </Tabs>
      )}

      <footer className="mt-16 pt-6 border-t border-warm flex items-center justify-between text-warm-muted">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
          chatback.app
        </p>
        <p className="font-serif italic text-sm">close the tab — it&apos;s yours alone.</p>
      </footer>
    </main>
  );
}
