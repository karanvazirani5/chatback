import { NextRequest, NextResponse } from "next/server";
import type { MasterAnalysis } from "@/lib/types";
import { MasterAnalysisSchema } from "@/lib/schema";
import { generateNextMove } from "@/lib/next-move";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: {
    analysis?: MasterAnalysis;
    rawContext?: string;
    excludeNames?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parse = MasterAnalysisSchema.safeParse(body.analysis);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Missing or invalid analysis in request." },
      { status: 400 }
    );
  }

  const excludeNames = Array.isArray(body.excludeNames)
    ? body.excludeNames.filter((n): n is string => typeof n === "string")
    : [];
  const rawContext =
    typeof body.rawContext === "string" ? body.rawContext : undefined;

  try {
    const move = await generateNextMove({
      analysis: parse.data,
      rawContext,
      excludeNames,
    });
    return NextResponse.json({ move });
  } catch (err) {
    console.error("[/api/next-move]", err);
    const message =
      err instanceof Error
        ? err.message
        : "Couldn't pick your next move. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
