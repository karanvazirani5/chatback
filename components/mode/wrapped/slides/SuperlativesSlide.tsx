"use client";

import { forwardRef } from "react";
import { ShareableFrame } from "../../ShareableFrame";
import type { WrappedSuperlative } from "@/lib/types";

export const SuperlativesSlide = forwardRef<
  HTMLDivElement,
  { items: WrappedSuperlative[] }
>(function SuperlativesSlide({ items }, ref) {
  return (
    <ShareableFrame ref={ref} className="bg-[#0a0a14]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 45% at 0% 0%, rgba(244,185,66,0.18), transparent 65%), radial-gradient(45% 40% at 100% 100%, rgba(126,90,200,0.14), transparent 60%)",
        }}
      />
      <div className="relative h-full w-full flex flex-col p-7 md:p-9">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ Superlatives
        </div>
        <h2 className="mt-1 font-serif text-3xl md:text-4xl text-warm tracking-[-0.02em] leading-[1.05]">
          Fun facts.
        </h2>

        <ul className="mt-auto mb-2 space-y-5">
          {items.map((s, i) => (
            <li key={i} className="border-l-2 border-primary/60 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                {s.label}
              </p>
              <p className="mt-1 font-serif italic text-base md:text-lg text-warm leading-snug">
                {s.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </ShareableFrame>
  );
});
