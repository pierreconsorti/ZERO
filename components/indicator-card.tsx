import type { CSSProperties } from "react";
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

const confidenceScore = {
  "Very high": 92,
  High: 78,
  Medium: 58,
  Low: 38
};

function signalBars(indicator: ClimateIndicator) {
  const seed = indicator.id
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return Array.from({ length: 14 }, (_, index) => 24 + ((seed + index * 17) % 58));
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const score =
    indicator.status === "unavailable" ? 28 : confidenceScore[indicator.confidence];
  const style = { "--signal-score": `${score}%` } as CSSProperties;

  return (
    <article
      className={cn(
        "object-card hover-lift flex min-h-[20rem] flex-col justify-between p-4 sm:min-h-[21rem] sm:p-5",
        indicator.status === "unavailable" && "bg-white/[0.62]"
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-zero-ink">{indicator.name}</h3>
          <span
            className={cn(
              "metadata-pill shrink-0 px-2 py-1 text-[0.68rem]",
              indicator.status === "unavailable" && "bg-white text-zero-muted"
            )}
          >
            {statusLabel[indicator.status]}
          </span>
        </div>
        <div className="mt-8 flex items-end gap-2">
          <p className="display-tight-lg tabular text-[clamp(2.5rem,8vw,3rem)] text-zero-ink">
            {indicator.value}
          </p>
          {indicator.unit ? (
            <p className="pb-1 text-lg text-zero-muted">{indicator.unit}</p>
          ) : null}
        </div>
        <p className="mt-5 text-sm font-medium text-black">{indicator.trend}</p>
        <div className="signal-visual mt-6" style={style}>
          <div className="signal-gauge" aria-hidden="true">
            <span />
          </div>
          <div className="signal-bars" aria-hidden="true">
            {signalBars(indicator).map((height, index) => (
              <span
                key={`${indicator.id}-${index}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-5">
        <p className="text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
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
