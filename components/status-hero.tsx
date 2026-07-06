"use client";

import {
  interventionFilterOptions,
  type InterventionFilter
} from "@/lib/data/intervention-filters";
import {
  parseStoredLocation,
  readStoredLocationSnapshot,
  subscribeToLocationChange
} from "@/lib/local-climate-location";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { AtmosphericPanel } from "./atmospheric-panel";
import { GlossaryText } from "./glossary-text";
import { RotatingText } from "./rotating-text";

const familyContext: Partial<Record<InterventionFilter, string>> = {
  Materials:
    "Reflective and low-heat materials change how surfaces absorb sunlight before mechanical cooling is needed.",
  Shade:
    "Shade cuts direct solar exposure immediately, lowering heat stress where people wait, walk, and work.",
  Textiles:
    "Cooling textiles reduce body heat gain for people exposed outdoors, especially workers and uniforms.",
  Surfaces:
    "Streets, roofs, and plazas store heat; cooler surfaces reduce exposure at the ground.",
  Methane:
    "Methane traps heat far more efficiently than CO2 but breaks down faster, so cuts can show results within years.",
  "Passive cooling":
    "Passive cooling lowers indoor heat before adding machines, using shade, ventilation, insulation, and thermal mass."
};

type StatusHeroProps = {
  updatedAt: string;
  activeFilter: InterventionFilter;
  onFilterChange: (filter: InterventionFilter) => void;
  visibleCount: number;
};

export function StatusHero({
  updatedAt,
  activeFilter,
  onFilterChange,
  visibleCount
}: StatusHeroProps) {
  const locationSnapshot = useSyncExternalStore(
    subscribeToLocationChange,
    readStoredLocationSnapshot,
    () => null
  );
  const storedLocation = useMemo(
    () => parseStoredLocation(locationSnapshot),
    [locationSnapshot]
  );
  const locationName =
    storedLocation &&
    storedLocation.displayName !== "Your current location" &&
    storedLocation.displayName.length <= 42
      ? storedLocation.displayName
      : null;
  const heroHeadline = locationName
    ? [
        `In ${locationName}, summers are getting hotter. Here's what could help.`,
        "A catalogue of planetary cooling possibilities",
        "Ideas that can be tested before the next heat season."
      ]
    : [
        "A catalogue of planetary cooling possibilities",
        "Ideas that can be tested before the next heat season."
      ];
  const activeFamilyContext =
    activeFilter === "All" ? null : familyContext[activeFilter];

  return (
    <div className="px-1.5 pb-4 pt-2 sm:px-5 sm:pb-6 lg:px-8">
      <AtmosphericPanel
        tone="mist"
        className="lg:min-h-[calc(100vh-6rem)]"
        contentClassName="grid gap-3 p-1.5 sm:gap-6 sm:p-8 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1.22fr_0.78fr] lg:p-10"
      >
        <div className="flex flex-col justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="object-card p-4 sm:p-8 lg:min-h-[30rem]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="meta-label">Public field guide</p>
              <p className="metadata-pill px-3 py-1.5 text-sm font-semibold">
                Live field guide
              </p>
            </div>
            <h1 className="display-tight-xl mt-5 max-w-[58rem] text-balance text-[clamp(2.05rem,7.3vw,3.5rem)] text-black sm:mt-6">
              <RotatingText items={heroHeadline} intervalMs={5600} />
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-[1.1] text-black sm:text-xl">
              What can we try next summer?
            </p>
            <p className="mt-4 max-w-2xl text-[1.03rem] leading-7 text-black/[0.62] sm:text-base">
              <GlossaryText text="A public field guide for planetary cooling possibilities organized by evidence, scale, risk, and what can actually be tested." />
            </p>
          </div>

          <div className="object-card max-w-3xl p-4 sm:p-5">
            <p className="meta-label">Browse by intervention family</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {interventionFilterOptions.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => onFilterChange(filter)}
                  className={cn(
                    "filter-chip px-3 py-1.5 text-sm transition",
                    activeFilter === filter && "shadow-quiet"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-zero-muted" aria-live="polite">
              Showing {visibleCount} interventions — {activeFilter}
            </p>
            {activeFamilyContext ? (
              <p className="mt-3 text-sm leading-6 text-zero-muted">
                <GlossaryText text={activeFamilyContext} />
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-rows-[1fr_auto]">
          <div className="object-card flex min-h-[17rem] flex-col justify-between p-4 sm:min-h-[22rem] sm:p-7 lg:min-h-[25rem]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="meta-label">Readiness index</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-black/[0.58]">
                  <GlossaryText text="A living field guide for things that can be tested, funded, regulated, installed, worn, painted, detected, or prototyped." />
                </p>
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="metadata-tile px-4 py-3">
                <dt className="meta-label text-[0.62rem]">Updated</dt>
                <dd className="mt-1 text-black">{updatedAt}</dd>
              </div>
              <div className="metadata-tile px-4 py-3">
                <dt className="meta-label text-[0.62rem]">Evidence support</dt>
                <dd className="mt-1 text-black">NASA, NOAA, OWID, IEA</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: "/evidence", label: "Evidence" },
              { href: "#prototypes", label: "Prototype" },
              { href: "/roadmap", label: "Scale" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="pill-control-light px-4 py-3 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </AtmosphericPanel>
    </div>
  );
}
