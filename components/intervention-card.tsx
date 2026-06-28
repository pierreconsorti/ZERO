import type { Intervention } from "@/lib/data/interventions";
import { cn } from "@/lib/utils";
import { SaveIdeaButton } from "./save-idea-button";

type InterventionCardProps = {
  intervention: Intervention;
  index: number;
  featured?: boolean;
  className?: string;
};

const maturityTone: Record<Intervention["maturity"], string> = {
  known: "bg-zero-moss/10 text-zero-moss border-zero-moss/20",
  deployable: "bg-zero-blue/10 text-zero-blue border-zero-blue/20",
  emerging: "bg-zero-rust/10 text-zero-rust border-zero-rust/20",
  experimental: "bg-zero-amber/10 text-zero-amber border-zero-amber/25",
  speculative: "bg-zero-ink/5 text-zero-muted border-zero-ink/[0.15]"
};

export function InterventionCard({
  intervention,
  index,
  featured = false,
  className
}: InterventionCardProps) {
  return (
    <article
      className={cn(
        "group hover-lift flex min-h-[29rem] flex-col justify-between rounded-md border border-zero-rule bg-white p-5 shadow-quiet",
        "relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-zero-ink",
        featured && "min-h-[36rem] bg-[#fcfbf4] p-6 sm:p-7",
        className
      )}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-xs uppercase text-zero-muted">
            {String(index + 1).padStart(2, "0")} / {intervention.category}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase",
              maturityTone[intervention.maturity]
            )}
          >
            {intervention.maturity}
          </span>
        </div>
        <h3
          className={cn(
            "mt-8 text-balance font-semibold leading-[0.98] text-zero-ink",
            featured ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
          )}
        >
          {intervention.title}
        </h3>
        <p className="mt-7 max-w-2xl text-base leading-7 text-zero-muted">
          {intervention.whatMakesItInteresting}
        </p>
      </div>

      <div className="relative mt-9 space-y-6">
        <dl className="grid gap-5 border-t border-zero-rule pt-5 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase text-zero-rust">Mechanism</dt>
            <dd className="mt-2 text-sm leading-6 text-zero-ink">
              {intervention.mechanism}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase text-zero-rust">
              Local prototype
            </dt>
            <dd className="mt-2 text-sm leading-6 text-zero-ink">
              {intervention.localPrototype}
            </dd>
          </div>
        </dl>

        <details className="group/details border-y border-zero-rule py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-zero-ink">
            <span className="font-mono text-xs uppercase">Open field notes</span>
            <span className="font-mono text-lg leading-none transition group-open/details:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-5 grid gap-5 text-sm leading-6 md:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase text-zero-muted">Scale</p>
              <p className="mt-2 text-zero-ink">{intervention.scale.join(", ")}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-zero-muted">Measure</p>
              <p className="mt-2 text-zero-ink">
                {intervention.whatToMeasure.join(", ")}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-zero-muted">
                Risks / unknowns
              </p>
              <p className="mt-2 text-zero-ink">{intervention.risks.join(", ")}</p>
            </div>
          </div>
        </details>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-zero-rule bg-zero-paper px-3 py-1 text-xs text-zero-muted">
              Evidence: {intervention.evidenceStrength}
            </span>
            <span className="rounded-full border border-zero-rule bg-zero-paper px-3 py-1 text-xs text-zero-muted">
              {intervention.status}
            </span>
          </div>
          <SaveIdeaButton id={intervention.id} />
        </div>
      </div>
    </article>
  );
}
