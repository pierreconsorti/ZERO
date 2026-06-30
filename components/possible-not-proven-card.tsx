import type { PossibleNotProven } from "@/lib/data/interventions";

type PossibleNotProvenCardProps = {
  idea: PossibleNotProven;
  index: number;
};

export function PossibleNotProvenCard({ idea, index }: PossibleNotProvenCardProps) {
  return (
    <article className="object-card relative overflow-hidden p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="meta-label relative">Evidence brake</p>
        <span className="metadata-pill px-3 py-1 text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.45rem] bg-black p-5 text-white">
          <p className="meta-label text-white">Hypothesis</p>
          <h3 className="display-tight-md mt-5 text-balance text-[clamp(1.55rem,5.7vw,2.15rem)] text-white">
            {idea.title}
          </h3>
          <p className="mt-5 text-sm leading-6 text-white">{idea.hypothesis}</p>
        </div>
        <dl className="grid gap-3 text-sm leading-6">
          <SpecField label="Mechanism" value={idea.mechanism} />
          <SpecField label="Needs to be true" value={idea.whatWouldNeedToBeTrue} />
          <SpecField label="Could go wrong" value={idea.whatCouldGoWrong} />
          <SpecField label="Smallest useful test" value={idea.smallestUsefulTest} />
          <SpecField
            label="Evidence that changes it"
            value={idea.evidenceThatWouldChangeOurMind}
          />
        </dl>
      </div>
    </article>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
      <dt className="meta-label">{label}</dt>
      <dd className="mt-2 text-[0.98rem] leading-6 text-zero-ink sm:text-sm">
        {value}
      </dd>
    </div>
  );
}
