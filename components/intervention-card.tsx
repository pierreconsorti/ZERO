import type { Intervention } from "@/lib/data/interventions";
import { cn } from "@/lib/utils";
import { MetaPillPopover } from "./meta-pill-popover";
import { SaveIdeaButton } from "./save-idea-button";

type InterventionCardProps = {
  intervention: Intervention;
  index: number;
  featured?: boolean;
  className?: string;
};

const maturityDescriptions: Record<Intervention["maturity"], string> = {
  known: "Known method, under-deployed in many places.",
  deployable: "Ready for controlled pilots, procurement, or seasonal rollout.",
  emerging: "Technically promising, but local validation still matters.",
  experimental: "Use small pilots and careful measurement before scaling.",
  speculative: "Possible, not proven; start with the smallest useful test."
};

const evidenceDescriptions: Record<Intervention["evidenceStrength"], string> = {
  "very high": "Strong, repeated evidence across contexts.",
  high: "Good evidence; still check local conditions and tradeoffs.",
  medium: "Promising evidence with context-sensitive outcomes.",
  early: "Early evidence; useful for measured pilots.",
  speculative: "Hypothesis-level evidence; test cautiously."
};

function statusDescription(status: string) {
  return `Status note: ${status}. Use this as a cue for whether the idea belongs in a pilot, procurement note, or watchlist.`;
}

export function InterventionCard({
  intervention,
  index,
  featured = false,
  className
}: InterventionCardProps) {
  return (
    <article
      className={cn(
        "object-card group hover-lift relative flex min-h-[24rem] flex-col justify-between overflow-hidden p-4 sm:min-h-[29rem] sm:p-6",
        featured && "sm:min-h-[34rem] sm:p-7",
        className
      )}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="meta-label">
            {String(index + 1).padStart(2, "0")} / {intervention.category}
          </p>
          <MetaPillPopover
            label={intervention.maturity}
            description={maturityDescriptions[intervention.maturity]}
            dark={intervention.maturity === "speculative"}
          />
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
          {intervention.whatMakesItInteresting}
        </p>
      </div>

      <div className="relative mt-7 space-y-4 sm:mt-9 sm:space-y-5">
        <dl className="hidden gap-3 sm:grid sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Mechanism</dt>
            <dd className="mt-2 text-sm leading-6 text-black/[0.76]">
              {intervention.mechanism}
            </dd>
          </div>
          <div className="rounded-[1.25rem] bg-black/[0.035] p-4">
            <dt className="meta-label text-[0.64rem]">Local prototype</dt>
            <dd className="mt-2 text-sm leading-6 text-black/[0.76]">
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
            <div className="sm:hidden">
              <p className="meta-label">Mechanism</p>
              <p className="mt-2 text-zero-ink">{intervention.mechanism}</p>
            </div>
            <div className="sm:hidden">
              <p className="meta-label">Local prototype</p>
              <p className="mt-2 text-zero-ink">{intervention.localPrototype}</p>
            </div>
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
            <MetaPillPopover
              label={`Evidence: ${intervention.evidenceStrength}`}
              description={evidenceDescriptions[intervention.evidenceStrength]}
            />
            <MetaPillPopover
              label="Prototype locally"
              description="Start with a small, measured local test before treating the idea as infrastructure."
            />
            <MetaPillPopover
              label={intervention.status}
              description={statusDescription(intervention.status)}
            />
          </div>
          <SaveIdeaButton id={intervention.id} />
        </div>
      </div>
    </article>
  );
}
