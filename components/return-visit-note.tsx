"use client";

import { useEffect, useState } from "react";
import type { VisitSummary } from "@/lib/visit-tracking";
import {
  readVisitSummary,
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
  const [summary, setSummary] = useState<VisitSummary | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSummary(readVisitSummary());
    });

    const unsubscribe = subscribeToVisitTracking(() => {
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

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
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
          This is your {ordinal(summary.visitCount)} visit. You&apos;ve explored{" "}
          {summary.exploredCount} of {totalIdeas} ideas so far.
        </p>
      ) : null}
    </div>
  );
}
