"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Catalogue" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/evidence", label: "Evidence" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" }
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/[0.86] px-3 py-2 backdrop-blur-xl sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="pill-control-light flex items-baseline gap-3 px-4 py-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-sm font-semibold uppercase text-zero-ink">ZERO</span>
            <span className="hidden text-sm text-zero-muted sm:inline">
              cooling possibilities
            </span>
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="pill-control-light flex items-center gap-2 px-3.5 py-2.5 text-sm lg:hidden"
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
            className="mt-2 grid gap-1 rounded-[1.5rem] bg-white/[0.92] p-2 shadow-quiet backdrop-blur-xl lg:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-4 py-3 text-sm text-black/[0.72] transition hover:bg-black/[0.055] hover:text-black"
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
