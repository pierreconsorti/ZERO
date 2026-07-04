import {
  filterInterventions,
  type InterventionFilter
} from "@/lib/data/intervention-filters";
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

type CoolingCatalogueProps = {
  activeFilter?: InterventionFilter;
  pulse?: boolean;
};

export function CoolingCatalogue({
  activeFilter = "All",
  pulse = false
}: CoolingCatalogueProps) {
  const visibleInterventions = filterInterventions(interventions, activeFilter);
  const prototypeReadyCount = visibleInterventions.filter(
    (intervention) => intervention.localPrototype
  ).length;

  return (
    <section id="catalogue" className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <AtmosphericPanel
        tone="mist"
        className={cn("py-5 sm:py-12 lg:py-16", pulse && "catalogue-pulse")}
        contentClassName="mx-auto max-w-7xl px-1.5 sm:px-8 lg:px-10"
      >
        <div className="object-card grid gap-5 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="meta-label">Field index</p>
            <h2 className="display-tight-lg mt-4 max-w-3xl text-balance text-[clamp(1.9rem,7.2vw,2.55rem)] text-zero-ink">
              Ideas that can be tried, bought, built, installed, worn, or measured.
            </h2>
          </div>
          <div className="space-y-4">
            <p className="max-w-2xl text-[1.03rem] leading-7 text-zero-muted sm:text-lg sm:leading-8">
              Paint, fabric, shade, detection, retrofit, procurement, and
              measurement paths gathered into one browsable working surface.
            </p>
            <p className="metadata-pill w-fit px-3 py-1.5 text-sm">
              {activeFilter === "All"
                ? `${visibleInterventions.length} interventions`
                : `${visibleInterventions.length} in ${activeFilter}`}
            </p>
            <p className="text-sm leading-6 text-zero-muted">
              {prototypeReadyCount} of {visibleInterventions.length} visible
              interventions include local prototype notes.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-12">
          {visibleInterventions.map((intervention, index) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              index={index}
              featured={index === 0}
              className={cn(
                cardSpans[index % cardSpans.length],
                index === 0 && "xl:row-span-2"
              )}
            />
          ))}
        </div>
      </AtmosphericPanel>
    </section>
  );
}
