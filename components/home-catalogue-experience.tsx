"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterInterventions,
  type InterventionFilter
} from "@/lib/data/intervention-filters";
import { interventions } from "@/lib/data/interventions";
import { CoolingCatalogue } from "./cooling-catalogue";
import {
  LocalClimatePanel,
  type ClimateProfile
} from "./local-climate-panel";
import { StatusHero } from "./status-hero";
import type { Intervention } from "@/lib/data/interventions";
import { trackExploredIntervention } from "@/lib/visit-tracking";

type HomeCatalogueExperienceProps = {
  updatedAt: string;
};

function ClimateRecommendationStrip({ profile }: { profile: ClimateProfile }) {
  const recommended = profile.recommendationIds
    .map((id) => interventions.find((intervention) => intervention.id === id))
    .filter((intervention): intervention is Intervention => Boolean(intervention));

  if (recommended.length === 0) {
    return null;
  }

  return (
    <section className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="object-card grid gap-5 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="meta-label">For {profile.locationName}</p>
              <h2 className="display-tight-md mt-3 max-w-3xl text-balance text-[clamp(1.5rem,5vw,2rem)] text-zero-ink">
                Given your climate, these might matter most.
              </h2>
            </div>
            <p className="metadata-pill w-fit px-3 py-1.5 text-sm">
              Summer high near {Math.round(profile.averageSummerHigh)}°C
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((intervention) => (
              <Link
                key={intervention.id}
                href={`/#${intervention.id}`}
                onClick={() => trackExploredIntervention(intervention.id)}
                className="metadata-tile hover-lift grid cursor-pointer gap-3 p-4"
              >
                <span className="meta-label">{intervention.category}</span>
                <strong className="text-base leading-tight text-zero-ink">
                  {intervention.title}
                </strong>
                <span className="text-sm leading-6 text-zero-muted">
                  {intervention.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeCatalogueExperience({
  updatedAt
}: HomeCatalogueExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<InterventionFilter>("All");
  const [cataloguePulse, setCataloguePulse] = useState(false);
  const [climateProfile, setClimateProfile] = useState<ClimateProfile | null>(
    null
  );
  const pulseTimerRef = useRef<number | null>(null);
  const visibleInterventions = useMemo(
    () => filterInterventions(interventions, activeFilter),
    [activeFilter]
  );

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const handleFilterChange = useCallback((filter: InterventionFilter) => {
    setActiveFilter(filter);
    setCataloguePulse(true);

    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }

    pulseTimerRef.current = window.setTimeout(() => {
      setCataloguePulse(false);
      pulseTimerRef.current = null;
    }, 260);

    window.requestAnimationFrame(() => {
      document.getElementById("catalogue")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, []);

  return (
    <>
      <StatusHero
        updatedAt={updatedAt}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        visibleCount={visibleInterventions.length}
      />
      <LocalClimatePanel onProfileChange={setClimateProfile} />
      {climateProfile ? (
        <ClimateRecommendationStrip profile={climateProfile} />
      ) : null}
      <CoolingCatalogue activeFilter={activeFilter} pulse={cataloguePulse} />
    </>
  );
}
