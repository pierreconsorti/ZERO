const storageKey = "zero-fieldbook";
const changeEvent = "zero-fieldbook-change";

export function readSavedIdeaIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const existing = window.localStorage.getItem(storageKey);
    const parsed = existing ? (JSON.parse(existing) as unknown) : [];

    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function subscribeToFieldbookChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

export function toggleSavedIdea(id: string) {
  const savedIds = readSavedIdeaIds();
  const next = savedIds.includes(id)
    ? savedIds.filter((savedId) => savedId !== id)
    : [...savedIds, id];

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // Keep the click harmless if storage is unavailable.
  }

  window.dispatchEvent(new Event(changeEvent));
}
