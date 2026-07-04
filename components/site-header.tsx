"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SearchCompositeInput } from "./search-composite-input";

const navItems = [
  { href: "/", label: "Catalogue" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/evidence", label: "Evidence" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" }
] as const;

type ThemeMode = "black" | "white";

const themeStorageKey = "zero-theme-mode";
const themeChangeEvent = "zero-theme-mode-change";
let fallbackThemeMode: ThemeMode = "black";

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "black";
  }

  try {
    return window.localStorage.getItem(themeStorageKey) === "white"
      ? "white"
      : "black";
  } catch {
    return fallbackThemeMode;
  }
}

function subscribeToThemeChange(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();

  window.addEventListener(themeChangeEvent, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(themeChangeEvent, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;

  root.classList.add("theme-switching");

  if (mode === "white") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }

  window.requestAnimationFrame(() => {
    root.classList.remove("theme-switching");
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const themeMode = useSyncExternalStore(
    subscribeToThemeChange,
    getStoredThemeMode,
    () => "black"
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const nextMode = themeMode === "black" ? "white" : "black";

    fallbackThemeMode = nextMode;
    applyTheme(nextMode);
    try {
      window.localStorage.setItem(themeStorageKey, nextMode);
    } catch {
      // The visual toggle should still work if storage is unavailable.
    }
    window.dispatchEvent(new Event(themeChangeEvent));
    setMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 bg-white/[0.86] px-3 py-1.5 backdrop-blur-xl sm:px-5 sm:py-2 lg:px-8"
    >
      <div className="mx-auto max-w-[92rem]">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Toggle black and white mode"
            aria-pressed={themeMode === "white"}
            className="zero-wordmark pill-control-light flex items-baseline gap-3 px-4 py-2 sm:py-2.5"
            onClick={toggleTheme}
          >
            <span className="text-sm font-semibold uppercase text-zero-ink">ZERO</span>
          </button>
          <div className="hidden sm:block">
            <SearchCompositeInput />
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="pill-control-light flex items-center gap-2 px-3.5 py-2 text-sm lg:hidden"
          >
            <span>Menu</span>
            <span className="grid gap-1" aria-hidden="true">
              <span className="block h-px w-4 bg-black" />
              <span className="block h-px w-4 bg-black" />
            </span>
          </button>
          <nav
            aria-label="Primary navigation"
            className="hidden w-fit flex-wrap gap-1 rounded-full bg-black/[0.045] p-1.5 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm text-black/[0.64] transition hover:bg-white hover:text-black hover:shadow-quiet"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {menuOpen ? (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-menu-panel mt-2 grid gap-1.5 p-2 backdrop-blur-xl lg:hidden"
          >
            <div className="px-1 pb-2 sm:hidden">
              <SearchCompositeInput />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className="mobile-menu-link text-sm transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
