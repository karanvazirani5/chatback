import "server-only";
import { FUTURE_YOU_SYSTEM_PROMPT, type FutureHorizon } from "./prompts";
import { chatStream } from "./llm";

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
}): Promise<AsyncIterable<string>> {
  const system = FUTURE_YOU_SYSTEM_PROMPT(horizon, context);

  return chatStream({
    model: "openclaw",
    maxTokens: 600,
    system,
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: message },
    ],
  });
}
