"use client";

import { useState } from "react";
import { MODEL_EXPORT_PROMPTS } from "@/lib/prompts";

const MODELS = ["Claude", "ChatGPT", "Gemini", "Grok", "Other"] as const;
type Model = (typeof MODELS)[number];

interface LaunchConfig {
  /** Chat URL to open. Empty = no app to launch (Other). */
  url: string;
  /** Whether the chat URL accepts `?q=<prompt>` as a prefilled message. */
  supportsPrefill: boolean;
}

const LAUNCH: Record<Model, LaunchConfig> = {
  // Claude doesn't expose a documented prefill URL — we copy + open /new.
  Claude: { url: "https://claude.ai/new", supportsPrefill: false },
  // ChatGPT supports ?q= prefill on most sessions; falls back to clipboard
  // if the prefill is ignored.
  ChatGPT: { url: "https://chatgpt.com/", supportsPrefill: true },
  Gemini: { url: "https://gemini.google.com/app", supportsPrefill: false },
  Grok: { url: "https://grok.com/", supportsPrefill: false },
  Other: { url: "", supportsPrefill: false },
};

type Status = "idle" | "opened" | "copied" | "failed";

export function ModelPromptCopy() {
  const [selected, setSelected] = useState<Model>("Claude");
  const [status, setStatus] = useState<Status>("idle");

  const handleLaunch = async () => {
    const prompt = MODEL_EXPORT_PROMPTS[selected];

    // Always copy to clipboard first — this is the universal fallback.
    let copied = false;
    try {
      await navigator.clipboard.writeText(prompt);
      copied = true;
    } catch {
      copied = false;
    }

    const config = LAUNCH[selected];
    if (!config.url) {
      // Other — no URL to open, just copy.
      setStatus(copied ? "copied" : "failed");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    const url = config.supportsPrefill
      ? `${config.url}?q=${encodeURIComponent(prompt)}`
      : config.url;
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus(copied ? "opened" : "failed");
    setTimeout(() => setStatus("idle"), 3500);
  };

  const config = LAUNCH[selected];
  const buttonLabel =
    selected === "Other"
      ? status === "copied"
        ? "✓ Prompt copied"
        : "Copy the prompt"
      : status === "opened"
      ? `✓ Opening ${selected}…`
      : `Open ${selected} →`;

  const statusLine =
    status === "opened"
      ? config.supportsPrefill
        ? `Opened ${selected} with the prompt pre-filled. Hit send.`
        : `Prompt copied to your clipboard. Paste it in ${selected}.`
      : status === "copied"
      ? "Prompt copied. Open your AI and paste."
      : status === "failed"
      ? "Couldn't access your clipboard — try again."
      : selected === "Other"
      ? "We'll copy the prompt. Paste it into your AI of choice."
      : config.supportsPrefill
      ? `We'll open ${selected} with the prompt pre-filled.`
      : `We'll open ${selected} and copy the prompt for you to paste.`;

  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted mb-3">
          Which AI do you use?
        </p>
        <div className="flex flex-wrap gap-2">
          {MODELS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setSelected(m);
                setStatus("idle");
              }}
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
      </div>

      <button
        type="button"
        onClick={handleLaunch}
        className="w-full rounded-full h-14 bg-primary text-primary-foreground hover:bg-[#fcd34d] font-serif text-base btn-glow cursor-pointer transition-colors"
      >
        {buttonLabel}
      </button>

      <p
        className={`font-mono text-[10px] uppercase tracking-[0.22em] leading-relaxed transition-colors ${
          status === "failed"
            ? "text-rose-300"
            : status === "opened" || status === "copied"
            ? "text-primary"
            : "text-warm-muted"
        }`}
      >
        {statusLine}
      </p>
    </div>
  );
}
