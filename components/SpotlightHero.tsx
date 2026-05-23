"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the homepage hero. Tracks pointer position and writes CSS variables
 * --mx / --my so the .cursor-spotlight gradient follows the cursor. Falls
 * back to a static centre on touch/no-mouse devices.
 */
export function SpotlightHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((event: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("pointermove", handleMove);
    return () => el.removeEventListener("pointermove", handleMove);
  }, [handleMove]);

  return (
    <div ref={ref} className="cursor-spotlight">
      {children}
    </div>
  );
}
