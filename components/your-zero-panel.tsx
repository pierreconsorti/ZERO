"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  readPersonalLog,
  readPersonalNotes,
  readVisitSummary,
  subscribeToVisitTracking,
  writePersonalNotes,
  type PersonalEvent,
  type VisitSummary
} from "@/lib/visit-tracking";
import { AmbientToggle } from "./ambient-toggle";

function summarizeLog(events: PersonalEvent[]) {
  const explored = events.filter((event) => event.type === "explored").length;
  const shared = events.filter((event) => event.type === "shared").length;
  const searched = events.filter((event) => event.type === "searched").length;

  if (events.length === 0) {
    return "Nothing has been logged in this browser yet.";
  }

  if (explored >= shared && explored >= searched) {
    return "Your recent path is mostly through field notes. ZERO is seeing a pattern of close reading rather than quick scanning.";
  }

  if (searched > explored) {
    return "Your recent path is search-led. The next useful step may be opening one result and testing its field note.";
  }

  return "Your recent path is starting to move from reading toward sharing, which usually means an idea is becoming concrete enough to carry elsewhere.";
}

export function YourZeroPanel() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<VisitSummary>(() => readVisitSummary());
  const [notes, setNotes] = useState("");
  const [log, setLog] = useState<PersonalEvent[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSummary(readVisitSummary());
      setNotes(readPersonalNotes());
      setLog(readPersonalLog());
    });

    const unsubscribe = subscribeToVisitTracking(() => {
      setSummary(readVisitSummary());
      setLog(readPersonalLog());
    });

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        panelRef.current &&
        !panelRef.current.contains(target)
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

  const logSummary = useMemo(() => summarizeLog(log), [log]);
  const notesUnlocked = summary.visitCount >= 2;

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        className="pill-control-light px-3.5 py-2 text-sm"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Your ZERO
      </button>
      {open ? (
        <div className="your-zero-panel">
          <p className="meta-label">Your ZERO</p>
          <p className="mt-3 text-sm leading-6 text-zero-muted">
            {summary.showReturnLine
              ? `Visit ${summary.visitCount}. ${summary.exploredCount} ideas explored in this browser.`
              : "A local-only space will become more useful after a return visit."}
          </p>

          <div className="mt-4 rounded-[1rem] bg-black/[0.035] p-3">
            <p className="meta-label">Private notes</p>
            {notesUnlocked ? (
              <>
                <textarea
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                    writePersonalNotes(event.target.value);
                  }}
                  className="mt-3 min-h-28 w-full resize-none rounded-[0.85rem] border-0 bg-black/[0.05] p-3 text-sm leading-6 text-zero-ink outline-none"
                  placeholder="A local note. It never leaves this browser."
                />
                <p className="mt-2 text-xs leading-5 text-zero-muted">
                  Private and local-only. Not synced, shared, or public.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-zero-muted">
                Notes unlock on your second visit.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-[1rem] bg-black/[0.035] p-3">
            <p className="meta-label">Session receipt</p>
            <p className="mt-3 text-sm leading-6 text-zero-muted">{logSummary}</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] bg-black/[0.035] p-3">
            <p className="text-sm leading-6 text-zero-muted">
              Optional ambient layer. Off by default.
            </p>
            <AmbientToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
}
