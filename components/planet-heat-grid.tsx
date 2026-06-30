import type { ClimateIndicator } from "@/lib/types";
import { AtmosphericPanel } from "./atmospheric-panel";
import { IndicatorCard } from "./indicator-card";
import { SectionHeading } from "./section-heading";

type PlanetHeatGridProps = {
  indicators: ClimateIndicator[];
};

export function PlanetHeatGrid({ indicators }: PlanetHeatGridProps) {
  return (
    <section className="px-2 py-5 sm:px-5 sm:py-8 lg:px-8">
      <AtmosphericPanel
        tone="paper"
        className="py-5 sm:py-12 lg:py-16"
        contentClassName="mx-auto max-w-7xl px-2 sm:px-8 lg:px-10"
      >
        <SectionHeading
          eyebrow="Planetary signals"
          title="Measurements that reveal the bend"
          description="A compact signal board for heat, gases, energy, and ocean context. Live values stay separated from fallback records so the evidence surface remains honest."
        />
        <div className="mt-5 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
          {indicators.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </AtmosphericPanel>
    </section>
  );
}
