import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a14 0%, #1f1f3a 100%)",
          borderRadius: 14,
          color: "#f4b942",
          fontSize: 44,
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: 500,
          letterSpacing: "-0.04em",
        }}
      >
        c
      </div>
    ),
    size
  );
}
