/**
 * Parser for OpenAI's chat-export `conversations.json` file (the one you
 * get when you request your data export from ChatGPT). Turns it into the
 * dated text format Chatback's master analysis expects.
 *
 * The export is a top-level array of conversation objects. Each has a
 * `title`, `create_time` (unix seconds, float), and a `mapping` of
 * message nodes. Each node may contain a `message` with `author.role`
 * and `content.parts` (array of strings). We pull title + first user
 * message per conversation, sort newest-first, and cap the total size.
 */

interface RawMessageNode {
  id?: string;
  message?: {
    author?: { role?: string };
    create_time?: number;
    content?: {
      content_type?: string;
      parts?: unknown[];
    };
  };
  parent?: string | null;
  children?: string[];
}

interface RawConversation {
  title?: string;
  create_time?: number;
  update_time?: number;
  mapping?: Record<string, RawMessageNode>;
}

const MAX_EXTRACT_CHARS = 28_000; // headroom under the /api/analyze 30k cap
const EXCERPT_CHARS = 120;

export interface OpenAiExtractResult {
  /** Dated text formatted for the master analysis. */
  text: string;
  /** Total conversations seen in the file. */
  totalConversations: number;
  /** Conversations included after the size cap. */
  includedConversations: number;
}

export function parseOpenAiExport(raw: unknown): OpenAiExtractResult {
  if (!Array.isArray(raw)) {
    throw new Error(
      "This doesn't look like an OpenAI export. Expected an array of conversations at the top level."
    );
  }

  const lines: { date: string; sortKey: number; line: string }[] = [];

  for (const convo of raw as RawConversation[]) {
    if (!convo || typeof convo !== "object") continue;
    const title = (convo.title ?? "").toString().trim();
    const createTime =
      typeof convo.create_time === "number" ? convo.create_time : 0;
    const date = formatDate(createTime);
    const sortKey = createTime || 0;

    const firstUserMessage = findFirstUserMessage(convo.mapping);
    const excerpt = firstUserMessage
      ? truncate(collapseWhitespace(firstUserMessage), EXCERPT_CHARS)
      : "";

    const header = title || "(untitled)";
    let line = `[${date}] ${header}`;
    if (excerpt && excerpt.toLowerCase() !== header.toLowerCase()) {
      line += `\n  > ${excerpt}`;
    }
    lines.push({ date, sortKey, line });
  }

  // Sort newest first so the size cap drops oldest conversations.
  lines.sort((a, b) => b.sortKey - a.sortKey);

  let total = 0;
  const kept: string[] = [];
  for (const { line } of lines) {
    if (total + line.length + 1 > MAX_EXTRACT_CHARS) break;
    kept.push(line);
    total += line.length + 1;
  }

  // For the LLM, present chronologically (oldest first) — easier to spot patterns over time.
  kept.reverse();

  return {
    text: kept.join("\n"),
    totalConversations: lines.length,
    includedConversations: kept.length,
  };
}

function findFirstUserMessage(
  mapping?: Record<string, RawMessageNode>
): string | null {
  if (!mapping) return null;
  let best: { time: number; text: string } | null = null;
  for (const node of Object.values(mapping)) {
    const m = node.message;
    if (!m || m.author?.role !== "user") continue;
    if (m.content?.content_type && m.content.content_type !== "text") continue;
    const parts = m.content?.parts ?? [];
    const text = parts
      .filter((p): p is string => typeof p === "string")
      .join(" ")
      .trim();
    if (!text) continue;
    const time = typeof m.create_time === "number" ? m.create_time : 0;
    if (!best || time < best.time) {
      best = { time, text };
    }
  }
  return best?.text ?? null;
}

function formatDate(unixSeconds: number): string {
  if (!unixSeconds || !Number.isFinite(unixSeconds)) return "unknown";
  const d = new Date(unixSeconds * 1000);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toISOString().slice(0, 10);
}

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
