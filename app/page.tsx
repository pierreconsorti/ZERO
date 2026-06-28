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

      <section className="px-3 py-8 sm:px-5 lg:px-8">
        <AtmosphericPanel
          accent="field"
          className="py-12 sm:py-16"
          contentClassName="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-black/45">
                Field prototypes
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-5xl font-semibold leading-none text-black sm:text-6xl">
                Small tests before next summer.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-zero-muted">
              Practical experiments a city, school, studio, neighborhood, or
              building owner could run without pretending the whole system is solved.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <section className="px-3 py-8 sm:px-5 lg:px-8">
        <AtmosphericPanel
          accent="speculation"
          className="py-12 sm:py-16"
          contentClassName="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-black/45">
                Possible, not proven
              </p>
              <h2 className="mt-4 text-balance text-5xl font-semibold leading-none text-zero-ink sm:text-6xl">
                Imagination with an evidence brake.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-zero-muted">
              ZERO can think speculatively, but it has to say what would need to
              be true, what could go wrong, and what evidence would change the
              idea.
            </p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {possibleNotProven.map((idea) => (
              <PossibleNotProvenCard key={idea.id} idea={idea} />
            ))}
          </div>
        </AtmosphericPanel>
      </section>

      <PlanetHeatGrid indicators={indicators} />
      <RoadmapSequence levers={roadmapLevers} compact />
      <section className="px-3 py-8 sm:px-5 lg:px-8">
        <AtmosphericPanel
          accent="evidence"
          className="py-12 sm:py-16"
          contentClassName="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Evidence Profiles"
              title="Confidence is part of the interface"
              description="ZERO should never simply assert. Every major claim is organized by what is known, believed, suspected, and still uncertain."
            />
            <Link
              href="/evidence"
              className="w-fit rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm text-zero-ink transition hover:border-black hover:bg-black hover:text-white"
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
