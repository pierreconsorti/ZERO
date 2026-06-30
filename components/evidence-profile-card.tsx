import type { EvidenceProfile } from "@/lib/types";

type EvidenceProfileCardProps = {
  profile: EvidenceProfile;
};

export function EvidenceProfileCard({ profile }: EvidenceProfileCardProps) {
  return (
    <article className="object-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-balance text-xl font-semibold leading-[1.12] text-zero-ink">
          {profile.claim}
        </h3>
        <span className="metadata-pill w-fit shrink-0 px-3 py-1 text-xs">
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
    <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
      <dt className="meta-label">{label}</dt>
      <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
        {value}
      </dd>
    </div>
  );
}
