export interface Theme {
  theme: string;
  count: number;
  description: string;
}

export interface OpenLoop {
  question: string;
  first_seen: string;
  times_asked: number;
  notes: string;
}

export interface Decision {
  topic: string;
  evidence: string;
  verdict: string;
}

export type Recommendation = "kill" | "revive" | "ship_small";

export interface Unfinished {
  name: string;
  mentions: number;
  recommendation: Recommendation;
  why: string;
}

export interface WrappedNumber {
  /** The big mono number. Can include suffix like "K" or prefix like "$". */
  value: string;
  /** One- or two-word label below the number. */
  label: string;
}

/**
 * Universal personality categories — same 8 for every user, scored 0-100
 * based on their data. Fixed so people can compare with friends.
 */
export interface WrappedFixedPersonality {
  founder_brain: number;
  overthinker: number;
  looper: number;
  decisiveness: number;
  ship_rate: number;
  habit_graveyard: number;
  self_doubt: number;
  optimism: number;
}

export interface WrappedSuperlative {
  /** Short category name, e.g. "Longest open loop". */
  label: string;
  /** Specific value referencing the user's data, e.g. "a16z Scout app — 252 days open". */
  value: string;
}

export interface WrappedStats {
  /** Short archetype noun phrase, e.g. "The Drafter". */
  archetype: string;
  /** One-line tagline that summarises the year. */
  tagline: string;
  /** 4–6 specific numeric facts, mono-numerals. */
  numbers: WrappedNumber[];
  /** Eight universal personality categories with personalised 0–100 values. */
  personality: WrappedFixedPersonality;
  /** Exactly 3 fun-fact superlatives, each pointing at specific data. */
  superlatives: WrappedSuperlative[];
}

/** Display metadata for the eight fixed personality bars. */
export const PERSONALITY_META: ReadonlyArray<{
  key: keyof WrappedFixedPersonality;
  label: string;
  emoji: string;
}> = [
  { key: "founder_brain", label: "Founder brain", emoji: "🚀" },
  { key: "overthinker", label: "Overthinker", emoji: "🌀" },
  { key: "looper", label: "Looper", emoji: "🔁" },
  { key: "decisiveness", label: "Decisiveness", emoji: "🎯" },
  { key: "ship_rate", label: "Ship rate", emoji: "📦" },
  { key: "habit_graveyard", label: "Habit graveyard", emoji: "💀" },
  { key: "self_doubt", label: "Self-doubt", emoji: "😬" },
  { key: "optimism", label: "Optimism", emoji: "🌱" },
];

export type GraveyardVerdict = "dead" | "distraction" | "revive";

export interface GraveyardEntry {
  idea: string;
  verdict: GraveyardVerdict;
}

export interface ViralModes {
  roast: string;
  wrapped: WrappedStats;
  graveyard: GraveyardEntry[];
  forgot_wanted: string;
  future_letter: string;
  founder_scan: string;
}

export interface MasterAnalysis {
  themes: Theme[];
  open_loops: OpenLoop[];
  decisions_made: Decision[];
  this_week: string;
  unfinished: Unfinished[];
  viral_modes: ViralModes;
}

export type NextMoveSourceType = "unfinished" | "open_loop";

export interface NextMove {
  source_type: NextMoveSourceType;
  /** Exact name/question of the source item — used as the dedupe key. */
  source_name: string;
  /** 3–6 word imperative headline. e.g. "Send the Devon Slack". */
  headline: string;
  /** One-paragraph framing of the action. */
  action: string;
  /** Short noun label for the asset, e.g. "Slack draft", "Substack intro". */
  asset_label: string;
  /** Paste-ready first-person asset the user can actually use. */
  asset_text: string;
}

export type ModeId =
  | "roast"
  | "wrapped"
  | "graveyard"
  | "forgot"
  | "future"
  | "founder"
  | "past-you"
  | "future-you";

export interface ModeDescriptor {
  id: ModeId;
  emoji: string;
  label: string;
  href: string;
}

export const MODES: ModeDescriptor[] = [
  { id: "past-you", emoji: "🕵️", label: "Talk to Past You", href: "/mode/past-you" },
  { id: "future-you", emoji: "🔮", label: "Talk to Future You", href: "/mode/future-you" },
  { id: "roast", emoji: "🔥", label: "Roast My History", href: "/mode/roast" },
  { id: "wrapped", emoji: "🎁", label: "AI Wrapped", href: "/mode/wrapped" },
  { id: "graveyard", emoji: "💀", label: "Chat Graveyard", href: "/mode/graveyard" },
  { id: "forgot", emoji: "🌱", label: "What I Forgot I Wanted", href: "/mode/forgot" },
  { id: "future", emoji: "✉️", label: "Future Me Letter", href: "/mode/future" },
  { id: "founder", emoji: "🧠", label: "Founder Brain Scan", href: "/mode/founder" },
];
