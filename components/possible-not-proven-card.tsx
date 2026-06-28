import type { PossibleNotProven } from "@/lib/data/interventions";
import { accentGradient } from "@/lib/data/color-studies";

type PossibleNotProvenCardProps = {
  idea: PossibleNotProven;
};

export function PossibleNotProvenCard({ idea }: PossibleNotProvenCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-quiet sm:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 opacity-70 blur-2xl"
        style={{ background: accentGradient("speculation") }}
      />
      <p className="relative font-mono text-xs uppercase text-black/45">
        Possible, not proven
      </p>
      <h3 className="relative mt-6 text-balance text-3xl font-semibold leading-[0.98] text-zero-ink">
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
    <div>
      <dt className="font-mono text-xs uppercase text-zero-muted">{label}</dt>
      <dd className="mt-2 text-zero-ink">{value}</dd>
    </div>
  );
}
