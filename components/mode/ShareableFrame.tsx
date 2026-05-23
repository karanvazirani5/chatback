"use client";

import { forwardRef, type ReactNode } from "react";

interface ShareableFrameProps {
  children: ReactNode;
  /** Background gradient applied behind the children. */
  className?: string;
}

/**
 * 1:1 square container used for every share card. Includes the chatback.app
 * watermark bottom-right. The forwarded ref is used by html-to-image to
 * capture the node into a PNG.
 */
export const ShareableFrame = forwardRef<HTMLDivElement, ShareableFrameProps>(
  function ShareableFrame({ children, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-warm-strong ${className}`}
      >
        {children}
        <div className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.32em] text-primary/70">
          chatback.app
        </div>
      </div>
    );
  }
);
