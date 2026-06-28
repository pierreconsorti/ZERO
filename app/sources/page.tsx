import { SectionHeading } from "@/components/section-heading";
import { SourceCard } from "@/components/source-card";
import { sourceRegistry } from "@/lib/sources";

export const revalidate = 43200;

export default function SourcesPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Sources"
          title="Source registry and data transparency"
          description="ZERO keeps data provenance visible. Each source records what it is used for, how often it updates, why it is trusted, and where it is limited."
        />
        <div className="mt-12 grid gap-5">
          {sourceRegistry.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </main>
  );
}
