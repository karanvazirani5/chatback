/**
 * Extract the first ISO date (YYYY-MM-DD) found anywhere in a line.
 * Returns null if the line has no recognisable date.
 *
 * Handles common formats:
 *   [2024-01-08] - foo
 *   **2024-01-08**: foo
 *   2024-01-08 — foo
 *   - 2024-01-08: foo
 *   Date: 2024-01-08
 */
export function extractIsoDate(line: string): string | null {
  const match = line.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/**
 * Return sorted unique years (YYYY) that appear as ISO dates in the context.
 * Empty array if none found.
 */
export function yearsInContext(context: string): string[] {
  const seen = new Set<string>();
  for (const line of context.split("\n")) {
    const date = extractIsoDate(line);
    if (date) seen.add(date.slice(0, 4));
  }
  return [...seen].sort();
}

/**
 * Keep lines whose first ISO date is ≤ the cutoff. Lines without any date
 * are kept (the LLM filters them mentally via the system prompt).
 */
export function filterContextByCutoff(context: string, cutoffIso: string): string {
  return context
    .split("\n")
    .filter((line) => {
      const date = extractIsoDate(line);
      return !date || date <= cutoffIso;
    })
    .join("\n");
}
