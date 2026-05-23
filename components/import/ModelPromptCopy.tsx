"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MODEL_EXPORT_PROMPTS } from "@/lib/prompts";

const MODELS = ["Claude", "ChatGPT", "Gemini", "Grok", "Other"] as const;
type Model = (typeof MODELS)[number];

export function ModelPromptCopy() {
  const [selected, setSelected] = useState<Model>("Claude");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(MODEL_EXPORT_PROMPTS[selected]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelected(m)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-serif italic border transition-colors cursor-pointer ${
              selected === m
                ? "bg-primary text-primary-foreground border-primary"
                : "border-warm text-warm-muted hover:border-primary/60 hover:text-warm"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="relative rounded-xl border border-warm bg-surface/60">
        <pre className="text-warm/85 p-4 pr-24 rounded-xl text-xs font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {MODEL_EXPORT_PROMPTS[selected]}
        </pre>
        <Button
          onClick={copy}
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2 h-7 text-xs bg-surface-2 text-warm border border-warm hover:bg-primary/[0.12] hover:text-warm cursor-pointer"
        >
          {copied ? "✓ Copied" : "Copy"}
        </Button>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted leading-relaxed">
        <span className="text-primary">1.</span> Copy ·{" "}
        <span className="text-primary">2.</span> Paste into {selected} ·{" "}
        <span className="text-primary">3.</span> Copy what it gives you ·{" "}
        <span className="text-primary">4.</span> Paste below
      </p>
    </div>
  );
}
