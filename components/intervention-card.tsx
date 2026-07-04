"use client";

import type { Intervention } from "@/lib/data/interventions";
import { estimateReadingMinutes } from "@/lib/progress";
import { trackExploredIntervention } from "@/lib/visit-tracking";
import { cn } from "@/lib/utils";
import { GlossaryText } from "./glossary-text";
import { ListenButton } from "./listen-button";
import { ShareIdeaButton } from "./share-idea-button";

type InterventionCardProps = {
  intervention: Intervention;
  index: number;
  featured?: boolean;
  className?: string;
};

export function InterventionCard({
  intervention,
  index,
  featured = false,
  className
}: InterventionCardProps) {
  const fieldNoteText = [
    intervention.mechanism,
    intervention.localPrototype,
    intervention.scale.join(" "),
    intervention.whatToMeasure.join(" "),
    intervention.risks.join(" ")
  ].join(" ");
  const readingMinutes = estimateReadingMinutes(fieldNoteText);
  const narrationText = [
    intervention.title,
    intervention.whatMakesItInteresting,
    `Mechanism: ${intervention.mechanism}`,
    `Local prototype: ${intervention.localPrototype}`,
    `Scale: ${intervention.scale.join(", ")}`,
    `Measure: ${intervention.whatToMeasure.join(", ")}`,
    `Risks and unknowns: ${intervention.risks.join(", ")}`,
    `Evidence: ${intervention.evidenceStrength}`,
    `Status: ${intervention.status}`
  ].join(". ");

  return (
    <article
      id={intervention.id}
      className={cn(
        "object-card group hover-lift relative flex min-h-[24rem] flex-col overflow-hidden p-4 sm:min-h-[29rem] sm:p-6",
        featured && "sm:min-h-[34rem] sm:p-7",
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
              "metadata-pill shrink-0 px-3 py-1.5 text-xs",
              intervention.maturity === "speculative" && "bg-black text-white"
            )}
          >
            {intervention.maturity}
          </span>
        </div>
        <h3
          className={cn(
            "display-tight-lg mt-7 text-balance text-zero-ink sm:mt-8",
            featured
              ? "text-[clamp(1.75rem,5vw,2.35rem)]"
              : "text-[clamp(1.55rem,4.5vw,2.1rem)]"
          )}
        >
          {intervention.title}
        </h3>
        <p className="mt-5 max-w-xl text-[1.03rem] leading-7 text-zero-muted sm:mt-6 sm:text-base">
          <GlossaryText text={intervention.whatMakesItInteresting} />
        </p>
      </div>

      <div className="relative mt-7 space-y-4 sm:mt-9 sm:space-y-5">
        <dl className="hidden gap-3 sm:grid sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Mechanism</dt>
            <dd className="mt-2 text-sm leading-6 text-black/[0.76]">
              <GlossaryText text={intervention.mechanism} />
            </dd>
          </div>
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Local prototype</dt>
            <dd className="mt-2 text-sm leading-6 text-black/[0.76]">
              <GlossaryText text={intervention.localPrototype} />
            </dd>
          </div>
        </dl>

        <details
          className="group/details rounded-[1.25rem] bg-black/[0.035] p-3"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              trackExploredIntervention(intervention.id);
            }
          }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-zero-ink">
            <span className="flex flex-wrap items-center gap-2">
              <span className="pill-control-light px-3 py-2 text-sm">
                Open field note
              </span>
              <span className="meta-label">{readingMinutes} min read</span>
            </span>
            <span className="pill-control-light px-3 py-1.5 font-mono text-lg leading-none transition group-open/details:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-5 grid gap-5 text-sm leading-6 md:grid-cols-3">
            <div className="sm:hidden">
              <p className="meta-label">Mechanism</p>
              <p className="mt-2 text-zero-ink">
                <GlossaryText text={intervention.mechanism} />
              </p>
            </div>
            <div className="sm:hidden">
              <p className="meta-label">Local prototype</p>
              <p className="mt-2 text-zero-ink">
                <GlossaryText text={intervention.localPrototype} />
              </p>
            </div>
            <div>
              <p className="meta-label">Scale</p>
              <p className="mt-2 text-zero-ink">
                <GlossaryText text={intervention.scale.join(", ")} />
              </p>
            </div>
            <div>
              <p className="meta-label">Measure</p>
              <p className="mt-2 text-zero-ink">
                <GlossaryText text={intervention.whatToMeasure.join(", ")} />
              </p>
            </div>
            <div>
              <p className="meta-label">Risks / unknowns</p>
              <p className="mt-2 text-zero-ink">
                <GlossaryText text={intervention.risks.join(", ")} />
              </p>
            </div>
          </div>
        </details>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="metadata-pill px-3 py-1.5 text-xs">
              Evidence: {intervention.evidenceStrength}
            </span>
            <span className="metadata-pill px-3 py-1.5 text-xs">
              Prototype locally
            </span>
            <span className="metadata-pill px-3 py-1.5 text-xs">
              {intervention.status}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <ListenButton
              text={narrationText}
              className="w-full px-4 py-2 text-sm sm:w-auto"
            />
            <ShareIdeaButton
              id={intervention.id}
              title={intervention.title}
              description={intervention.whatMakesItInteresting}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
