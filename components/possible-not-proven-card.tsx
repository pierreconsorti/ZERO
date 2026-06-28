import type { PossibleNotProven } from "@/lib/data/interventions";

type PossibleNotProvenCardProps = {
  idea: PossibleNotProven;
};

export function PossibleNotProvenCard({ idea }: PossibleNotProvenCardProps) {
  return (
    <article className="rounded-md border border-dashed border-zero-ink/25 bg-white/[0.55] p-5">
      <p className="font-mono text-xs uppercase text-zero-rust">Possible, not proven</p>
      <h3 className="mt-6 text-balance text-3xl font-semibold leading-tight text-zero-ink">
        {idea.title}
      </h3>
      <dl className="mt-7 grid gap-5 text-sm leading-6 md:grid-cols-2">
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
    <div>
      <dt className="font-mono text-xs uppercase text-zero-muted">{label}</dt>
      <dd className="mt-2 text-zero-ink">{value}</dd>
    </div>
  );
}
