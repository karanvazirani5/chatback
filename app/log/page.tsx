"use client";

import Link from "next/link";
import { ActivityList } from "@/components/log/ActivityList";

export default function LogPage() {
  return (
    <main className="flex-1 px-5 md:px-0 pt-8 md:pt-14 pb-16 max-w-2xl mx-auto w-full">
      <header className="mb-10">
        <div className="flex items-center justify-between mb-7">
          <Link
            href="/dashboard"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors"
          >
            ← Back to archive
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Your log
          </span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
          ✺ Receipts
        </p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95] text-warm">
          What you actually did.
        </h1>
        <p className="mt-4 font-serif italic text-lg text-warm-muted leading-snug max-w-md">
          Every loop closed, every project killed, every move sent — kept in
          your browser only, in the order it happened.
        </p>
      </header>

      <ActivityList />

      <footer className="mt-20 pt-8 border-t border-warm text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
          chatback.app
        </p>
      </footer>
    </main>
  );
}
