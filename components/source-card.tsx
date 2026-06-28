import type { SourceRecord } from "@/lib/types";

type SourceCardProps = {
  source: SourceRecord;
};

export function SourceCard({ source }: SourceCardProps) {
  return (
    <article className="rounded-lg border border-zero-rule bg-white p-5">
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
        <span className="w-fit shrink-0 rounded-full border border-zero-rule px-3 py-1 font-mono text-xs uppercase text-zero-muted">
          {source.trustLevel}
        </span>
      </div>
      <dl className="mt-6 grid gap-5 text-sm leading-6 md:grid-cols-2">
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Type</dt>
          <dd className="mt-2 text-zero-muted">{source.type}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Update frequency</dt>
          <dd className="mt-2 text-zero-muted">{source.updateFrequency}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Used for</dt>
          <dd className="mt-2 text-zero-muted">{source.usedFor}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase text-black/45">Limitations</dt>
          <dd className="mt-2 text-zero-muted">{source.limitations}</dd>
        </div>
      </dl>
    </article>
  );
}
