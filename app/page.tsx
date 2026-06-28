import Link from "next/link";
import { AtmosphericPanel } from "@/components/atmospheric-panel";
import { CoolingCatalogue } from "@/components/cooling-catalogue";
import { EvidenceProfileCard } from "@/components/evidence-profile-card";
import { FieldPrototypeCard } from "@/components/field-prototype-card";
import { PlanetHeatGrid } from "@/components/planet-heat-grid";
import { PossibleNotProvenCard } from "@/components/possible-not-proven-card";
import { RoadmapSequence } from "@/components/roadmap-sequence";
import { SectionHeading } from "@/components/section-heading";
import { StatusHero } from "@/components/status-hero";
import { evidenceProfiles, roadmapLevers } from "@/lib/content";
import { getPlanetHeatIndicators } from "@/lib/data";
import { fieldPrototypes, possibleNotProven } from "@/lib/data/interventions";
import { formatDate } from "@/lib/utils";

export const revalidate = 21600;

export default async function HomePage() {
  const indicators = await getPlanetHeatIndicators();

  return (
    <main>
      <StatusHero updatedAt={formatDate()} />
      <CoolingCatalogue />

      <section className="px-2 py-5 sm:px-5 sm:py-8 lg:px-8">
        <AtmosphericPanel
          tone="paper"
          className="py-5 sm:py-12 lg:py-16"
          contentClassName="mx-auto max-w-7xl px-2 sm:px-8 lg:px-10"
        >
          <div className="object-card grid gap-5 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="meta-label">Field prototypes</p>
              <h2 className="display-tight-lg mt-4 max-w-3xl text-balance text-[clamp(2.35rem,9.5vw,3.25rem)] text-black">
                Small tests before next summer.
              </h2>
            </div>
            <p className="max-w-2xl text-[1.03rem] leading-7 text-zero-muted sm:text-lg sm:leading-8">
              Practical experiments a city, school, studio, neighborhood, or
              building owner could run without pretending the whole system is solved.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fieldPrototypes.map((prototype, index) => (
              <FieldPrototypeCard
                key={prototype.id}
                prototype={prototype}
                index={index}
              />
            ))}
          </div>
        </AtmosphericPanel>
      </section>

      <section className="px-2 py-5 sm:px-5 sm:py-8 lg:px-8">
        <AtmosphericPanel
          tone="warm"
          className="py-5 sm:py-12 lg:py-16"
          contentClassName="mx-auto max-w-7xl px-2 sm:px-8 lg:px-10"
        >
          <div className="object-card grid gap-5 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="meta-label">Possible, not proven</p>
              <h2 className="display-tight-lg mt-4 text-balance text-[clamp(2.35rem,9.5vw,3.25rem)] text-zero-ink">
                Imagination with an evidence brake.
              </h2>
            </div>
            <p className="max-w-2xl text-[1.03rem] leading-7 text-zero-muted sm:text-lg sm:leading-8">
              ZERO can think speculatively, but it has to say what would need to
              be true, what could go wrong, and what evidence would change the
              idea.
            </p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {possibleNotProven.map((idea) => (
              <PossibleNotProvenCard key={idea.id} idea={idea} />
            ))}
          </div>
        </AtmosphericPanel>
      </section>

      <PlanetHeatGrid indicators={indicators} />
      <RoadmapSequence levers={roadmapLevers} compact />
      <section className="px-2 py-5 sm:px-5 sm:py-8 lg:px-8">
        <AtmosphericPanel
          tone="mist"
          className="py-5 sm:py-12 lg:py-16"
          contentClassName="mx-auto max-w-7xl px-2 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Evidence Profiles"
              title="Confidence is part of the interface"
              description="ZERO should never simply assert. Every major claim is organized by what is known, believed, suspected, and still uncertain."
            />
            <Link
              href="/evidence"
              className="pill-control-light w-fit px-4 py-2 text-sm transition hover:bg-black hover:text-white"
            >
              View methodology
            </Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {evidenceProfiles.slice(0, 2).map((profile) => (
              <EvidenceProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </AtmosphericPanel>
      </section>
    </main>
  );
}
