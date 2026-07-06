const pilots = [
  {
    place: "Ahmedabad, India",
    title: "Cool roofs as heat-health infrastructure",
    status: "Expanded across public and low-income housing programs",
    note:
      "White and reflective roofs are treated as a practical heat-health measure: simple enough to deploy, measurable enough to evaluate, and visible enough to teach."
  },
  {
    place: "Los Angeles, United States",
    title: "Cool pavement trials",
    status: "Piloted on streets and parking surfaces",
    note:
      "Street coatings are tested against surface heat, glare, durability, and comfort. The lesson is not just whether a coating works, but where it belongs."
  },
  {
    place: "Singapore",
    title: "Shade, greenery, and building standards",
    status: "Integrated into urban planning practice",
    note:
      "Cooling is treated as infrastructure: tree canopy, sheltered walking routes, reflective surfaces, and building design all share the same public-space problem."
  }
];

export function InTheWildSection() {
  return (
    <section className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="object-card p-4 sm:p-7">
          <div className="max-w-3xl">
            <p className="meta-label">In the wild</p>
            <h2 className="display-tight-lg mt-4 text-balance text-[clamp(1.65rem,6vw,1.8rem)] text-zero-ink">
              Real pilots already testing the edges
            </h2>
            <p className="mt-4 text-sm leading-6 text-zero-muted">
              These entries are self-contained editorial notes. Keeping them
              current is an ongoing ZERO responsibility.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {pilots.map((pilot) => (
              <article
                key={pilot.title}
                className="rounded-[1.25rem] bg-black/[0.035] p-4"
              >
                <p className="meta-label">{pilot.place}</p>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-zero-ink">
                  {pilot.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-zero-ink">
                  {pilot.status}
                </p>
                <p className="mt-3 text-sm leading-6 text-zero-muted">
                  {pilot.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
