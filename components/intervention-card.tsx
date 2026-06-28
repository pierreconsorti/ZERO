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
  known: "bg-black/[0.055] text-black/62",
  deployable: "bg-black/[0.055] text-black/62",
  emerging: "bg-black/[0.055] text-black/62",
  experimental: "bg-black/[0.055] text-black/62",
  speculative: "bg-black text-white"
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
        "object-card group hover-lift relative flex min-h-[31rem] flex-col justify-between overflow-hidden p-5 sm:p-6",
        featured && "min-h-[39rem] p-6 sm:p-8",
        className
      )}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="meta-label">
            {String(index + 1).padStart(2, "0")} / {intervention.category}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs",
              maturityTone[intervention.maturity]
            )}
          >
            {intervention.maturity}
          </span>
        </div>
        <h3
          className={cn(
            "display-tight-soft mt-8 text-balance text-zero-ink",
            featured ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
          )}
        >
          {intervention.title}
        </h3>
        <p className="mt-6 max-w-xl text-base leading-7 text-zero-muted">
          {intervention.whatMakesItInteresting}
        </p>
      </div>

      <div className="relative mt-9 space-y-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Mechanism</dt>
            <dd className="mt-2 text-sm leading-6 text-black/76">
              {intervention.mechanism}
            </dd>
          </div>
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Local prototype</dt>
            <dd className="mt-2 text-sm leading-6 text-black/76">
              {intervention.localPrototype}
            </dd>
          </div>
        </dl>

        <details className="group/details rounded-[1.25rem] bg-black/[0.035] p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-zero-ink">
            <span className="pill-control-light px-3 py-2 text-sm">
              Open field note
            </span>
            <span className="pill-control-light px-3 py-1.5 font-mono text-lg leading-none transition group-open/details:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-5 grid gap-5 text-sm leading-6 md:grid-cols-3">
            <div>
              <p className="meta-label">Scale</p>
              <p className="mt-2 text-zero-ink">{intervention.scale.join(", ")}</p>
            </div>
            <div>
              <p className="meta-label">Measure</p>
              <p className="mt-2 text-zero-ink">
                {intervention.whatToMeasure.join(", ")}
              </p>
            </div>
            <div>
              <p className="meta-label">Risks / unknowns</p>
              <p className="mt-2 text-zero-ink">{intervention.risks.join(", ")}</p>
            </div>
          </div>
        </details>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="pill-control px-3 py-1.5 text-xs">
              Evidence: {intervention.evidenceStrength}
            </span>
            <span className="pill-control-light px-3 py-1.5 text-xs">
              Prototype locally
            </span>
            <span className="pill-control px-3 py-1.5 text-xs">
              {intervention.status}
            </span>
          </div>
          <SaveIdeaButton id={intervention.id} />
        </div>
      </div>
    </article>
  );
}
