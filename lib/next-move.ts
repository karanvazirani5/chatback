import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { MasterAnalysis, NextMove } from "./types";
import { NextMoveSchema, SUBMIT_NEXT_MOVE_TOOL } from "./schema";
import { NEXT_MOVE_SYSTEM_PROMPT } from "./prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5-20251001";
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

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    tools: [SUBMIT_NEXT_MOVE_TOOL as unknown as Anthropic.Tool],
    tool_choice: { type: "tool", name: "submit_next_move" },
    system: [
      {
        type: "text",
        text: NEXT_MOVE_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: promptBody }],
  });

  const toolUse = res.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Model did not return a next move.");
  }
  return NextMoveSchema.parse(toolUse.input);
}
