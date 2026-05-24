import "server-only";
import { PAST_YOU_SYSTEM_PROMPT } from "./prompts";
import { filterContextByCutoff } from "./dates";
import { chatStream } from "./llm";

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
}): Promise<AsyncIterable<string>> {
  const filtered = filterContextByEra(context, era);
  const system = PAST_YOU_SYSTEM_PROMPT(era, filtered);

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
