import type { FieldPrototype } from "@/lib/data/interventions";

type FieldPrototypeCardProps = {
  prototype: FieldPrototype;
  index: number;
};

export function FieldPrototypeCard({ prototype, index }: FieldPrototypeCardProps) {
  return (
    <article className="object-card relative overflow-hidden p-5 text-black sm:p-6">
      <div className="relative flex items-start justify-between gap-6">
        <p className="meta-label">
          Prototype {String(index + 1).padStart(2, "0")}
        </p>
        <span className="pill-control px-2.5 py-1 text-[0.65rem]">
          field test
        </span>
      </div>
      <h3 className="display-tight-soft relative mt-10 text-balance text-3xl">
        {prototype.title}
      </h3>
      <p className="relative mt-5 text-sm leading-6 text-zero-muted">
        {prototype.whatToTest}
      </p>
      <dl className="relative mt-8 grid gap-5 pt-5 text-sm leading-6">
        <div>
          <dt className="meta-label">Where to try it</dt>
          <dd className="mt-2 text-black">{prototype.whereToTryIt}</dd>
        </div>
        <div>
          <dt className="meta-label">What to measure</dt>
          <dd className="mt-2 text-black">{prototype.whatToMeasure.join(", ")}</dd>
        </div>
        <div>
          <dt className="meta-label">Tools needed</dt>
          <dd className="mt-2 text-black">{prototype.toolsNeeded.join(", ")}</dd>
        </div>
        <div className="grid gap-4 pt-5 sm:grid-cols-2">
          <div>
            <dt className="meta-label">Evidence value</dt>
            <dd className="mt-2 text-black">{prototype.evidenceValue}</dd>
          </div>
          <div>
            <dt className="meta-label">Possible risk</dt>
            <dd className="mt-2 text-black">{prototype.possibleRisk}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}
