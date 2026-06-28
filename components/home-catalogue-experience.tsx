"use client";

import { useState } from "react";
import type { InterventionFilter } from "@/lib/data/intervention-filters";
import { CoolingCatalogue } from "./cooling-catalogue";
import { StatusHero } from "./status-hero";

type HomeCatalogueExperienceProps = {
  updatedAt: string;
};

export function HomeCatalogueExperience({
  updatedAt
}: HomeCatalogueExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<InterventionFilter>("All");

  return (
    <>
      <StatusHero
        updatedAt={updatedAt}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <CoolingCatalogue activeFilter={activeFilter} />
    </>
  );
}
