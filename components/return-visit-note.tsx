"use client";

import { useEffect, useRef, useState } from "react";
import { asciiBar } from "@/lib/progress";
import type { VisitSummary } from "@/lib/visit-tracking";
import {
  readVisitSummary,
  recordVisit,
  subscribeToVisitTracking
} from "@/lib/visit-tracking";

type ReturnVisitNoteProps = {
  totalIdeas: number;
};

function ordinal(value: number) {
  const mod100 = value % 100;

  if (mod100 >= 11 && mod100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export function ReturnVisitNote({ totalIdeas }: ReturnVisitNoteProps) {
  const recordedRef = useRef(false);
  const [summary, setSummary] = useState<VisitSummary | null>(null);

  useEffect(() => {
    if (!recordedRef.current) {
      recordedRef.current = true;
      setSummary(recordVisit());
    }

    return subscribeToVisitTracking(() => {
      setSummary((current) => {
        const latest = readVisitSummary();

        return current
          ? {
              ...latest,
              showNewSinceLastVisit: current.showNewSinceLastVisit
            }
          : latest;
      });
    });
  }, []);

  if (!summary?.showReturnLine && !summary?.showNewSinceLastVisit) {
    return null;
  }

  return (
    <div className="grid gap-1 text-sm leading-6 text-zero-muted">
      {summary.showNewSinceLastVisit ? (
        <p className="font-semibold text-zero-ink">New since your last visit.</p>
      ) : null}
      {summary.showReturnLine ? (
        <p>
          This is your {ordinal(summary.visitCount)} visit.{" "}
          <span className="font-mono">
            {asciiBar(summary.exploredCount, totalIdeas)}
          </span>{" "}
          ideas explored so far.
        </p>
      ) : null}
    </div>
  );
}
