"use client";

import { useEffect, useState } from "react";
import { readVisitSummary, subscribeToVisitTracking } from "@/lib/visit-tracking";

const letterSeenKey = "zero-letter-seen";

export function UnlockLetter() {
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    function checkUnlock() {
      try {
        if (window.localStorage.getItem(letterSeenKey) === "true") {
          return;
        }
      } catch {
        return;
      }

      const summary = readVisitSummary();

      if (summary.visitCount >= 5 || summary.exploredCount >= 10) {
        setVisible(true);
        window.setTimeout(() => setRevealed(true), 2200);
        try {
          window.localStorage.setItem(letterSeenKey, "true");
        } catch {
          // The overlay can still dismiss even without persistence.
        }
      }
    }

    const frame = window.requestAnimationFrame(checkUnlock);
    const unsubscribe = subscribeToVisitTracking(checkUnlock);

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="zero-letter-overlay">
      <div className="max-w-xl text-center">
        {!revealed ? (
          <p className="text-lg leading-7">Some systems answer only after being watched.</p>
        ) : (
          <div className="grid gap-5">
            <p className="text-lg leading-8">
              ZERO is not a promise that the world will cool itself. It is a
              habit of refusing to let scale erase the next measurable act.
            </p>
            <p className="text-sm leading-6 text-[#fff]/70">
              Keep the doubt. Keep the measurements. Keep choosing ideas that
              can be tested in public.
            </p>
            <button
              type="button"
              className="mx-auto rounded-full bg-[#fff] px-4 py-2 text-sm text-[#000]"
              onClick={() => setVisible(false)}
            >
              Return to ZERO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
