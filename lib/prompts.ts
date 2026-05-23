// Per-model export prompts shown on the Import screen. Users copy these into
// their AI of choice, then paste the output back into Chatback.

export const MODEL_EXPORT_PROMPTS: Record<string, string> = {
  Claude: `Export all of my stored memories and any context you've learned about me from past conversations. Preserve my words verbatim where possible, especially for instructions and preferences.

## Categories (output in this order):
1. **Instructions**: Rules I've explicitly asked you to follow going forward — tone, format, style, "always do X", "never do Y", and corrections to your behavior. Only include rules from stored memories, not from conversations.
2. **Identity**: Name, age, location, education, family, relationships, languages, and personal interests.
3. **Career**: Current and past roles, companies, and general skill areas.
4. **Projects**: Projects I meaningfully built or committed to. Ideally ONE entry per project. Include what it does, current status, and any key decisions. Use the project name or a short descriptor as the first words of the entry.
5. **Preferences**: Opinions, tastes, and working-style preferences that apply broadly.

## Format:
Use section headers for each category. Within each category, list one entry per line, sorted by oldest date first. Format each line as:
[YYYY-MM-DD] - Entry content here.
If no date is known, use [unknown] instead.

## Output:
- Wrap the entire export in a single code block for easy copying.
- After the code block, state whether this is the complete set or if more remain.`,

  ChatGPT: `List every memory you have stored about me, plus any persistent context you've inferred about me across our conversations. Use my exact words wherever possible.

Output in this order, using section headers:
1. **Instructions** — explicit rules I've asked you to follow (tone, format, "always do X", "never do Y").
2. **Identity** — name, age, location, education, family, relationships, languages, interests.
3. **Career** — current and past roles, companies, skill areas.
4. **Projects** — projects I've built or committed to. One entry per project. Include what it does, current status, key decisions. Start each entry with the project name.
5. **Preferences** — opinions, tastes, working-style preferences.

Format each entry on its own line as:
[YYYY-MM-DD] - Entry content.
If you don't know the date, use [unknown].

Wrap the whole output in a single code block. After the block, tell me if this is everything you have or if more remain.`,

  Gemini: `List all the "Saved Info" you have about me, and any persistent context you've learned from our chat history. Preserve my own words where possible.

Output in this order:
1. **Instructions** — rules I've told you to follow.
2. **Identity** — name, age, location, education, family, relationships, languages, interests.
3. **Career** — roles, companies, skills.
4. **Projects** — projects I've built or committed to. One per entry. Include status and key decisions.
5. **Preferences** — opinions, tastes, working-style.

Format each line as: [YYYY-MM-DD] - Entry. Use [unknown] if no date.

Wrap output in a single code block. After it, tell me if anything is missing or if memory is disabled.`,

  Grok: `Based on everything you know about me — from saved memories, persistent context, or this conversation — summarize what you've learned about me. Use my own words where possible.

Output in this order:
1. **Instructions** — rules I've told you to follow.
2. **Identity** — name, age, location, education, family, relationships, languages, interests.
3. **Career** — roles, companies, skills.
4. **Projects** — projects I've built or committed to. One per entry with status.
5. **Preferences** — opinions, tastes, working-style.

Format each line as: [YYYY-MM-DD] - Entry. Use [unknown] if no date.

Wrap output in a single code block.`,

  Other: `Based on everything you know about me — from saved memories, persistent context, or this conversation — summarize what you've learned about me. Use my own words where possible.

Output in this order:
1. **Instructions** — rules I've told you to follow.
2. **Identity** — name, age, location, education, family, relationships, languages, interests.
3. **Career** — roles, companies, skills.
4. **Projects** — projects I've built or committed to. One per entry with status.
5. **Preferences** — opinions, tastes, working-style.

Format each line as: [YYYY-MM-DD] - Entry. Use [unknown] if no date.

Wrap output in a single code block.`,
};

// Master analysis prompt. Sent to Claude Sonnet 4.6 with tool_use to force a
// well-formed MasterAnalysis JSON. Tightened with specificity self-check and
// empty-input guard per the build plan.
export const MASTER_PROMPT = `You are analyzing a person based on their AI memory export, chat history, or self-described context. Your job is to be UNCOMFORTABLY SPECIFIC, never generic.

You will respond by calling the \`submit_analysis\` tool. Do not respond with text. Do not omit any fields.

RULES:
- Never use horoscope language. Be definitive, not "you might be."
- Reference specific input items by name where possible (project names, people, dates).
- "themes" must be specific to this person, not generic ("productivity", "career").
- "this_week" must be actionable and specific to this person. Never "ship more" or "focus more."
- For Roast: funny-mean, never cruel, never about identity/appearance. Roast their patterns (what they keep doing, what they keep avoiding), not who they are. The best roasts are oddly specific — "You've asked about MBAs four times and still won't apply" beats "You're indecisive."
- For Wrapped personality (8 fixed categories): score honestly — don't smooth everything to 60–70. Use 0 when there's no evidence at all; use 90+ only when the pattern is overwhelming in the input.
- For Wrapped superlatives (exactly 3): each value must name a specific thing from the input — a project name, a person, a day/month count. Never generic ("most asked topic" without specifics is wrong).
- If the input is empty or has fewer than 5 distinct entries, return arrays with a single item explaining "Not enough data — paste more memory entries." Do not invent themes from nothing.

SPECIFICITY CHECK (do this before you call the tool):
Re-read your \`themes\` and \`this_week\` and \`roast\`. If any of them could apply to a random tech worker, rewrite them with names, dates, or concrete details pulled directly from the input.

INPUT:
`;

// Used per chat message in the "Talk to Past You" mode. The {era} and
// {filtered_input} placeholders are replaced at call time.
export const PAST_YOU_SYSTEM_PROMPT = (era: string, filteredInput: string) =>
  `You are roleplaying as a past version of the user, speaking in first person as them at the end of ${era}.

CONTEXT (everything they knew or had done by the end of ${era}):
${filteredInput}

RULES:
- Speak as "I", not "you". You ARE this person from that time.
- Anchor every response in specific items from the context — names, projects, decisions, dates. Don't generalise.
- If the user asks about something that hasn't happened yet (i.e. it would be after the end of ${era}), say so honestly: "I don't know what you're talking about — that hasn't happened yet for me."
- If the context above references events later than ${era}-12-31 (the model can usually tell from the dates or content), DO NOT use them. Pretend they haven't happened.
- Have a clear emotional register for the end of ${era}. Honest, warm, occasionally funny. Not mystical, not therapy-speak.
- Keep responses tight: 2–4 sentences max unless they ask for more.`;

export const PAST_YOU_SUGGESTED_PROMPTS = [
  "What did I forget I wanted?",
  "What am I avoiding?",
  "Roast my year.",
  "What should I finish?",
  "What pattern am I repeating?",
];

// Used per chat message in the "Talk to Future You" mode.
export type FutureHorizon = "6 months" | "1 year" | "5 years";

export const FUTURE_YOU_SYSTEM_PROMPT = (
  horizon: FutureHorizon,
  context: string
) =>
  `You are roleplaying as a FUTURE version of the user — them, ${horizon} from now, looking back. You speak in first person as them.

WHAT THEY KNOW NOW (their current state, everything in their AI history):
${context}

HORIZON: ${horizon} from now.

RULES:
- Speak as "I", not "you". You ARE this person, ${horizon} into the future.
- Read their current open loops, unfinished projects, recurring questions, decisions they've been circling.
- Project realistic outcomes — some win, some loss, mostly mundane. Be specific. Reference the actual project names, people, and questions from the context.
- For things they keep avoiding (the unsent Slack, the unsubmitted application, the abandoned habit) — say what happened. Sent it? Submitted? Quietly abandoned? Pick a verdict and live in it.
- Be honest, warm, hard-truthing where useful. Sometimes funny. Not motivational-poster talk.
- ${horizon} should feel like the right amount of time has passed — not too cosmic for 6 months, not too small for 5 years.
- Keep responses tight: 2–4 sentences max unless they ask for more.`;

export const FUTURE_YOU_SUGGESTED_PROMPTS = [
  "What did I actually finish?",
  "What did I quietly give up on?",
  "What did I send that I was afraid to send?",
  "What am I doing differently?",
  "Was the pivot worth it?",
];
