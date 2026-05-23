import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { FUTURE_YOU_SYSTEM_PROMPT, type FutureHorizon } from "./prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface FutureYouMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamFutureYou({
  horizon,
  context,
  history,
  message,
}: {
  horizon: FutureHorizon;
  context: string;
  history: FutureYouMessage[];
  message: string;
}) {
  const system = FUTURE_YOU_SYSTEM_PROMPT(horizon, context);

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
