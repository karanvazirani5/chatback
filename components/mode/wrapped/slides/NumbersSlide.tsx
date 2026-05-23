"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "../../ShareableFrame";
import type { WrappedNumber } from "@/lib/types";

export const NumbersSlide = forwardRef<
  HTMLDivElement,
  { numbers: WrappedNumber[] }
>(function NumbersSlide({ numbers }, ref) {
  const cols = numbers.length >= 5 ? "grid-cols-3" : "grid-cols-2";
  return (
    <ShareableFrame ref={ref} className="bg-[#0a0a14]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 110% 0%, rgba(244,185,66,0.18), transparent 60%)",
        }}
      />
      <div className="relative h-full w-full flex flex-col p-7 md:p-9">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ By the numbers
        </div>
        <h2 className="mt-1 font-serif text-3xl md:text-4xl text-warm tracking-[-0.02em] leading-[1.05]">
          The receipts.
        </h2>

        <div className={`mt-auto mb-2 grid ${cols} gap-x-3 gap-y-4`}>
          {numbers.map((n, i) => (
            <div key={i} className="min-w-0">
              <p className="font-serif text-3xl md:text-4xl text-primary leading-none tabular-nums tracking-tight">
                {n.value}
              </p>
              <p className="mt-1.5 text-[11px] md:text-xs text-warm-muted leading-tight">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ShareableFrame>
  );
});
