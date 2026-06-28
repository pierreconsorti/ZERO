import { interventions } from "@/lib/data/interventions";
import { cn } from "@/lib/utils";
import { AccentRule } from "./accent-rule";
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
    <section id="catalogue" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <AccentRule accent="catalogue" className="mb-12 opacity-70" />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase text-black/45">
              Cooling catalogue
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] text-zero-ink sm:text-6xl">
              Things that can be tried, bought, built, installed, worn, or measured.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-zero-muted">
            Things that can be painted, worn, installed, shaded, measured,
            retrofitted, grown, detected, replaced, or deployed.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
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
      </div>
    </section>
  );
}
