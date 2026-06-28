import type { RoadmapLever } from "@/lib/types";
import { AtmosphericPanel } from "./atmospheric-panel";
import { SectionHeading } from "./section-heading";

type RoadmapSequenceProps = {
  levers: RoadmapLever[];
  compact?: boolean;
};

export function RoadmapSequence({ levers, compact = false }: RoadmapSequenceProps) {
  const visible = compact ? levers.slice(0, 5) : levers;

  return (
    <section className="px-3 py-8 sm:px-5 lg:px-8">
      <AtmosphericPanel
        tone="warm"
        className="py-12 sm:py-16"
        contentClassName="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"
      >
        <SectionHeading
          eyebrow="The Roadmap"
          title="The systems that must bend"
          description="ZERO organizes climate progress around the major levers required to move toward zero additional heat."
        />
        <div className="mt-12 grid gap-3">
          {visible.map((lever, index) => (
            <article
              key={lever.id}
              className="object-card grid gap-6 p-5 lg:grid-cols-[7rem_1fr_1fr] lg:p-6"
            >
              <div className="meta-label text-sm">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="display-tight-soft text-balance text-2xl text-zero-ink">
                  {lever.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-zero-muted">
                  {lever.currentState}
                </p>
              </div>
              <dl className="grid gap-5 text-sm leading-6">
                <div>
                  <dt className="meta-label">What needs to change</dt>
                  <dd className="mt-2 text-zero-ink">{lever.whatNeedsToChange}</dd>
                </div>
                <div>
                  <dt className="meta-label">Speed required</dt>
                  <dd className="mt-2 text-zero-ink">{lever.speedRequired}</dd>
                </div>
                {!compact ? (
                  <>
                    <div>
                      <dt className="meta-label">Why it matters</dt>
                      <dd className="mt-2 text-zero-ink">{lever.whyItMatters}</dd>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <dt className="meta-label">Evidence</dt>
                        <dd className="mt-1 text-zero-ink">{lever.evidenceStrength}</dd>
                      </div>
                      <div>
                        <dt className="meta-label">Sources</dt>
                        <dd className="mt-1 text-zero-ink">
                          {lever.dataSources.join(", ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="meta-label">Review</dt>
                        <dd className="mt-1 text-zero-ink">{lever.reviewDate}</dd>
                      </div>
                    </div>
                  </>
                ) : null}
              </dl>
            </article>
          ))}
        </div>
      </AtmosphericPanel>
    </section>
  );
}
