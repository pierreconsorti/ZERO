"use client";

import { useId, useState, type FocusEvent } from "react";
import { cn } from "@/lib/utils";

type MetaPillPopoverProps = {
  label: string;
  description: string;
  dark?: boolean;
};

export function MetaPillPopover({
  label,
  description,
  dark = false
}: MetaPillPopoverProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setOpen(false);
    }
  };

  return (
    <span className="meta-pill-popover" onBlur={handleBlur}>
      <button
        type="button"
        className={cn("meta-pill-trigger", dark && "meta-pill-trigger-dark")}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        {label}
      </button>
      <span
        id={id}
        role="status"
        className={cn("meta-pill-popover-panel", open && "is-open")}
      >
        {description}
      </span>
    </span>
  );
}
