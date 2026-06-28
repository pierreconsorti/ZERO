import type { ClimateIndicator } from "@/lib/types";
import { AtmosphericPanel } from "./atmospheric-panel";
import { IndicatorCard } from "./indicator-card";
import { SectionHeading } from "./section-heading";

type PlanetHeatGridProps = {
  indicators: ClimateIndicator[];
};

export function PlanetHeatGrid({ indicators }: PlanetHeatGridProps) {
  return (
    <section className="px-3 py-8 sm:px-5 lg:px-8">
      <AtmosphericPanel
        accent="signals"
        className="py-12 sm:py-16"
        contentClassName="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"
      >
        <SectionHeading
          eyebrow="Planetary signals"
          title="The measurements that tell us whether the system is bending"
          description="These signals support the catalogue. They show whether cooling interventions and emissions reductions are changing the planetary system, with fallback states visibly marked when live data cannot be loaded."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {indicators.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </AtmosphericPanel>
    </section>
  );
}
