import type { ModeId } from "./types";

export interface ShareCopy {
  /** Tweet body (URL appended automatically by twitter intent). */
  tweet: string;
  /** Caption hint for IG sticker / story. */
  igSticker: string;
  /** Single-line drop into a group chat. */
  groupChat: string;
  /** Filename stem for the downloaded PNG. */
  filename: string;
}

const DEFAULT: ShareCopy = {
  tweet:
    "this app turned my ai history into a real dashboard. it found projects i forgot i started",
  igSticker: "tap to read yours →",
  groupChat: "do this with your ai memory rn, i'm crying",
  filename: "chatback-archive",
};

const PER_MODE: Partial<Record<ModeId, ShareCopy>> = {
  roast: {
    tweet:
      "i exported my chatgpt memory into this app and it just dragged me",
    igSticker: "this app roasted my chat history",
    groupChat:
      "i exported my ai memory and this app dragged me, you have to try this",
    filename: "chatback-roast",
  },
  "past-you": {
    tweet: "i'm talking to my 2023 self and i am NOT okay",
    igSticker: "i'm talking to past me",
    groupChat: "i'm chatting with 2023 me and i'm not okay",
    filename: "chatback-past-you",
  },
  "future-you": {
    tweet:
      "just chatted with myself one year from now and i didn't love what she had to say",
    igSticker: "i'm chatting with future me",
    groupChat:
      "you can talk to one-year-from-now you in this app, brutal accurate",
    filename: "chatback-future-you",
  },
  wrapped: {
    tweet:
      "my ai wrapped is somehow more accurate than my spotify wrapped",
    igSticker: "tap for your AI wrapped",
    groupChat: "your ai memory has a wrapped now, it knows everything",
    filename: "chatback-wrapped",
  },
  graveyard: {
    tweet:
      "every project i abandoned this year has a tombstone now and it's brutal",
    igSticker: "ideas i abandoned",
    groupChat: "this app dug up every project i ghosted, brutal",
    filename: "chatback-graveyard",
  },
  forgot: {
    tweet: "this app found a goal i told my AI about and then quietly forgot",
    igSticker: "what i forgot i wanted",
    groupChat:
      "this app found something i wanted last year and forgot, oof",
    filename: "chatback-forgot",
  },
  future: {
    tweet: "got a letter from six-months-from-now me. needed to hear it.",
    igSticker: "a letter from future me",
    groupChat: "your AI can write you a letter from the future, send help",
    filename: "chatback-future-letter",
  },
  founder: {
    tweet:
      "this app diagnosed my founder brain in one line and i'm rattled",
    igSticker: "my founder brain scan",
    groupChat: "my AI just diagnosed my founder brain and it's accurate",
    filename: "chatback-founder-scan",
  },
};

export function shareCopyFor(mode: ModeId): ShareCopy {
  return PER_MODE[mode] ?? DEFAULT;
}

export function buildTweetUrl(text: string, shareUrl: string): string {
  const params = new URLSearchParams();
  params.set("text", text);
  params.set("url", shareUrl);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
