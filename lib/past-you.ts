import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { PAST_YOU_SYSTEM_PROMPT } from "./prompts";
import { filterContextByCutoff } from "./dates";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PastYouMessage {
  role: "user" | "assistant";
  content: string;
}

export function filterContextByEra(context: string, era: string): string {
  return filterContextByCutoff(context, `${era}-12-31`);
}

export async function streamPastYou({
  era,
  context,
  history,
  message,
}: {
  era: string;
  context: string;
  history: PastYouMessage[];
  message: string;
}) {
  const filtered = filterContextByEra(context, era);
  const system = PAST_YOU_SYSTEM_PROMPT(era, filtered);

  return client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: message },
    ],
  });
}
