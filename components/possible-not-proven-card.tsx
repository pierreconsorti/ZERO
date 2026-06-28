import type { PossibleNotProven } from "@/lib/data/interventions";

type PossibleNotProvenCardProps = {
  idea: PossibleNotProven;
};

export function PossibleNotProvenCard({ idea }: PossibleNotProvenCardProps) {
  return (
    <article className="object-card relative overflow-hidden p-4 sm:p-6">
      <p className="meta-label relative">Possible, not proven</p>
      <h3 className="display-tight-md relative mt-6 text-balance text-[clamp(1.55rem,5.7vw,2rem)] text-zero-ink">
        {idea.title}
      </h3>
      <dl className="relative mt-7 grid gap-5 text-sm leading-6 md:grid-cols-2">
        <SpecField label="Hypothesis" value={idea.hypothesis} />
        <SpecField label="Mechanism" value={idea.mechanism} />
        <SpecField label="What would need to be true" value={idea.whatWouldNeedToBeTrue} />
        <SpecField label="What could go wrong" value={idea.whatCouldGoWrong} />
        <SpecField label="Smallest useful test" value={idea.smallestUsefulTest} />
        <SpecField
          label="What would change our mind"
          value={idea.evidenceThatWouldChangeOurMind}
        />
      </dl>
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
