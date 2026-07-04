"use client";

import { useEffect, useRef, useState } from "react";
import type { ConfidenceLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const confidenceExplainers: Record<ConfidenceLevel, string> = {
  "Very high":
    "Multiple mature evidence lines agree, core mechanisms are well established, and uncertainty is mostly about magnitude, timing, or local expression.",
  High:
    "The main direction is strongly supported, with remaining uncertainty around implementation, regional variation, or exact pathway design.",
  Medium:
    "The claim is plausible and useful, but evidence is still uneven, context-dependent, or changing quickly.",
  Low:
    "The idea is early, speculative, or weakly tested, so it should be treated as a prompt for measurement rather than a conclusion."
};

type ConfidencePillProps = {
  level: ConfidenceLevel;
  className?: string;
};

export function ConfidencePill({ level, className }: ConfidencePillProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        wrapperRef.current &&
        !wrapperRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "metadata-pill w-fit px-3 py-1 text-xs transition hover:bg-black hover:text-white",
          className
        )}
      >
        {level}
      </button>
      {open ? (
        <span
          role="dialog"
          aria-label={`${level} confidence explained`}
          className="confidence-popover"
        >
          <span className="meta-label">Confidence</span>
          <span className="mt-2 block text-sm leading-6 text-zero-muted">
            {confidenceExplainers[level]}
          </span>
        </span>
      ) : null}
    </span>
  );
}
