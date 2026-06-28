import type { SourceRecord } from "@/lib/types";

type SourceCardProps = {
  source: SourceRecord;
};

export function SourceCard({ source }: SourceCardProps) {
  return (
    <article className="object-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-zero-ink">{source.name}</h3>
          <a
            href={source.url}
            className="mt-2 inline-block text-sm text-black underline decoration-black/20 underline-offset-4"
          >
            {source.url}
          </a>
        </div>
        <span className="pill-control w-fit shrink-0 px-3 py-1 text-xs">
          {source.trustLevel}
        </span>
      </div>
      <dl className="mt-6 grid gap-5 text-sm leading-6 md:grid-cols-2">
        <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
          <dt className="meta-label">Type</dt>
          <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
            {source.type}
          </dd>
        </div>
        <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
          <dt className="meta-label">Update frequency</dt>
          <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
            {source.updateFrequency}
          </dd>
        </div>
        <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
          <dt className="meta-label">Used for</dt>
          <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
            {source.usedFor}
          </dd>
        </div>
        <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
          <dt className="meta-label">Limitations</dt>
          <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
            {source.limitations}
          </dd>
        </div>
      </dl>
    </article>
  );
}
