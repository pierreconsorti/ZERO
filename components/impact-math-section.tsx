"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  parseStoredLocation,
  readStoredLocationSnapshot,
  subscribeToLocationChange
} from "@/lib/local-climate-location";
import { estimateWhiteRoofCooling } from "@/lib/impact-math";

export function ImpactMathSection() {
  const locationSnapshot = useSyncExternalStore(
    subscribeToLocationChange,
    readStoredLocationSnapshot,
    () => null
  );
  const location = useMemo(
    () => parseStoredLocation(locationSnapshot),
    [locationSnapshot]
  );
  const global = estimateWhiteRoofCooling({
    name: "the world's hottest cities",
    roofAreaKm2: 1500
  });
  const local = location
    ? estimateWhiteRoofCooling({
        name: location.displayName,
        roofAreaKm2: 2.4
      })
    : null;

  return (
    <section className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="object-card grid gap-5 p-4 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="meta-label">Impact math</p>
            <h2 className="display-tight-lg mt-4 text-balance text-[clamp(1.65rem,6vw,1.8rem)] text-zero-ink">
              If this were done, what changes?
            </h2>
          </div>
          <div className="grid gap-4">
            <p className="text-lg font-semibold leading-7 text-zero-ink">
              {global.summary}
            </p>
            {local ? (
              <p className="text-sm leading-6 text-zero-muted">{local.summary}</p>
            ) : (
              <p className="text-sm leading-6 text-zero-muted">
                Save a local climate location to see the same estimate scoped to
                your place.
              </p>
            )}
            <p className="text-xs leading-5 text-zero-muted">
              Simplified albedo screening estimate. It is a directional planning
              number, not a substitute for a local engineering model.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
