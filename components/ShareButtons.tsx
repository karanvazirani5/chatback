"use client";

import { useState, type RefObject } from "react";
import type { ModeId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { downloadShareCard } from "@/lib/share-image";
import { buildTweetUrl, shareCopyFor } from "@/lib/share-text";

interface ShareButtonsProps {
  mode: ModeId;
  targetRef: RefObject<HTMLDivElement | null>;
}

export function ShareButtons({ mode, targetRef }: ShareButtonsProps) {
  const copy = shareCopyFor(mode);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current || downloading) return;
    setDownloading(true);
    try {
      await downloadShareCard(targetRef.current, copy.filename);
    } catch (err) {
      console.error("[share-card download]", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleTweet = () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    window.open(buildTweetUrl(copy.tweet, shareUrl), "_blank", "noopener");
  };

  const handleIg = async () => {
    try {
      await navigator.clipboard.writeText(
        `${copy.igSticker}\n\n${
          typeof window !== "undefined" ? window.location.origin : ""
        }`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? "Saving…" : "📥 PNG"}
      </Button>
      <Button variant="secondary" size="sm" onClick={handleTweet}>
        🐦 Share on X
      </Button>
      <Button variant="secondary" size="sm" onClick={handleIg}>
        {copied ? "✓ Copied" : "📸 IG"}
      </Button>
    </div>
  );
}
