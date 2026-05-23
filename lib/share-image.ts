"use client";

import { toPng } from "html-to-image";

export async function downloadShareCard(
  node: HTMLElement,
  filename: string
): Promise<void> {
  // Wait for any pending web fonts so the capture doesn't render fallback fonts.
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore — older browsers
    }
  }

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#09090b",
  });

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
