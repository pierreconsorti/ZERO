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
              className="grid gap-6 rounded-[1.25rem] bg-white p-5 shadow-quiet lg:grid-cols-[7rem_1fr_1fr] lg:p-6"
            >
              <div className="font-mono text-sm text-zero-muted">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-balance text-2xl font-semibold text-zero-ink">
                  {lever.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-zero-muted">
                  {lever.currentState}
                </p>
              </div>
              <dl className="grid gap-5 text-sm leading-6">
                <div>
                  <dt className="font-mono text-xs uppercase text-black/45">
                    What needs to change
                  </dt>
                  <dd className="mt-2 text-zero-ink">{lever.whatNeedsToChange}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase text-black/45">
                    Speed required
                  </dt>
                  <dd className="mt-2 text-zero-ink">{lever.speedRequired}</dd>
                </div>
                {!compact ? (
                  <>
                    <div>
                      <dt className="font-mono text-xs uppercase text-black/45">
                        Why it matters
                      </dt>
                      <dd className="mt-2 text-zero-ink">{lever.whyItMatters}</dd>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <dt className="font-mono text-xs uppercase text-zero-muted">
                          Evidence
                        </dt>
                        <dd className="mt-1 text-zero-ink">{lever.evidenceStrength}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-xs uppercase text-zero-muted">
                          Sources
                        </dt>
                        <dd className="mt-1 text-zero-ink">
                          {lever.dataSources.join(", ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-xs uppercase text-zero-muted">
                          Review
                        </dt>
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
