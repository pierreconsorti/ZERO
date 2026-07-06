"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTextInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (event.key === "/" && !isTextInput) {
        const search = document.querySelector<HTMLInputElement>(
          "[data-zero-search-input='true']"
        );

        if (search) {
          event.preventDefault();
          search.focus();
        }
      }

      if (event.key === "Escape") {
        window.dispatchEvent(new Event("zero-close-overlays"));
        document
          .querySelectorAll<HTMLDetailsElement>("details[open]")
          .forEach((details) => {
            details.open = false;
          });
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      const active = document.activeElement;

      if (!(active instanceof HTMLElement)) {
        return;
      }

      const current = active.closest<HTMLElement>("[data-catalogue-card='true']");

      if (!current) {
        return;
      }

      const cards = [
        ...document.querySelectorAll<HTMLElement>("[data-catalogue-card='true']")
      ];
      const index = cards.indexOf(current);

      if (index === -1) {
        return;
      }

      event.preventDefault();
      const nextIndex =
        event.key === "ArrowRight"
          ? Math.min(index + 1, cards.length - 1)
          : Math.max(index - 1, 0);

      cards[nextIndex]?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
