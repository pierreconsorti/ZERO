import type { ClimateIndicator } from "@/lib/types";
import { cn } from "@/lib/utils";

type IndicatorCardProps = {
  indicator: ClimateIndicator;
};

const statusLabel = {
  current: "Current",
  fallback: "Fallback sample",
  unavailable: "Data unavailable"
};

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  return (
    <article
      className={cn(
        "hover-lift flex min-h-[21rem] flex-col justify-between rounded-[1.75rem] bg-zero-panel p-5 shadow-quiet",
        indicator.status === "current" && "border-black/[0.06]",
        indicator.status === "fallback" && "border-black/[0.08]",
        indicator.status === "unavailable" && "border-dashed border-zero-rule bg-white/[0.55]"
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-zero-ink">{indicator.name}</h3>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-1 font-mono text-[0.68rem] uppercase",
              indicator.status === "current" &&
                "border-black/[0.08] bg-white text-black/60",
              indicator.status === "fallback" &&
                "border-black/[0.08] bg-white text-black/60",
              indicator.status === "unavailable" &&
                "border-zero-rule bg-zero-paper text-zero-muted"
            )}
          >
            {statusLabel[indicator.status]}
          </span>
        </div>
        <div className="mt-8 flex items-end gap-2">
          <p className="tabular text-5xl font-semibold leading-none text-zero-ink sm:text-6xl">
            {indicator.value}
          </p>
          {indicator.unit ? (
            <p className="pb-1 text-lg text-zero-muted">{indicator.unit}</p>
          ) : null}
        </div>
        <p className="mt-5 text-sm font-medium text-black">{indicator.trend}</p>
      </div>
      <div className="mt-8 space-y-5">
        <p className="text-sm leading-6 text-zero-muted">
          <span className="text-zero-ink">Why it matters: </span>
          {indicator.interpretation}
        </p>
        {indicator.unavailableReason ? (
          <p className="pl-3 text-xs leading-5 text-zero-muted">
            {indicator.unavailableReason}
          </p>
        ) : null}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 text-xs">
          <div>
            <dt className="font-mono uppercase text-zero-muted">Source</dt>
            <dd className="mt-1 text-zero-ink">{indicator.sourceName}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase text-zero-muted">Updated</dt>
            <dd className="mt-1 text-zero-ink">{indicator.lastUpdated}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase text-zero-muted">Confidence</dt>
            <dd className="mt-1 text-zero-ink">{indicator.confidence}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase text-zero-muted">Period</dt>
            <dd className="mt-1 text-zero-ink">{indicator.period}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
