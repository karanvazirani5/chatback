"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRawContext } from "@/lib/storage";
import { useAnalysis } from "@/lib/use-analysis";
import {
  FUTURE_YOU_SUGGESTED_PROMPTS,
  type FutureHorizon,
} from "@/lib/prompts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const HORIZONS: FutureHorizon[] = ["6 months", "1 year", "5 years"];

export default function FutureYouPage() {
  const router = useRouter();
  const { status, elapsedSeconds } = useAnalysis();
  const [horizon, setHorizon] = useState<FutureHorizon>("1 year");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "missing") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const context = getRawContext() ?? "";

    setInput("");
    setPending(true);

    const historyForApi = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/future-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horizon,
          context,
          history: historyForApi,
          message: trimmed,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res
          .json()
          .catch(() => ({ error: "stream failed" }));
        throw new Error(data.error ?? "stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Couldn't reach future-you.";
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: `[${errorMessage}]`,
        };
        return next;
      });
    } finally {
      setPending(false);
    }
  };

  if (status === "missing") return null;
  if (status === "loading") {
    return (
      <main className="flex-1 px-5 pt-6 pb-4 md:pt-10 max-w-2xl mx-auto w-full">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors"
          >
            ← Back
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            ✺ Future you
          </span>
        </header>
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 flex items-center justify-between gap-3">
          <p className="font-serif italic text-base text-warm">
            Reading your archive so future-you knows what you know now. Hang on…
          </p>
          <span className="font-mono text-xs tabular-nums text-primary/80 shrink-0">
            {elapsedSeconds ?? 0}s
          </span>
        </div>
      </main>
    );
  }
  if (status === "error") {
    return (
      <main className="flex-1 px-5 pt-6 pb-4 md:pt-10 max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-rose-300/30 bg-rose-950/20 p-5 font-serif italic text-base text-rose-100">
          Couldn&apos;t build your archive.{" "}
          <Link href="/" className="not-italic font-mono uppercase text-[10px] tracking-[0.22em] text-warm hover:text-primary ml-2">
            Try again →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 px-5 pt-6 pb-4 md:pt-10 max-w-2xl mx-auto w-full min-h-0">
      <header className="mb-5 flex items-center justify-between shrink-0">
        <Link
          href="/dashboard"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors"
        >
          ← Back
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          ✺ Future you
        </span>
      </header>

      <div className="flex flex-wrap gap-2 mb-6 shrink-0">
        {HORIZONS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setHorizon(h)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-serif italic border transition-colors cursor-pointer ${
              horizon === h
                ? "bg-primary text-primary-foreground border-primary"
                : "border-warm text-warm-muted hover:border-primary/60 hover:text-warm"
            }`}
          >
            +{h}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.length === 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-4">
              ✺ Try asking
            </p>
            <div className="flex flex-col gap-2">
              {FUTURE_YOU_SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="text-left px-4 py-3.5 rounded-xl border border-warm bg-surface/60 font-serif italic text-base text-warm hover:border-primary/60 hover:bg-surface transition-colors cursor-pointer"
                >
                  &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl ${
              m.role === "user"
                ? "bg-primary/[0.06] border border-primary/20 ml-6"
                : "bg-surface border border-primary/25 mr-6"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80 mb-2">
              {m.role === "user" ? "You, now" : `You, +${horizon}`}
            </p>
            <p className="font-serif text-lg text-warm leading-snug">
              {m.content}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask +${horizon} you anything…`}
          className="flex-1 h-12 text-base bg-surface border-warm focus-visible:ring-primary"
          disabled={pending}
        />
        <Button
          type="submit"
          disabled={!input.trim() || pending}
          size="lg"
          className="h-12 px-5 bg-primary text-primary-foreground hover:bg-[#fcd34d] font-serif italic rounded-full cursor-pointer"
        >
          Send
        </Button>
      </form>
    </main>
  );
}
