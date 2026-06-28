import { AccentRule } from "./accent-rule";

type StatusHeroProps = {
  updatedAt: string;
};

export function StatusHero({ updatedAt }: StatusHeroProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1fr_0.82fr] lg:items-stretch lg:px-10">
      <div className="flex flex-col justify-between gap-12">
        <div>
          <p className="font-mono text-sm uppercase text-black">ZERO</p>
          <h1 className="mt-5 max-w-5xl text-balance text-6xl font-semibold leading-[0.95] text-zero-ink sm:text-7xl lg:text-8xl">
            A catalogue of planetary cooling possibilities
          </h1>
          <AccentRule accent="hero" className="mt-8 max-w-3xl opacity-80" />
        </div>
        <div className="grid gap-4 py-5 text-sm sm:grid-cols-3">
          <div>
            <p className="font-mono uppercase text-black/45">Frame</p>
            <p className="mt-1 text-zero-ink">materials, inventions, prototypes</p>
          </div>
          <div>
            <p className="font-mono uppercase text-black/45">Signal</p>
            <p className="mt-1 text-zero-ink">evidence, scale, risk, possibility</p>
          </div>
          <div>
            <p className="font-mono uppercase text-black/45">Updated</p>
            <p className="mt-1 text-zero-ink">{updatedAt}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-10 rounded-md border border-black/[0.06] bg-white p-5 shadow-quiet sm:p-7">
        <div className="grid grid-cols-[1fr_auto] gap-4 pb-6">
          <div>
            <p className="font-mono text-xs uppercase text-black/45">Cooling index</p>
            <p className="mt-2 text-sm leading-6 text-zero-muted">
              What can be tested, funded, regulated, installed, worn, painted,
              detected, or prototyped before the next hot season?
            </p>
          </div>
          <p className="tabular text-7xl font-semibold leading-none text-zero-ink sm:text-8xl">
            0°
          </p>
        </div>

        <div>
          <p className="max-w-xl text-2xl leading-9 text-zero-ink">
            What can we try next summer?
          </p>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zero-muted">
            A living catalogue of cooling materials, urban experiments, passive
            systems, and climate interventions organized by evidence, scale,
            risk, and possibility.
          </p>
        </div>

        <AccentRule accent="hero" className="opacity-70" />
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="font-mono uppercase text-black/45">First question</dt>
            <dd className="mt-1 text-zero-ink">What is cool, new, testable, and honest?</dd>
          </div>
          <div>
            <dt className="font-mono uppercase text-black/45">Evidence support</dt>
            <dd className="mt-1 text-zero-ink">
              NASA, NOAA, Copernicus, OWID, IEA where available
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
