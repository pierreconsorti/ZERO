import type { FieldPrototype } from "@/lib/data/interventions";
import { accentGradient, prototypeAccentKeys } from "@/lib/data/color-studies";

type FieldPrototypeCardProps = {
  prototype: FieldPrototype;
  index: number;
};

export function FieldPrototypeCard({ prototype, index }: FieldPrototypeCardProps) {
  const accent = prototypeAccentKeys[index % prototypeAccentKeys.length];

  return (
    <article className="relative overflow-hidden rounded-md border border-black/[0.06] bg-white p-5 text-black shadow-quiet">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: accentGradient(accent) }}
      />
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-xs uppercase text-black/45">
          Prototype {String(index + 1).padStart(2, "0")}
        </p>
        <span className="rounded-full border border-black/[0.08] px-2.5 py-1 font-mono text-[0.65rem] uppercase text-black/60">
          field test
        </span>
      </div>
      <h3 className="mt-10 text-balance text-3xl font-semibold leading-none">
        {prototype.title}
      </h3>
      <p className="mt-5 text-sm leading-6 text-zero-muted">{prototype.whatToTest}</p>
      <dl className="mt-8 grid gap-5 pt-5 text-sm leading-6">
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Where to try it</dt>
          <dd className="mt-2 text-black">{prototype.whereToTryIt}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">What to measure</dt>
          <dd className="mt-2 text-black">{prototype.whatToMeasure.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Tools needed</dt>
          <dd className="mt-2 text-black">{prototype.toolsNeeded.join(", ")}</dd>
        </div>
        <div className="grid gap-4 pt-5 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase text-black/45">
              Evidence value
            </dt>
            <dd className="mt-2 text-black">{prototype.evidenceValue}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase text-black/45">
              Possible risk
            </dt>
            <dd className="mt-2 text-black">{prototype.possibleRisk}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}
