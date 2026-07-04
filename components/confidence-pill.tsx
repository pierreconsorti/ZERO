"use client";

import type { ConfidenceLevel } from "@/lib/types";
import { MetadataPopover } from "./metadata-popover";

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
  return (
    <MetadataPopover
      label={level}
      popoverLabel="Confidence"
      buttonClassName={`w-fit transition hover:bg-black hover:text-white ${
        className ?? ""
      }`}
    >
      {confidenceExplainers[level]}
    </MetadataPopover>
  );
}
