import { CONTENT_UPDATED } from "./content-version";

const visitCountKey = "zero-visit-count";
const exploredIdsKey = "zero-explored-intervention-ids";
const lastVisitKey = "zero-last-visit-timestamp";
const personalNotesKey = "zero-personal-notes";
const personalLogKey = "zero-personal-log";
const currentVisitSummaryKey = "zero-current-visit-summary";
const visitTrackingEvent = "zero-visit-tracking-change";

export type VisitSummary = {
  visitCount: number;
  exploredCount: number;
  showReturnLine: boolean;
  showNewSinceLastVisit: boolean;
};

export type PersonalEvent = {
  type: "explored" | "shared" | "searched";
  label: string;
  timestamp: string;
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

  logPersonalEvent({
    type: "explored",
    label: id,
    timestamp: new Date().toISOString()
  });
  window.dispatchEvent(new Event(visitTrackingEvent));
}

export function readPersonalNotes() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(personalNotesKey) ?? "";
  } catch {
    return "";
  }
}

export function writePersonalNotes(value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(personalNotesKey, value);
  } catch {
    return;
  }

  window.dispatchEvent(new Event(visitTrackingEvent));
}

export function readPersonalLog() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(personalLogKey) ?? "[]"
    ) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((event): event is PersonalEvent => {
          if (!event || typeof event !== "object") {
            return false;
          }

          const candidate = event as Partial<PersonalEvent>;

          return (
            (candidate.type === "explored" ||
              candidate.type === "shared" ||
              candidate.type === "searched") &&
            typeof candidate.label === "string" &&
            typeof candidate.timestamp === "string"
          );
        })
      : [];
  } catch {
    return [];
  }
}

export function logPersonalEvent(event: PersonalEvent) {
  if (typeof window === "undefined") {
    return;
  }

  const next = [event, ...readPersonalLog()].slice(0, 30);

  try {
    window.localStorage.setItem(personalLogKey, JSON.stringify(next));
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

  const summary = {
    visitCount: nextVisitCount,
    exploredCount: readExploredInterventionIds().length,
    showReturnLine: nextVisitCount >= 2,
    showNewSinceLastVisit
  };

  try {
    window.localStorage.setItem(visitCountKey, String(nextVisitCount));
    window.localStorage.setItem(lastVisitKey, new Date().toISOString());
    window.sessionStorage.setItem(
      currentVisitSummaryKey,
      JSON.stringify(summary)
    );
  } catch {
    // Return the in-memory state even when persistence is unavailable.
  }

  window.dispatchEvent(new Event(visitTrackingEvent));

  return summary;
}

export function readVisitSummary(): VisitSummary {
  if (typeof window !== "undefined") {
    try {
      const parsed = JSON.parse(
        window.sessionStorage.getItem(currentVisitSummaryKey) ?? "null"
      ) as Partial<VisitSummary> | null;

      if (
        parsed &&
        typeof parsed.visitCount === "number" &&
        typeof parsed.exploredCount === "number"
      ) {
        return {
          visitCount: parsed.visitCount,
          exploredCount: readExploredInterventionIds().length,
          showReturnLine: Boolean(parsed.showReturnLine),
          showNewSinceLastVisit: Boolean(parsed.showNewSinceLastVisit)
        };
      }
    } catch {
      // Fall through to persisted summary.
    }
  }

  return {
    visitCount: readNumber(visitCountKey),
    exploredCount: readExploredInterventionIds().length,
    showReturnLine: readNumber(visitCountKey) >= 2,
    showNewSinceLastVisit: false
  };
}
