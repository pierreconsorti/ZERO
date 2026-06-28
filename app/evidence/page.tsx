import { EvidenceProfileCard } from "@/components/evidence-profile-card";
import { SectionHeading } from "@/components/section-heading";
import { evidenceProfiles } from "@/lib/content";

export const revalidate = 43200;

export default function EvidencePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Evidence"
          title="A system for becoming progressively less wrong"
          description="ZERO separates observation, interpretation, uncertainty, and review cadence. The goal is not performative certainty. The goal is clearer public reasoning."
        />
        <div className="mt-12 grid gap-5">
          {evidenceProfiles.map((profile) => (
            <EvidenceProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
      <section className="border-t border-zero-rule bg-white/[0.38] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <h2 className="text-3xl font-semibold text-zero-ink">Method</h2>
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
