import type { EvidenceProfile } from "@/lib/types";

type EvidenceProfileCardProps = {
  profile: EvidenceProfile;
};

export function EvidenceProfileCard({ profile }: EvidenceProfileCardProps) {
  return (
    <article className="rounded-lg border border-zero-rule bg-white p-5 shadow-quiet">
      <div className="flex flex-col gap-4 border-b border-zero-rule pb-5 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-balance text-xl font-semibold leading-snug text-zero-ink">
          {profile.claim}
        </h3>
        <span className="w-fit shrink-0 rounded-full border border-zero-blue/25 bg-zero-blue/5 px-3 py-1 font-mono text-xs uppercase text-zero-blue">
          {profile.strengthOfEvidence}
        </span>
      </div>
      <dl className="mt-5 grid gap-5 md:grid-cols-2">
        <EvidenceField label="What we know" value={profile.whatWeKnow} />
        <EvidenceField label="What we believe" value={profile.whatWeBelieve} />
        <EvidenceField label="What we suspect" value={profile.whatWeSuspect} />
        <EvidenceField label="What remains unknown" value={profile.whatRemainsUnknown} />
        <EvidenceField label="Scientific consensus" value={profile.scientificConsensus} />
        <EvidenceField label="Research maturity" value={profile.researchMaturity} />
        <EvidenceField label="Known disagreements" value={profile.knownDisagreements} />
        <EvidenceField label="Review schedule" value={profile.reviewSchedule} />
      </dl>
    </article>
  );
}

function EvidenceField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase text-zero-rust">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-zero-muted">{value}</dd>
    </div>
  );
}
