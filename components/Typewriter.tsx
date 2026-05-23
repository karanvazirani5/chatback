"use client";

import { useEffect, useState } from "react";

/**
 * Reveals a string character-by-character with a blinking caret. Used in
 * loading states to make 15-second AI waits feel cinematic instead of dead.
 */
export function Typewriter({
  text,
  charDelay = 22,
  className = "",
}: {
  text: string;
  charDelay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, charDelay);
    return () => clearInterval(id);
  }, [text, charDelay]);

  return (
    <span className={className}>
      {shown}
      <span className="caret" aria-hidden />
    </span>
  );
}
