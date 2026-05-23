import { NextRequest, NextResponse } from "next/server";
import { analyzeArchive } from "@/lib/analyze";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let rawText: string;
  try {
    const body = await req.json();
    rawText = typeof body?.rawText === "string" ? body.rawText : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  rawText = rawText.trim();
  if (!rawText) {
    return NextResponse.json(
      { error: "Paste something first." },
      { status: 400 }
    );
  }
  // Soft cap: silently keep the most recent 30K characters. Reliable under
  // the 60s function timeout even on Vercel Hobby. Most real archives fit
  // easily; trimming to most-recent biases the analysis toward present-you.
  const SOFT_CAP = 30_000;
  if (rawText.length > SOFT_CAP) {
    rawText = rawText.slice(-SOFT_CAP);
  }

  try {
    const analysis = await analyzeArchive(rawText);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Couldn't read this. Try different text.";
    console.error("[/api/analyze]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
