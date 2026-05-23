"use client";

import { useCallback, useRef, useState, type ReactElement } from "react";
import type {
  MasterAnalysis,
  OpenLoop,
  Theme,
  WrappedStats,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { downloadShareCard } from "@/lib/share-image";
import { buildTweetUrl } from "@/lib/share-text";
import { CoverSlide } from "./slides/CoverSlide";
import { NumbersSlide } from "./slides/NumbersSlide";
import { TopObsessionSlide } from "./slides/TopObsessionSlide";
import { QuestionSlide } from "./slides/QuestionSlide";
import { ShapeSlide } from "./slides/ShapeSlide";
import { SuperlativesSlide } from "./slides/SuperlativesSlide";
import { ClosingSlide } from "./slides/ClosingSlide";

interface WrappedStoryProps {
  wrapped: WrappedStats;
  topTheme: Theme | undefined;
  topOpenLoop: OpenLoop | undefined;
}

const SLIDE_TITLES = [
  "Cover",
  "Numbers",
  "Top obsession",
  "The question",
  "Your shape",
  "Superlatives",
  "Closing",
];

export function WrappedStory({
  wrapped,
  topTheme,
  topOpenLoop,
}: WrappedStoryProps) {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const setSlideRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      refs.current[i] = el;
    },
    []
  );
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<"x" | "ig" | null>(null);

  // Build slides defensively in case topTheme / topOpenLoop missing.
  // (Schema requires themes ≥ 1 + open_loops ≤ 5 — they may be missing on
  // empty-input edge cases.)
  const slides = [
    <CoverSlide
      key="cover"
      ref={setSlideRef(0)}
      archetype={wrapped.archetype}
    />,
    <NumbersSlide
      key="numbers"
      ref={setSlideRef(1)}
      numbers={wrapped.numbers}
    />,
    topTheme ? (
      <TopObsessionSlide
        key="theme"
        ref={setSlideRef(2)}
        theme={topTheme}
      />
    ) : null,
    topOpenLoop ? (
      <QuestionSlide
        key="loop"
        ref={setSlideRef(3)}
        loop={topOpenLoop}
      />
    ) : null,
    <ShapeSlide
      key="shape"
      ref={setSlideRef(4)}
      personality={wrapped.personality}
      active={idx === 4}
    />,
    <SuperlativesSlide
      key="supers"
      ref={setSlideRef(5)}
      items={wrapped.superlatives}
    />,
    <ClosingSlide
      key="closing"
      ref={setSlideRef(6)}
      tagline={wrapped.tagline}
    />,
  ].filter((s): s is ReactElement => s !== null);

  const total = slides.length;
  const isLast = idx === total - 1;
  const isFirst = idx === 0;

  const next = () => setIdx((i) => Math.min(i + 1, total - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const handleDownload = async () => {
    const node = refs.current[idx];
    if (!node || downloading) return;
    setDownloading(true);
    try {
      await downloadShareCard(node, `chatback-wrapped-${idx + 1}`);
    } catch (err) {
      console.error("[wrapped share]", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleTweet = () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const text = isLast
      ? `my ai wrapped: "${wrapped.tagline}"`
      : "my ai wrapped is somehow more accurate than my spotify wrapped";
    window.open(buildTweetUrl(text, shareUrl), "_blank", "noopener");
  };

  const handleIg = async () => {
    try {
      await navigator.clipboard.writeText(
        `tap to read yours →\n\n${
          typeof window !== "undefined" ? window.location.origin : ""
        }`
      );
      setCopied("ig");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress bars */}
      <div className="flex gap-1.5 mb-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 bg-warm/[0.10] rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-primary transition-[width] duration-500 ${
                i < idx ? "w-full" : i === idx ? "w-full" : "w-0"
              }`}
              style={
                i === idx
                  ? { boxShadow: "0 0 12px rgba(244,185,66,0.5)" }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Slide stage */}
      <div className="relative">
        {slides[idx]}

        {/* Tap zones — overlay buttons that don't interfere with the share PNG */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          disabled={isFirst}
          className="absolute inset-y-0 left-0 w-2/5 bg-transparent disabled:opacity-0"
        />
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          disabled={isLast}
          className="absolute inset-y-0 right-0 w-3/5 bg-transparent disabled:opacity-0"
        />
      </div>

      {/* Pager */}
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
        <span className="tabular-nums">
          {idx + 1} / {total}
        </span>
        <span className="text-primary/70">{SLIDE_TITLES[idx] ?? ""}</span>
      </div>

      {/* Share buttons — bigger / more prominent on the closing slide */}
      {isLast ? (
        <div className="mt-5 flex flex-col gap-2">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="lg"
            className="h-14 text-base font-serif italic bg-primary text-primary-foreground hover:bg-[#fcd34d] rounded-full btn-glow cursor-pointer"
          >
            {downloading ? "Saving…" : "Save my wrapped ↓"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTweet}
              className="bg-surface text-warm border border-warm hover:bg-primary/[0.08] cursor-pointer"
            >
              🐦 Share on X
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleIg}
              className="bg-surface text-warm border border-warm hover:bg-primary/[0.08] cursor-pointer"
            >
              {copied === "ig" ? "✓ Copied" : "📸 Copy for IG"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="bg-surface text-warm border border-warm hover:bg-primary/[0.08] cursor-pointer"
          >
            {downloading ? "Saving…" : "📥 PNG"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTweet}
            className="bg-surface text-warm border border-warm hover:bg-primary/[0.08] cursor-pointer"
          >
            🐦 X
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleIg}
            className="bg-surface text-warm border border-warm hover:bg-primary/[0.08] cursor-pointer"
          >
            {copied === "ig" ? "✓ Copied" : "📸 IG"}
          </Button>
        </div>
      )}
    </div>
  );
}

// Re-export for convenience.
export type { MasterAnalysis };
