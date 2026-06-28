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
        "object-card hover-lift flex min-h-[21rem] flex-col justify-between p-5",
        indicator.status === "unavailable" && "bg-white/[0.62]"
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-zero-ink">{indicator.name}</h3>
          <span
            className={cn(
              "pill-control shrink-0 px-2 py-1 text-[0.68rem]",
              indicator.status === "unavailable" && "bg-white text-zero-muted"
            )}
          >
            {statusLabel[indicator.status]}
          </span>
        </div>
        <div className="mt-8 flex items-end gap-2">
          <p className="display-tight-soft tabular text-5xl text-zero-ink sm:text-6xl">
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
        <dl className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div>
            <dt className="meta-label text-[0.62rem]">Source</dt>
            <dd className="mt-1 text-zero-ink">{indicator.sourceName}</dd>
          </div>
          <div>
            <dt className="meta-label text-[0.62rem]">Updated</dt>
            <dd className="mt-1 text-zero-ink">{indicator.lastUpdated}</dd>
          </div>
          <div>
            <dt className="meta-label text-[0.62rem]">Confidence</dt>
            <dd className="mt-1 text-zero-ink">{indicator.confidence}</dd>
          </div>
          <div>
            <dt className="meta-label text-[0.62rem]">Period</dt>
            <dd className="mt-1 text-zero-ink">{indicator.period}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
