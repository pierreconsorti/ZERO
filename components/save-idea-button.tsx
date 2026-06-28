"use client";

import { useSyncExternalStore } from "react";

type SaveIdeaButtonProps = {
  id: string;
};

const storageKey = "zero-fieldbook";

function readSavedIds() {
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

function subscribeToFieldbook(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("zero-fieldbook-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("zero-fieldbook-change", callback);
  };
}

export function SaveIdeaButton({ id }: SaveIdeaButtonProps) {
  const saved = useSyncExternalStore(
    subscribeToFieldbook,
    () => readSavedIds().includes(id),
    () => false
  );

  function toggleSaved() {
    const savedIds = readSavedIds();
    const next = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("zero-fieldbook-change"));
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={toggleSaved}
      className="rounded-full border border-zero-ink/[0.15] bg-white/70 px-3 py-1.5 font-mono text-[0.68rem] uppercase text-zero-ink transition hover:border-zero-ink hover:bg-zero-ink hover:text-white"
    >
      {saved ? "In fieldbook" : "Mark for prototype"}
    </button>
  );
}
