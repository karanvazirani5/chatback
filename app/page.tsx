"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelPromptCopy } from "@/components/import/ModelPromptCopy";
import { PrivacyWarning } from "@/components/import/PrivacyWarning";
import { SpotlightHero } from "@/components/SpotlightHero";
import { setAnalysis, setRawContext } from "@/lib/storage";
import { SAMPLE_ANALYSIS, SAMPLE_RAW_TEXT } from "@/lib/sample-data";
import { startAnalysisJob, resetAnalysisJob } from "@/lib/analysis-job";
import { recordAnalysisSnapshot } from "@/lib/analysis-history";
import {
  parseOpenAiExport,
  type OpenAiExtractResult,
} from "@/lib/openai-export";

type TabKey = "file" | "paste";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("file");
  const [pasteText, setPasteText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<OpenAiExtractResult | null>(
    null
  );
  const [fileText, setFileText] = useState<string>("");
  const [parsingFile, setParsingFile] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    setFilePreview(null);
    setFileText("");
    setParsingFile(true);
    try {
      if (file.name.toLowerCase().endsWith(".zip")) {
        throw new Error(
          "Unzip first and drop the conversations.json file from inside."
        );
      }
      const text = await file.text();
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          "This file isn't valid JSON. Make sure you've selected conversations.json from the OpenAI export."
        );
      }
      const result = parseOpenAiExport(json);
      if (!result.text.trim()) {
        throw new Error("No conversations found in the file.");
      }
      setFilePreview(result);
      setFileText(result.text);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't read that file. Make sure it's the conversations.json from an OpenAI export."
      );
      setFileName(null);
    } finally {
      setParsingFile(false);
    }
  };

  const composeInput = (): string => {
    if (activeTab === "file") return fileText.trim();
    return pasteText.trim();
  };

  const handleBuild = () => {
    const text = composeInput();
    if (!text) {
      setError(
        activeTab === "file"
          ? "Drop your conversations.json file first."
          : "Paste your export first, or try the sample data."
      );
      return;
    }
    setError(null);
    startAnalysisJob(text);
    router.push("/dashboard");
  };

  const handleSample = () => {
    resetAnalysisJob();
    setAnalysis(SAMPLE_ANALYSIS);
    setRawContext(SAMPLE_RAW_TEXT);
    recordAnalysisSnapshot(SAMPLE_ANALYSIS);
    router.push("/dashboard");
  };

  return (
    <main className="flex-1 px-5 pt-14 pb-16 md:pt-24 md:pb-24 max-w-2xl mx-auto w-full">
      <SpotlightHero>
        <header className="mb-16 md:mb-24 relative">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.32em] mb-5 shimmer-text fade-up"
            style={{ ["--i" as never]: 0 }}
          >
            ✺ Issue №01 · A self-portrait
          </p>
          <h1
            className="font-serif text-[15vw] md:text-9xl tracking-[-0.04em] leading-[0.85] text-warm fade-up"
            style={{ ["--i" as never]: 1 }}
          >
            Chat<span className="italic text-primary">back</span>.
          </h1>
          <p
            className="mt-7 max-w-md font-serif text-2xl md:text-[28px] leading-[1.25] text-warm-muted italic fade-up"
            style={{ ["--i" as never]: 2 }}
          >
            Talk to the person{" "}
            <span className="text-warm">your AI history</span> remembers.
          </p>
        </header>
      </SpotlightHero>

      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
          § Begin
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-warm leading-[1.05] mb-2">
          Drop your AI history.
        </h2>
        <p className="text-warm-muted text-base mb-7">Two ways. Pick yours.</p>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-7 bg-transparent p-0 h-auto border-b border-warm rounded-none gap-0">
            <TabsTrigger
              value="file"
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-warm data-[state=active]:shadow-none text-warm-muted py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-warm transition-colors"
            >
              Import file
            </TabsTrigger>
            <TabsTrigger
              value="paste"
              className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-warm data-[state=active]:shadow-none text-warm-muted py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-warm transition-colors"
            >
              Paste from AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 mt-0">
            <FileDrop
              inputRef={fileInputRef}
              fileName={fileName}
              parsing={parsingFile}
              preview={filePreview}
              onPick={() => fileInputRef.current?.click()}
              onSelected={handleFile}
            />
            <details className="text-xs text-warm-muted leading-relaxed group">
              <summary className="cursor-pointer text-warm/80 hover:text-warm font-mono uppercase tracking-[0.18em] text-[10px] list-none [&::-webkit-details-marker]:hidden">
                <span className="text-primary mr-1">→</span> How do I get this
                file from ChatGPT?
              </summary>
              <ol className="mt-3 space-y-1.5 list-decimal pl-5 text-warm-muted">
                <li>
                  In ChatGPT: Settings → Data Controls → <em>Export data</em>.
                </li>
                <li>Wait for the email from OpenAI (5–30 minutes).</li>
                <li>Download the ZIP and unzip it.</li>
                <li>
                  Drop <code className="font-mono text-primary">conversations.json</code>{" "}
                  from inside.
                </li>
              </ol>
            </details>
          </TabsContent>

          <TabsContent value="paste" className="space-y-5 mt-0">
            <ModelPromptCopy />
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted mb-2 block">
                Paste the export here
              </label>
              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste the output from your AI here…"
                rows={10}
                className="font-mono text-xs bg-surface border-warm focus-visible:ring-primary"
              />
            </div>
          </TabsContent>
        </Tabs>

        <PrivacyWarning />

        {error && (
          <p
            className="font-serif text-base italic text-rose-300 mt-5"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-10">
          <button
            type="button"
            onClick={handleSample}
            className="flex-1 font-mono text-[11px] uppercase tracking-[0.22em] text-warm-muted hover:text-warm transition-colors py-3"
          >
            Try with sample data
          </button>
          <Button
            onClick={handleBuild}
            size="lg"
            className="flex-1 h-14 text-base font-serif tracking-tight bg-primary text-primary-foreground hover:bg-[#fcd34d] rounded-full btn-glow cursor-pointer"
          >
            Build my archive →
          </Button>
        </div>
      </section>

      <footer className="mt-24 pt-8 border-t border-warm flex items-center justify-between text-warm-muted">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
          chatback.app
        </p>
        <p className="font-serif italic text-sm">
          a quiet mirror, not a productivity tool.
        </p>
      </footer>
    </main>
  );
}

interface FileDropProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  fileName: string | null;
  parsing: boolean;
  preview: OpenAiExtractResult | null;
  onPick: () => void;
  onSelected: (file: File) => void;
}

function FileDrop({
  inputRef,
  fileName,
  parsing,
  preview,
  onPick,
  onSelected,
}: FileDropProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelected(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={onPick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onSelected(f);
        }}
        className={`w-full rounded-2xl border border-dashed p-8 text-center transition-colors cursor-pointer ${
          dragging
            ? "border-primary bg-primary/[0.06]"
            : "border-warm-strong bg-surface/40 hover:border-primary/60 hover:bg-surface"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-3">
          ✺ Drop in
        </p>
        <p className="font-serif text-2xl text-warm">
          conversations.json
        </p>
        <p className="mt-2 text-sm text-warm-muted">
          or tap to browse · JSON only · unzip first
        </p>
      </button>

      {parsing && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-warm-muted">
          Reading {fileName}…
        </p>
      )}

      {preview && !parsing && (
        <div className="mt-3 rounded-lg border border-primary/30 bg-primary/[0.06] px-4 py-3 text-sm text-warm flex items-center justify-between gap-3">
          <p>
            <span className="text-primary font-mono">✓</span>{" "}
            <span className="font-serif italic">{fileName}</span> ·{" "}
            <span className="text-warm-muted">
              {preview.totalConversations} conversations found
              {preview.includedConversations !== preview.totalConversations && (
                <>
                  {" "}
                  · keeping most recent {preview.includedConversations}
                </>
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
