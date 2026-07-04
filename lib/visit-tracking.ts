import { CONTENT_UPDATED } from "./content-version";

const visitCountKey = "zero-visit-count";
const exploredIdsKey = "zero-explored-intervention-ids";
const lastVisitKey = "zero-last-visit-timestamp";
const visitTrackingEvent = "zero-visit-tracking-change";

export type VisitSummary = {
  visitCount: number;
  exploredCount: number;
  showReturnLine: boolean;
  showNewSinceLastVisit: boolean;
};

function readNumber(key: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  let snapshot: string | null = null;

  try {
    snapshot = window.localStorage.getItem(key);
  } catch {
    return 0;
  }

  const value = Number(snapshot);

  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function readExploredInterventionIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(exploredIdsKey) ?? "[]"
    ) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function subscribeToVisitTracking(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(visitTrackingEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(visitTrackingEvent, callback);
  };
}

export function trackExploredIntervention(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readExploredInterventionIds();

  if (existing.includes(id)) {
    return;
  }

  try {
    window.localStorage.setItem(
      exploredIdsKey,
      JSON.stringify([...existing, id])
    );
  } catch {
    return;
  }

  window.dispatchEvent(new Event(visitTrackingEvent));
}

export function recordVisit() {
  if (typeof window === "undefined") {
    return {
      visitCount: 0,
      exploredCount: 0,
      showReturnLine: false,
      showNewSinceLastVisit: false
    };
  }

  let previousVisit: string | null = null;

  try {
    previousVisit = window.localStorage.getItem(lastVisitKey);
  } catch {
    previousVisit = null;
  }
  const nextVisitCount = readNumber(visitCountKey) + 1;
  const contentUpdatedAt = new Date(`${CONTENT_UPDATED}T00:00:00`).getTime();
  const previousVisitAt = previousVisit ? new Date(previousVisit).getTime() : 0;
  const showNewSinceLastVisit =
    previousVisitAt > 0 && contentUpdatedAt > previousVisitAt;

  try {
    window.localStorage.setItem(visitCountKey, String(nextVisitCount));
    window.localStorage.setItem(lastVisitKey, new Date().toISOString());
  } catch {
    // Return the in-memory state even when persistence is unavailable.
  }

  return {
    visitCount: nextVisitCount,
    exploredCount: readExploredInterventionIds().length,
    showReturnLine: nextVisitCount >= 2,
    showNewSinceLastVisit
  };
}

export function readVisitSummary(): VisitSummary {
  return {
    visitCount: readNumber(visitCountKey),
    exploredCount: readExploredInterventionIds().length,
    showReturnLine: readNumber(visitCountKey) >= 2,
    showNewSinceLastVisit: false
  };
}
