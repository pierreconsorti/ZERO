"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MetadataPopoverProps = {
  label: string;
  popoverLabel?: string;
  children: string;
  buttonClassName?: string;
};

export function MetadataPopover({
  label,
  popoverLabel = "Note",
  children,
  buttonClassName
}: MetadataPopoverProps) {
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
        className={cn("metadata-pill px-3 py-1 text-xs", buttonClassName)}
      >
        {label}
      </button>
      {open ? (
        <span
          role="dialog"
          aria-label={`${label} explained`}
          className="confidence-popover"
        >
          <span className="meta-label">{popoverLabel}</span>
          <span className="mt-2 block text-sm leading-6 text-zero-muted">
            {children}
          </span>
        </span>
      ) : null}
    </span>
  );
}
