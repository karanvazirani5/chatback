import "server-only";

function endpoint() {
  const base = process.env.LLM_BASE_URL;
  const key = process.env.LLM_API_KEY;
  if (!base) throw new Error("LLM_BASE_URL is not set.");
  if (!key) throw new Error("LLM_API_KEY is not set.");
  return {
    url: `${base.replace(/\/$/, "")}/chat/completions`,
    key,
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface JsonSchemaSpec {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

interface ChatJsonInput {
  model: string;
  maxTokens: number;
  system: string;
  user: string;
  schema: JsonSchemaSpec;
}

// The upstream proxy ignores OpenAI `tools` and `response_format`, so we
// inject the JSON schema into the system prompt and parse the model's text
// reply ourselves (stripping fences / surrounding prose if needed).
export async function chatJson<T = unknown>({
  model,
  maxTokens,
  system,
  user,
  schema,
}: ChatJsonInput): Promise<T> {
  const { url, key } = endpoint();

  const enrichedSystem = [
    system,
    "",
    `OUTPUT FORMAT — you MUST reply with a SINGLE JSON object matching the schema below. No prose, no commentary, no markdown code fences.`,
    "",
    `SCHEMA — "${schema.name}": ${schema.description}`,
    JSON.stringify(schema.input_schema, null, 2),
  ].join("\n");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: enrichedSystem },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LLM ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.length === 0) {
    throw new Error("LLM returned no content.");
  }

  return parseJsonLoose(content) as T;
}

function parseJsonLoose(text: string): unknown {
  let s = text.trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fence) s = fence[1].trim();
  if (!s.startsWith("{")) {
    const first = s.indexOf("{");
    const last = s.lastIndexOf("}");
    if (first !== -1 && last > first) {
      s = s.slice(first, last + 1);
    }
  }
  return JSON.parse(s);
}

interface ChatStreamInput {
  model: string;
  maxTokens: number;
  system: string;
  messages: ChatMessage[];
}

export async function chatStream({
  model,
  maxTokens,
  system,
  messages,
}: ChatStreamInput): Promise<AsyncIterable<string>> {
  const { url, key } = endpoint();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`LLM ${res.status}: ${body.slice(0, 500)}`);
  }

  return parseSseTextDeltas(res.body);
}

async function* parseSseTextDeltas(
  body: ReadableStream<Uint8Array>
): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          yield delta;
        }
      } catch {
        // Skip malformed SSE chunks.
      }
    }
  }
}
