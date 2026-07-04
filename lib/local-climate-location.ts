export type StoredLocation = {
  latitude: number;
  longitude: number;
  displayName: string;
  placeSource?: string;
};

export const locationStorageKey = "zero-local-climate-location";
export const locationChangeEvent = "zero-local-climate-location-change";

export function subscribeToLocationChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(locationChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(locationChangeEvent, callback);
  };
}

export function readStoredLocationSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(locationStorageKey);
  } catch {
    return null;
  }
}

export function parseStoredLocation(snapshot: string | null) {
  if (!snapshot) {
    return null;
  }

  try {
    const parsed = JSON.parse(snapshot) as Partial<StoredLocation>;

    if (!parsed) {
      return null;
    }

    const { latitude, longitude, displayName, placeSource } = parsed;

    return typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof displayName === "string"
      ? {
          latitude,
          longitude,
          displayName,
          placeSource: typeof placeSource === "string" ? placeSource : undefined
        }
      : null;
  } catch {
    return null;
  }
}

export function writeStoredLocation(location: StoredLocation | null) {
  try {
    if (location) {
      window.localStorage.setItem(locationStorageKey, JSON.stringify(location));
    } else {
      window.localStorage.removeItem(locationStorageKey);
    }
  } catch {
    // The module should remain usable even if storage is unavailable.
  }

  window.dispatchEvent(new Event(locationChangeEvent));
}
