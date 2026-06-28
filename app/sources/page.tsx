import { EditorialImageFrame } from "@/components/editorial-image-frame";
import { SectionHeading } from "@/components/section-heading";
import { SourceCard } from "@/components/source-card";
import { editorialImages } from "@/lib/data/editorial-images";
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
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <SectionHeading
          eyebrow="Editorial Image Archive"
          title="Images are evidence, not decoration"
          description="ZERO uses a small number of sourced archival, scientific, or engineering images only when they clarify a material, mechanism, or public-infrastructure intervention."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {editorialImages.map((image) => (
            <EditorialImageFrame key={image.id} image={image} variant="source" />
          ))}
        </div>
      </section>
    </main>
  );
}
