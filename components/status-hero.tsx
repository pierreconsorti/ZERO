import {
  interventionFilterOptions,
  type InterventionFilter
} from "@/lib/data/intervention-filters";
import { cn } from "@/lib/utils";
import { AtmosphericPanel } from "./atmospheric-panel";

type StatusHeroProps = {
  updatedAt: string;
  activeFilter: InterventionFilter;
  onFilterChange: (filter: InterventionFilter) => void;
};

export function StatusHero({
  updatedAt,
  activeFilter,
  onFilterChange
}: StatusHeroProps) {
  return (
    <div className="px-1.5 pb-4 pt-2 sm:px-5 sm:pb-6 lg:px-8">
      <AtmosphericPanel
        tone="mist"
        className="lg:min-h-[calc(100vh-6rem)]"
        contentClassName="grid gap-3 p-1.5 sm:gap-6 sm:p-8 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1.22fr_0.78fr] lg:p-10"
      >
        <div className="flex flex-col justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="object-card p-4 sm:p-8 lg:min-h-[30rem]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="meta-label">Public cooling catalogue</p>
              <p className="pill-control px-3 py-1.5 text-sm font-semibold text-black">
                ZERO / 0°
              </p>
            </div>
            <h1 className="display-tight-xl mt-5 max-w-[58rem] text-balance text-[clamp(2.25rem,8.6vw,5.2rem)] text-black sm:mt-6">
              A catalogue of planetary cooling possibilities
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-[1.1] text-black sm:text-xl">
              What can we try next summer?
            </p>
            <p className="mt-4 max-w-2xl text-[1.03rem] leading-7 text-black/[0.62] sm:text-base">
              A public catalogue of planetary cooling possibilities organized
              by evidence, scale, risk, and what can actually be tested.
            </p>
          </div>

          <div className="object-card max-w-3xl p-4 sm:p-5">
            <p className="meta-label">Browse by intervention family</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {interventionFilterOptions.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => onFilterChange(filter)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition",
                    activeFilter === filter
                      ? "bg-black text-white shadow-quiet"
                      : "pill-control hover:bg-black/[0.08] hover:text-black"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-rows-[1fr_auto]">
          <div className="object-card flex min-h-[17rem] flex-col justify-between p-4 sm:min-h-[22rem] sm:p-7 lg:min-h-[25rem]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="meta-label">Cooling index</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-black/[0.58]">
                  A living field guide for things that can be tested, funded,
                  regulated, installed, worn, painted, detected, or prototyped.
                </p>
              </div>
              <p className="display-tight-xl tabular text-[3.15rem] text-black sm:text-[3.65rem] lg:text-[3.85rem]">
                0°
              </p>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="pill-control-light px-4 py-3">
                <dt className="meta-label text-[0.62rem]">Updated</dt>
                <dd className="mt-1 text-black">{updatedAt}</dd>
              </div>
              <div className="pill-control-light px-4 py-3">
                <dt className="meta-label text-[0.62rem]">Evidence support</dt>
                <dd className="mt-1 text-black">NASA, NOAA, OWID, IEA</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {["Evidence", "Prototype", "Scale"].map((label) => (
              <div key={label} className="pill-control-light px-4 py-3 text-sm">
                {label}
              </div>
            ))}
          </div>
        </div>
      </AtmosphericPanel>
    </div>
  );
}
