import type { Intervention } from "@/lib/data/interventions";
import {
  accentGradient,
  interventionAccentMap,
  softAccentGradient
} from "@/lib/data/color-studies";
import { cn } from "@/lib/utils";
import { SaveIdeaButton } from "./save-idea-button";

type InterventionCardProps = {
  intervention: Intervention;
  index: number;
  featured?: boolean;
  className?: string;
};

const maturityTone: Record<Intervention["maturity"], string> = {
  known: "bg-white text-black/60 border-black/[0.08]",
  deployable: "bg-white text-black/60 border-black/[0.08]",
  emerging: "bg-white text-black/60 border-black/[0.08]",
  experimental: "bg-white text-black/60 border-black/[0.08]",
  speculative: "bg-white text-black/60 border-black/[0.08]"
};

export function InterventionCard({
  intervention,
  index,
  featured = false,
  className
}: InterventionCardProps) {
  const accent = interventionAccentMap[intervention.id] ?? "catalogue";

  return (
    <article
      className={cn(
        "group hover-lift relative flex min-h-[30rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-5 shadow-quiet sm:p-6",
        featured && "min-h-[38rem] rounded-[2.5rem] p-6 sm:p-8",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 opacity-80 blur-2xl"
        style={{ background: softAccentGradient(accent) }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[0.66rem] uppercase text-black/44">
            {String(index + 1).padStart(2, "0")} / {intervention.category}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs",
              maturityTone[intervention.maturity]
            )}
          >
            {intervention.maturity}
          </span>
        </div>
        <h3
          className={cn(
            "mt-8 text-balance font-semibold leading-[0.92] text-zero-ink",
            featured ? "text-5xl sm:text-6xl" : "text-4xl"
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
          <div>
            <dt className="font-mono text-[0.64rem] uppercase text-black/42">Mechanism</dt>
            <dd className="mt-2 text-sm leading-6 text-black/76">
              {intervention.mechanism}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.64rem] uppercase text-black/42">
              Local prototype
            </dt>
            <dd className="mt-2 text-sm leading-6 text-black/76">
              {intervention.localPrototype}
            </dd>
          </div>
        </dl>

        <details className="group/details rounded-[1.5rem] bg-black/[0.035] p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-zero-ink">
            <span className="rounded-full bg-white px-3 py-2 text-sm shadow-quiet">
              Open field note
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 font-mono text-lg leading-none shadow-quiet transition group-open/details:rotate-45">
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
            <span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-xs text-black/62">
              Evidence: {intervention.evidenceStrength}
            </span>
            <span
              className="rounded-full px-3 py-1.5 text-xs text-white shadow-quiet"
              style={{ background: accentGradient(accent) }}
            >
              Prototype locally
            </span>
            <span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-xs text-black/62">
              {intervention.status}
            </span>
          </div>
          <SaveIdeaButton id={intervention.id} />
        </div>
      </div>
    </article>
  );
}
