import { EvidenceProfileCard } from "@/components/evidence-profile-card";
import { SectionHeading } from "@/components/section-heading";
import { evidenceProfiles } from "@/lib/content";

export const revalidate = 43200;

const evidenceJumpLabels: Record<string, string> = {
  "warming-human-caused": "Warming cause",
  "methane-near-term": "Methane",
  "clean-energy-scale": "Energy transition",
  "adaptation-needed": "Adaptation"
};

export default function EvidencePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-3 py-12 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Evidence"
          title="A system for becoming progressively less wrong"
          description="ZERO separates observation, interpretation, uncertainty, and review cadence. The goal is not performative certainty. The goal is clearer public reasoning."
        />
        <nav
          aria-label="Evidence sections"
          className="mt-7 flex flex-wrap gap-2"
        >
          {evidenceProfiles.map((profile) => (
            <a
              key={profile.id}
              href={`#${profile.id}`}
              className="pill-control-light px-3 py-1.5 text-sm transition hover:bg-black hover:text-white"
            >
              {evidenceJumpLabels[profile.id] ?? profile.claim}
            </a>
          ))}
        </nav>
        <div className="mt-8 grid gap-5 sm:mt-12">
          {evidenceProfiles.map((profile) => (
            <EvidenceProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-3 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <h2 className="display-tight-md text-3xl text-zero-ink">Method</h2>
          <div className="space-y-6 text-base leading-8 text-zero-muted">
            <p>
              Every claim should carry a confidence shape: what is measured, what is
              inferred, what remains uncertain, and when it should be reviewed again.
            </p>
            <p>
              ZERO prioritizes primary scientific and institutional sources, keeps
              limitations visible, and treats disagreement as information rather than noise.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
