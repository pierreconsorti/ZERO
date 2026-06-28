import { SectionHeading } from "@/components/section-heading";

export const revalidate = 43200;

const principles = [
  "The objective is not to tell people what to think. The objective is to help people think better.",
  "Climate is the first mission. Learning is the enduring mission.",
  "Everything here is provisional. When better evidence appears, ZERO updates itself.",
  "The objective is not to be right. The objective is to become progressively less wrong."
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-3 py-12 sm:gap-10 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <SectionHeading
          eyebrow="About"
          title="A public learning instrument for planetary heat"
          description="ZERO exists to help humanity cool the planet by making scientific knowledge more understandable, more beautiful, and more useful."
        />
        <div className="space-y-8 text-xl leading-9 text-zero-muted">
          <p>
            This site is a living roadmap. It gathers current climate signals, explains
            what they mean, and shows what must change to reduce the heat humanity is
            adding to the planet.
          </p>
          <div className="grid gap-3">
            {principles.map((principle) => (
              <p
                key={principle}
                className="rounded-[1.25rem] bg-[#f6f6f6] p-5 text-base leading-7 text-zero-ink"
              >
                {principle}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
