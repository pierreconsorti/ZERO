import { SectionHeading } from "@/components/section-heading";
import { glossary } from "@/components/glossary-text";

export const revalidate = 43200;

const crossReferences: Partial<Record<keyof typeof glossary, string[]>> = {
  methane: ["greenhouse gases", "radiative physics"],
  CO2: ["greenhouse gases", "carbon sinks"],
  adaptation: ["mitigation"],
  mitigation: ["adaptation", "clean electricity"],
  "solar reflectance": ["mean radiant temperature", "thermal mass"],
  evapotranspiration: ["carbon sinks", "adaptation"]
};

export default function GlossaryPage() {
  const entries = Object.entries(glossary).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <main>
      <section className="mx-auto max-w-7xl px-3 py-12 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Glossary"
          title="Terms ZERO uses carefully"
          description="Short definitions for the technical language that appears across the catalogue, evidence, roadmap, and local climate tools."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {entries.map(([term, definition]) => (
            <article key={term} id={term} className="object-card p-4 sm:p-5">
              <h2 className="text-xl font-semibold leading-tight text-zero-ink">
                {term}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zero-muted">
                {definition}
              </p>
              {crossReferences[term as keyof typeof glossary]?.length ? (
                <p className="mt-4 text-xs leading-5 text-zero-muted">
                  See also:{" "}
                  {crossReferences[term as keyof typeof glossary]?.join(", ")}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
