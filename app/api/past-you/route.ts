import { NextRequest, NextResponse } from "next/server";
import { streamPastYou, type PastYouMessage } from "@/lib/past-you";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: {
    era?: string;
    context?: string;
    history?: PastYouMessage[];
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const era = (body.era ?? "").trim();
  const context = (body.context ?? "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
  const message = (body.message ?? "").trim();

  if (!/^\d{4}$/.test(era)) {
    return NextResponse.json(
      { error: "Era must be a 4-digit year." },
      { status: 400 }
    );
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
    const stream = await streamPastYou({ era, context, history, message });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("[/api/past-you stream]", err);
          controller.enqueue(
            encoder.encode("\n\n[stream interrupted]")
          );
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
    console.error("[/api/past-you]", err);
    const message =
      err instanceof Error ? err.message : "Couldn't reach past-you.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
