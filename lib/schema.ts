import { z } from "zod";

const ThemeSchema = z.object({
  theme: z.string().min(1),
  count: z.number().int().nonnegative(),
  description: z.string().min(1),
});

const OpenLoopSchema = z.object({
  question: z.string().min(1),
  first_seen: z.string().min(1),
  times_asked: z.number().int().nonnegative(),
  notes: z.string(),
});

const DecisionSchema = z.object({
  topic: z.string().min(1),
  evidence: z.string(),
  verdict: z.string().min(1),
});

const UnfinishedSchema = z.object({
  name: z.string().min(1),
  mentions: z.number().int().nonnegative(),
  recommendation: z.enum(["kill", "revive", "ship_small"]),
  why: z.string().min(1),
});

const WrappedNumberSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const pct = () => z.number().int().min(0).max(100);

const WrappedFixedPersonalitySchema = z.object({
  founder_brain: pct(),
  overthinker: pct(),
  looper: pct(),
  decisiveness: pct(),
  ship_rate: pct(),
  habit_graveyard: pct(),
  self_doubt: pct(),
  optimism: pct(),
});

const WrappedSuperlativeSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const WrappedStatsSchema = z.object({
  archetype: z.string().min(1),
  tagline: z.string().min(1),
  numbers: z.array(WrappedNumberSchema).min(4).max(6),
  personality: WrappedFixedPersonalitySchema,
  superlatives: z.array(WrappedSuperlativeSchema).length(3),
});

const GraveyardEntrySchema = z.object({
  idea: z.string().min(1),
  verdict: z.enum(["dead", "distraction", "revive"]),
});

const ViralModesSchema = z.object({
  roast: z.string().min(1),
  wrapped: WrappedStatsSchema,
  graveyard: z.array(GraveyardEntrySchema),
  forgot_wanted: z.string().min(1),
  future_letter: z.string().min(1),
  founder_scan: z.string().min(1),
});

export const MasterAnalysisSchema = z.object({
  themes: z.array(ThemeSchema).min(1).max(4),
  open_loops: z.array(OpenLoopSchema).max(4),
  decisions_made: z.array(DecisionSchema).max(3),
  this_week: z.string().min(1),
  unfinished: z.array(UnfinishedSchema).max(4),
  viral_modes: ViralModesSchema,
});

export const NextMoveSchema = z.object({
  source_type: z.enum(["unfinished", "open_loop"]),
  source_name: z.string().min(1),
  headline: z.string().min(1),
  action: z.string().min(1),
  asset_label: z.string().min(1),
  asset_text: z.string().min(1),
});

export const SUBMIT_NEXT_MOVE_TOOL = {
  name: "submit_next_move",
  description:
    "Submit the one next move the user should make this week, plus the paste-ready asset they need to actually do it.",
  input_schema: {
    type: "object",
    required: [
      "source_type",
      "source_name",
      "headline",
      "action",
      "asset_label",
      "asset_text",
    ],
    properties: {
      source_type: {
        type: "string",
        enum: ["unfinished", "open_loop"],
        description:
          "Which list this move comes from — an unfinished project or an open loop question.",
      },
      source_name: {
        type: "string",
        description:
          "EXACT name (for Unfinished) or question (for OpenLoop) from the input. Match character-for-character so the dedupe key works.",
      },
      headline: {
        type: "string",
        description:
          "3–6 word imperative headline. e.g. 'Send the Devon Slack', 'Publish Receipts #4', 'Submit the a16z form'.",
      },
      action: {
        type: "string",
        description:
          "One short paragraph (1–2 sentences) saying what to do and why it's the right next step.",
      },
      asset_label: {
        type: "string",
        description:
          "Noun label for the asset — e.g. 'Slack draft', 'Substack intro', 'Application answer', 'Email reply'.",
      },
      asset_text: {
        type: "string",
        description:
          "PASTE-READY first-person asset the user can use immediately. NOT 'you could write…' — write it as them. 40–180 words. Match their actual situation (project names, people, decisions from the input). Tone: theirs, not corporate.",
      },
    },
  },
} as const;

// JSON Schema (Anthropic tool input_schema). Mirrors the zod schema above.
// Kept inline rather than generated so the model sees exactly what we want.
export const SUBMIT_ANALYSIS_TOOL = {
  name: "submit_analysis",
  description:
    "Submit the complete Chatback analysis of the user. All fields are required. Every field must reference specifics from the input — never use generic horoscope-style language.",
  input_schema: {
    type: "object",
    required: [
      "themes",
      "open_loops",
      "decisions_made",
      "this_week",
      "unfinished",
      "viral_modes",
    ],
    properties: {
      themes: {
        type: "array",
        description:
          "Top themes the user has been thinking about. 1–4 items, ranked by frequency.",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "object",
          required: ["theme", "count", "description"],
          properties: {
            theme: {
              type: "string",
              description:
                "Specific theme name, not a category. e.g. 'Should I leave PM for engineering' not 'career'.",
            },
            count: {
              type: "integer",
              description:
                "How many times this theme appears in the input (approximate is fine).",
            },
            description: {
              type: "string",
              description:
                "One sentence describing the specific shape this theme takes for this person.",
            },
          },
        },
      },
      open_loops: {
        type: "array",
        description:
          "Unresolved questions or commitments. Up to 4 items.",
        maxItems: 4,
        items: {
          type: "object",
          required: ["question", "first_seen", "times_asked", "notes"],
          properties: {
            question: { type: "string" },
            first_seen: {
              type: "string",
              description:
                "ISO date (YYYY-MM-DD) if known, or 'approx 2024-Q3' style if approximate.",
            },
            times_asked: { type: "integer" },
            notes: {
              type: "string",
              description: "One line on why it's still unresolved.",
            },
          },
        },
      },
      decisions_made: {
        type: "array",
        description:
          "Topics the user has stopped circling — they've effectively decided. Up to 3 items.",
        maxItems: 3,
        items: {
          type: "object",
          required: ["topic", "evidence", "verdict"],
          properties: {
            topic: { type: "string" },
            evidence: {
              type: "string",
              description: "Why you think they've decided.",
            },
            verdict: {
              type: "string",
              description:
                "The decision in their voice — present tense, definitive.",
            },
          },
        },
      },
      this_week: {
        type: "string",
        description:
          "One bold, specific recommendation grounded in the patterns above. Never generic. Reference a specific project, person, or commitment by name.",
      },
      unfinished: {
        type: "array",
        description:
          "Projects or ideas mentioned multiple times that aren't shipped. Up to 4 items.",
        maxItems: 4,
        items: {
          type: "object",
          required: ["name", "mentions", "recommendation", "why"],
          properties: {
            name: { type: "string" },
            mentions: { type: "integer" },
            recommendation: {
              type: "string",
              enum: ["kill", "revive", "ship_small"],
            },
            why: {
              type: "string",
              description: "One sentence justifying the recommendation.",
            },
          },
        },
      },
      viral_modes: {
        type: "object",
        required: [
          "roast",
          "wrapped",
          "graveyard",
          "forgot_wanted",
          "future_letter",
          "founder_scan",
        ],
        properties: {
          roast: {
            type: "string",
            description:
              "One funny-mean line about their patterns. Not cruel. Not about identity or appearance. Specific to what they keep doing or avoiding.",
          },
          wrapped: {
            type: "object",
            description:
              "An AI Wrapped recap. archetype/tagline/numbers/superlatives are PERSONALISED to this user. personality scores use a FIXED set of 8 universal categories so users can compare with each other — only the 0–100 values change.",
            required: [
              "archetype",
              "tagline",
              "numbers",
              "personality",
              "superlatives",
            ],
            properties: {
              archetype: {
                type: "string",
                description:
                  "Short noun-phrase archetype derived from the user's patterns. Examples by feel: 'The Drafter', 'The Optimizer', 'The Pivoter', 'The Looper', 'The Researcher Who Won't Ship'. INVENT a fitting one — don't reuse these unless they truly fit.",
              },
              tagline: {
                type: "string",
                description:
                  "One bold line summarising the year. Numeric and specific is best, e.g. '247 questions, 5 drafts, 1 thing shipped'.",
              },
              numbers: {
                type: "array",
                description:
                  "4–6 numeric facts about the user, pulled or estimated from the input. Each should feel earned and specific — e.g. {value: '17', label: 'times you redrafted the same Slack'}. Avoid generic stats like 'total messages'. The value field is a string so you can include suffixes (K, %, $).",
                minItems: 4,
                maxItems: 6,
                items: {
                  type: "object",
                  required: ["value", "label"],
                  properties: {
                    value: { type: "string" },
                    label: { type: "string" },
                  },
                },
              },
              personality: {
                type: "object",
                description:
                  "Eight UNIVERSAL personality dimensions, every user gets the same eight, scored 0–100 based on what the input actually shows. Score honestly: don't smooth everything to 60–70. Use 0 when there's no evidence at all; use 90+ only when the pattern is overwhelming. The eight categories: 1) founder_brain — frames things as 'should I build / ship / launch / start' / scoping a product; 2) overthinker — multi-paragraph philosophical questions, decisions re-litigated multiple times; 3) looper — re-asks the same question across the year (same Slack draft, same MBA debate); 4) decisiveness — ratio of decisions actually made vs questions left open; 5) ship_rate — ratio of things started to things shipped; 6) habit_graveyard — how many habits, routines, or side projects were abandoned in the data; 7) self_doubt — asks for validation, hedges, second-guesses; 8) optimism — forward-leaning language vs complaint/anxiety.",
                required: [
                  "founder_brain",
                  "overthinker",
                  "looper",
                  "decisiveness",
                  "ship_rate",
                  "habit_graveyard",
                  "self_doubt",
                  "optimism",
                ],
                properties: {
                  founder_brain: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                  },
                  overthinker: { type: "integer", minimum: 0, maximum: 100 },
                  looper: { type: "integer", minimum: 0, maximum: 100 },
                  decisiveness: { type: "integer", minimum: 0, maximum: 100 },
                  ship_rate: { type: "integer", minimum: 0, maximum: 100 },
                  habit_graveyard: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                  },
                  self_doubt: { type: "integer", minimum: 0, maximum: 100 },
                  optimism: { type: "integer", minimum: 0, maximum: 100 },
                },
              },
              superlatives: {
                type: "array",
                description:
                  "EXACTLY 3 fun-fact superlatives. Each value MUST point at something specific from the input — a project name, a count, a duration in days/months. NEVER generic. Good examples: {label:'Longest open loop', value:'a16z Scout application — open 252 days'}, {label:'Most-redrafted message', value:'Devon Slack about status pings — 3 drafts, 0 sent'}, {label:'Most consistent habit', value:'Bouldering at Brooklyn Boulders — 11 months running'}. Avoid generic labels like 'most asked topic' if the value isn't specific.",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  required: ["label", "value"],
                  properties: {
                    label: { type: "string" },
                    value: { type: "string" },
                  },
                },
              },
            },
          },
          graveyard: {
            type: "array",
            description: "Ideas the user has stopped pursuing.",
            items: {
              type: "object",
              required: ["idea", "verdict"],
              properties: {
                idea: { type: "string" },
                verdict: {
                  type: "string",
                  enum: ["dead", "distraction", "revive"],
                },
              },
            },
          },
          forgot_wanted: {
            type: "string",
            description:
              "One line about a buried goal — something they said they wanted and stopped pursuing.",
          },
          future_letter: {
            type: "string",
            description:
              "2–3 sentences as a letter from the user 6 months in the future, referencing specifics from the input.",
          },
          founder_scan: {
            type: "string",
            description:
              "Archetype name followed by a colon and a one-line diagnostic. e.g. 'The Drafter: more unfinished documents than finished decisions.'",
          },
        },
      },
    },
  },
} as const;
