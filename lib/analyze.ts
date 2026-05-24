import "server-only";
import { z } from "zod";
import type { MasterAnalysis } from "./types";
import { MasterAnalysisSchema, SUBMIT_ANALYSIS_TOOL } from "./schema";
import { MASTER_PROMPT } from "./prompts";
import { chatJson, type JsonSchemaSpec } from "./llm";

// Haiku 4.5 instead of Sonnet 4.6: ~3-5x faster, comfortably under the 60s
// function timeout. Quality stays high because the forced tool call + strict
// schema do most of the heavy lifting — the model just fills in fields.
const ANALYZE_MODEL = "openclaw";
const MAX_TOKENS = 4500;

async function callModel(
  rawText: string,
  retryReason?: string
): Promise<unknown> {
  const userContent = retryReason
    ? `INPUT:\n${rawText}\n\nIMPORTANT — your previous attempt was rejected: ${retryReason}. This time, populate EVERY required field. Use "Not enough data to say honestly" for any field you genuinely can't fill, but never omit a field.`
    : `INPUT:\n${rawText}`;

  return chatJson({
    model: ANALYZE_MODEL,
    maxTokens: MAX_TOKENS,
    system: MASTER_PROMPT,
    user: userContent,
    schema: SUBMIT_ANALYSIS_TOOL as unknown as JsonSchemaSpec,
  });
}

export async function analyzeArchive(rawText: string): Promise<MasterAnalysis> {
  // First attempt.
  const firstInput = await callModel(rawText);
  const firstParse = MasterAnalysisSchema.safeParse(firstInput);
  if (firstParse.success) return firstParse.data;

  // Retry once with a stricter nudge if schema validation failed.
  const reason = summariseZodError(firstParse.error);
  console.warn("[analyze] first attempt invalid:", reason, {
    issues: firstParse.error.issues,
  });
  const secondInput = await callModel(rawText, reason);
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
