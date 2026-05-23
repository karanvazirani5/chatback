import { ImageResponse } from "next/og";

export const alt =
  "Chatback — Talk to the person your AI history remembers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(800px 600px at 20% 20%, rgba(244,185,66,0.18), transparent 60%), radial-gradient(900px 700px at 110% 100%, rgba(126,90,200,0.16), transparent 60%), #0a0a14",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          color: "#f5f3ed",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#f4b942",
            marginBottom: 32,
          }}
        >
          Issue №01 · A self-portrait
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 220,
            lineHeight: 0.9,
            letterSpacing: -8,
            fontWeight: 500,
          }}
        >
          Chat<span style={{ color: "#f4b942", fontStyle: "italic" }}>back</span>.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 52,
            fontStyle: "italic",
            color: "#a7a4b8",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          Talk to the person{" "}
          <span style={{ color: "#f5f3ed", marginLeft: 14 }}>
            your AI history
          </span>{" "}
          remembers.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a7a4b8",
          }}
        >
          <span>chatback.app</span>
          <span style={{ color: "#f4b942" }}>a quiet mirror</span>
        </div>
      </div>
    ),
    size
  );
}
