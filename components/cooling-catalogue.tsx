import { interventions } from "@/lib/data/interventions";
import { cn } from "@/lib/utils";
import { AtmosphericPanel } from "./atmospheric-panel";
import { InterventionCard } from "./intervention-card";

const cardSpans = [
  "xl:col-span-7",
  "xl:col-span-5",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-6",
  "xl:col-span-6",
  "xl:col-span-5",
  "xl:col-span-7"
];

export function CoolingCatalogue() {
  return (
    <section id="catalogue" className="px-2 py-5 sm:px-5 sm:py-8 lg:px-8">
      <AtmosphericPanel
        tone="mist"
        className="py-5 sm:py-12 lg:py-16"
        contentClassName="mx-auto max-w-7xl px-2 sm:px-8 lg:px-10"
      >
        <div className="object-card grid gap-5 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="meta-label">Cooling catalogue</p>
            <h2 className="display-tight-lg mt-4 max-w-3xl text-balance text-[clamp(2.35rem,9.5vw,3.25rem)] text-zero-ink">
              Things that can be tried, bought, built, installed, worn, or measured.
            </h2>
          </div>
          <p className="max-w-2xl text-[1.03rem] leading-7 text-zero-muted sm:text-lg sm:leading-8">
            Things that can be painted, worn, installed, shaded, measured,
            retrofitted, grown, detected, replaced, or deployed.
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-12">
          {interventions.map((intervention, index) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              index={index}
              featured={index === 0}
              className={cn(cardSpans[index], index === 0 && "xl:row-span-2")}
            />
          ))}
        </div>
      </AtmosphericPanel>
    </section>
  );
}
