import { watchlistSignals } from "@/lib/content";
import type { ClimateIndicator } from "@/lib/types";
import { SectionHeading } from "./section-heading";

type WatchlistProps = {
  indicators: ClimateIndicator[];
};

export function Watchlist({ indicators }: WatchlistProps) {
  const indicatorsById = new Map(indicators.map((indicator) => [indicator.id, indicator]));

  return (
    <section className="border-t border-zero-rule bg-white/[0.38] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="What We Are Watching"
          title="Signals that deserve close attention"
          description="The watchlist combines structured editorial priorities with the live indicator state. It can expand later to include policy, technology, and scientific developments."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {watchlistSignals.map((signal) => {
            const linkedIndicators = signal.linkedIndicatorIds
              .map((id) => indicatorsById.get(id))
              .filter((indicator): indicator is ClimateIndicator => Boolean(indicator));

            return (
              <article
                key={signal.id}
                className="rounded-lg border border-zero-rule bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-xl font-semibold text-zero-ink">{signal.label}</h3>
                  <span className="w-fit rounded-full border border-zero-rule px-3 py-1 font-mono text-xs uppercase text-zero-muted">
                    {signal.reviewCadence}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-zero-muted">{signal.whyNow}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {linkedIndicators.map((indicator) => (
                    <span
                      key={indicator.id}
                      className="rounded-full border border-zero-rule bg-zero-paper px-3 py-1 text-xs text-zero-ink"
                    >
                      {indicator.name}: {indicator.status === "current" ? indicator.trend : indicator.status}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
