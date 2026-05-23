import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { MasterAnalysis } from "./types";
import { MasterAnalysisSchema, SUBMIT_ANALYSIS_TOOL } from "./schema";
import { MASTER_PROMPT } from "./prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Haiku 4.5 instead of Sonnet 4.6: ~3-5x faster, comfortably under the 60s
// function timeout. Quality stays high because tool_use + the strict
// input_schema do most of the heavy lifting — the model just has to fill in
// fields, not invent the structure.
const ANALYZE_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 4500;

async function callModel(rawText: string, retryReason?: string) {
  const userContent = retryReason
    ? `INPUT:\n${rawText}\n\nIMPORTANT — your previous attempt was rejected: ${retryReason}. This time, populate EVERY required field. Use "Not enough data to say honestly" for any field you genuinely can't fill, but never omit a field.`
    : `INPUT:\n${rawText}`;

  return client.messages.create({
    model: ANALYZE_MODEL,
    max_tokens: MAX_TOKENS,
    tools: [SUBMIT_ANALYSIS_TOOL as unknown as Anthropic.Tool],
    tool_choice: { type: "tool", name: "submit_analysis" },
    system: [
      {
        type: "text",
        text: MASTER_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });
}

function extractToolInput(res: Anthropic.Message): unknown {
  const toolUse = res.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Claude did not call submit_analysis.");
  }
  return toolUse.input;
}

export async function analyzeArchive(rawText: string): Promise<MasterAnalysis> {
  // First attempt.
  const first = await callModel(rawText);
  const firstInput = extractToolInput(first);
  const firstParse = MasterAnalysisSchema.safeParse(firstInput);
  if (firstParse.success) return firstParse.data;

  // Retry once with a stricter nudge if schema validation failed.
  const reason = summariseZodError(firstParse.error);
  console.warn("[analyze] first attempt invalid:", reason, {
    issues: firstParse.error.issues,
  });
  const second = await callModel(rawText, reason);
  const secondInput = extractToolInput(second);
  const secondParse = MasterAnalysisSchema.safeParse(secondInput);
  if (secondParse.success) return secondParse.data;

  console.error("[analyze] retry also invalid:", {
    summary: summariseZodError(secondParse.error),
    issues: secondParse.error.issues,
    receivedSnippet: JSON.stringify(secondInput).slice(0, 800),
  });
  throw new Error(
    "Got a partial result twice. Try the sample data, or paste a different / longer excerpt."
  );
}

function summariseZodError(err: z.ZodError): string {
  const issues = err.issues.slice(0, 3).map((i) => {
    const path = i.path.join(".");
    return `${path || "(root)"}: ${i.message}`;
  });
  return issues.join("; ");
}
