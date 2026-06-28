import { AtmosphericPanel } from "./atmospheric-panel";
import { EditorialImageFrame } from "./editorial-image-frame";
import { heroEditorialImage } from "@/lib/data/editorial-images";

type StatusHeroProps = {
  updatedAt: string;
};

const categories = [
  "Materials",
  "Shade",
  "Textiles",
  "Surfaces",
  "Methane",
  "Passive cooling"
];

export function StatusHero({ updatedAt }: StatusHeroProps) {
  return (
    <div className="px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <AtmosphericPanel
        tone="mist"
        className="min-h-[calc(100vh-6rem)]"
        contentClassName="grid min-h-[calc(100vh-6rem)] gap-8 p-5 sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-10"
      >
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="font-mono text-[0.72rem] uppercase text-black/50">ZERO</p>
            <h1 className="mt-5 max-w-5xl text-balance text-6xl font-semibold leading-[0.86] text-black sm:text-7xl lg:text-8xl">
              A catalogue of planetary cooling possibilities
            </h1>
          </div>

          <div className="max-w-3xl rounded-[1.75rem] bg-white/[0.82] p-4 shadow-quiet backdrop-blur-md sm:p-5">
            <p className="text-2xl font-semibold leading-[1.05] text-black sm:text-3xl">
              What can we try next summer?
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-black/62">
              Materials, urban experiments, passive systems, and climate
              interventions organized by evidence, scale, risk, and possibility.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-black/[0.06] px-3 py-1.5 text-sm text-black/70"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-rows-[1fr_auto]">
          <div className="flex min-h-[22rem] flex-col justify-between rounded-[1.75rem] bg-white/[0.8] p-5 shadow-quiet backdrop-blur-md sm:rounded-[2.25rem] sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[0.68rem] uppercase text-black/45">
                  Cooling index
                </p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-black/58">
                  A living field guide for things that can be tested, funded,
                  regulated, installed, worn, painted, detected, or prototyped.
                </p>
              </div>
              <p className="tabular text-7xl font-semibold leading-none text-black sm:text-8xl">
                0°
              </p>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-full bg-white px-4 py-3 shadow-quiet">
                <dt className="font-mono text-[0.62rem] uppercase text-black/42">
                  Updated
                </dt>
                <dd className="mt-1 text-black">{updatedAt}</dd>
              </div>
              <div className="rounded-full bg-white px-4 py-3 shadow-quiet">
                <dt className="font-mono text-[0.62rem] uppercase text-black/42">
                  Evidence support
                </dt>
                <dd className="mt-1 text-black">NASA, NOAA, OWID, IEA</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            <EditorialImageFrame
              image={heroEditorialImage}
              variant="hero"
              className="rounded-[1.5rem] bg-white/[0.82] p-3 shadow-quiet backdrop-blur-md"
            />
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {["Evidence", "Prototype", "Scale"].map((label) => (
                <div
                  key={label}
                  className="rounded-full bg-white/[0.78] px-4 py-3 text-sm text-black/70 shadow-quiet backdrop-blur-md"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AtmosphericPanel>
    </div>
  );
}
