import { RoadmapSequence } from "@/components/roadmap-sequence";
import { SectionHeading } from "@/components/section-heading";
import { roadmapLevers } from "@/lib/content";

export const revalidate = 43200;

export default function RoadmapPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-3 py-12 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Roadmap"
          title="What has to change, how fast, and how we know"
          description="The roadmap is organized around systems, not slogans. Each lever connects a current state to a required direction of change, with evidence strength and review cadence visible."
        />
      </section>
      <RoadmapSequence levers={roadmapLevers} />
    </main>
  );
}
