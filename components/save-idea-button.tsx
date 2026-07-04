"use client";

import { useSyncExternalStore } from "react";
import {
  readSavedIdeaIds,
  subscribeToFieldbookChange,
  toggleSavedIdea
} from "@/lib/fieldbook";

type SaveIdeaButtonProps = {
  id: string;
};

export function SaveIdeaButton({ id }: SaveIdeaButtonProps) {
  const saved = useSyncExternalStore(
    subscribeToFieldbookChange,
    () => readSavedIdeaIds().includes(id),
    () => false
  );

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleSavedIdea(id)}
      className="pill-control-dark w-full px-4 py-2 text-sm shadow-quiet transition hover:bg-black/[0.82] sm:w-auto"
    >
      {saved ? "Saved" : "Save idea"}
    </button>
  );
}
