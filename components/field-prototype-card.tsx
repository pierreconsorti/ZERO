import type { FieldPrototype } from "@/lib/data/interventions";

type FieldPrototypeCardProps = {
  prototype: FieldPrototype;
  index: number;
};

export function FieldPrototypeCard({ prototype, index }: FieldPrototypeCardProps) {
  return (
    <article className="rounded-md border border-zero-rule bg-[#101815] p-5 text-white">
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-xs uppercase text-white/[0.45]">
          Prototype {String(index + 1).padStart(2, "0")}
        </p>
        <span className="rounded-full border border-white/[0.15] px-2.5 py-1 font-mono text-[0.65rem] uppercase text-white/70">
          field test
        </span>
      </div>
      <h3 className="mt-10 text-balance text-3xl font-semibold leading-none">
        {prototype.title}
      </h3>
      <p className="mt-5 text-sm leading-6 text-white/[0.68]">{prototype.whatToTest}</p>
      <dl className="mt-8 grid gap-5 border-t border-white/[0.15] pt-5 text-sm leading-6">
        <div>
          <dt className="font-mono text-xs uppercase text-white/[0.45]">Where to try it</dt>
          <dd className="mt-2 text-white/[0.82]">{prototype.whereToTryIt}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-white/[0.45]">What to measure</dt>
          <dd className="mt-2 text-white/[0.82]">{prototype.whatToMeasure.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-white/[0.45]">Tools needed</dt>
          <dd className="mt-2 text-white/[0.82]">{prototype.toolsNeeded.join(", ")}</dd>
        </div>
        <div className="grid gap-4 border-t border-white/[0.15] pt-5 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase text-white/[0.45]">
              Evidence value
            </dt>
            <dd className="mt-2 text-white/[0.82]">{prototype.evidenceValue}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase text-white/[0.45]">
              Possible risk
            </dt>
            <dd className="mt-2 text-white/[0.82]">{prototype.possibleRisk}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}
