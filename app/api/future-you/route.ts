import { NextRequest, NextResponse } from "next/server";
import type { FutureHorizon } from "@/lib/prompts";
import { streamFutureYou, type FutureYouMessage } from "@/lib/future-you";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_HORIZONS: FutureHorizon[] = ["6 months", "1 year", "5 years"];

export async function POST(req: NextRequest) {
  let body: {
    horizon?: string;
    context?: string;
    history?: FutureYouMessage[];
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const horizon = body.horizon as FutureHorizon;
  const context = (body.context ?? "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
  const message = (body.message ?? "").trim();

  if (!VALID_HORIZONS.includes(horizon)) {
    return NextResponse.json({ error: "Invalid horizon." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }
  if (!context) {
    return NextResponse.json(
      { error: "No context available — go back and import first." },
      { status: 400 }
    );
  }

  try {
    const stream = await streamFutureYou({
      horizon,
      context,
      history,
      message,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          console.error("[/api/future-you stream]", err);
          controller.enqueue(encoder.encode("\n\n[stream interrupted]"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/future-you]", err);
    const message =
      err instanceof Error ? err.message : "Couldn't reach future-you.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
