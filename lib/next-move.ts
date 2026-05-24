import "server-only";
import type { MasterAnalysis, NextMove } from "./types";
import { NextMoveSchema, SUBMIT_NEXT_MOVE_TOOL } from "./schema";
import { NEXT_MOVE_SYSTEM_PROMPT } from "./prompts";
import { chatJson, type JsonSchemaSpec } from "./llm";

const MODEL = "openclaw";
const MAX_TOKENS = 1500;

export async function generateNextMove({
  analysis,
  rawContext,
  excludeNames,
}: {
  analysis: MasterAnalysis;
  rawContext?: string;
  excludeNames: string[];
}): Promise<NextMove> {
  // Send the analysis (the action surfaces — loops + unfinished) and an
  // excerpt of raw context so the model can write a credible asset.
  const promptBody = [
    "ANALYSIS:",
    JSON.stringify(
      {
        themes: analysis.themes,
        open_loops: analysis.open_loops,
        unfinished: analysis.unfinished,
        decisions_made: analysis.decisions_made,
        this_week: analysis.this_week,
      },
      null,
      2
    ),
    "",
    rawContext
      ? `RAW CONTEXT (excerpt — use this for voice/specifics):\n${rawContext.slice(
          -4000
        )}`
      : "",
    "",
    excludeNames.length > 0
      ? `EXCLUDE_NAMES (already done or skipped — pick something else):\n${excludeNames
          .map((n) => `- ${n}`)
          .join("\n")}`
      : "EXCLUDE_NAMES: (none)",
  ]
    .filter(Boolean)
    .join("\n");

  const input = await chatJson({
    model: MODEL,
    maxTokens: MAX_TOKENS,
    system: NEXT_MOVE_SYSTEM_PROMPT,
    user: promptBody,
    schema: SUBMIT_NEXT_MOVE_TOOL as unknown as JsonSchemaSpec,
  });

  return NextMoveSchema.parse(input);
}
