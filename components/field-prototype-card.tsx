import type { FieldPrototype } from "@/lib/data/interventions";

type FieldPrototypeCardProps = {
  prototype: FieldPrototype;
  index: number;
};

export function FieldPrototypeCard({ prototype, index }: FieldPrototypeCardProps) {
  return (
    <article
      id={prototype.id}
      className="object-card relative overflow-hidden p-4 text-black sm:p-6"
    >
      <div className="relative flex items-start justify-between gap-6">
        <p className="meta-label">
          Prototype {String(index + 1).padStart(2, "0")}
        </p>
        <span className="metadata-pill px-2.5 py-1 text-[0.65rem]">
          field test
        </span>
      </div>
      <h3 className="display-tight-md relative mt-8 text-balance text-[clamp(1.55rem,5.7vw,2rem)] sm:mt-10">
        {prototype.title}
      </h3>
      <p className="relative mt-5 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
        {prototype.whatToTest}
      </p>
      <details className="group/details relative mt-7 rounded-[1.25rem] bg-black/[0.035] p-3 text-sm leading-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-zero-ink">
          <span className="pill-control-light px-3 py-2 text-sm">Open test note</span>
          <span className="pill-control-light px-3 py-1.5 font-mono text-lg leading-none transition group-open/details:rotate-45">
            +
          </span>
        </summary>
        <dl className="mt-5 grid gap-5">
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
          <div className="grid gap-4 sm:grid-cols-2">
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
      </details>
    </article>
  );
}
