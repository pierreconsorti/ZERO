"use client";

import { useState } from "react";
import { researchPapers } from "@/lib/research-papers";

export function ResearchPaperSection() {
  const [mode, setMode] = useState<"plain" | "technical">("plain");

  return (
    <section className="mx-auto max-w-7xl px-3 pb-16 sm:px-8 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="meta-label">Primary papers</p>
          <h2 className="display-tight-lg mt-3 text-balance text-[clamp(1.6rem,5.4vw,2rem)] text-zero-ink">
            Research ZERO is allowed to cite directly
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={mode === "plain"}
            className="filter-chip px-3 py-1.5 text-sm"
            onClick={() => setMode("plain")}
          >
            Plain language
          </button>
          <button
            type="button"
            aria-pressed={mode === "technical"}
            className="filter-chip px-3 py-1.5 text-sm"
            onClick={() => setMode("technical")}
          >
            Technical abstract
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {researchPapers.map((paper) => (
          <article key={paper.id} className="object-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold leading-tight text-zero-ink">
                  {paper.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zero-muted">
                  {paper.authors}, {paper.year}
                </p>
              </div>
              <a
                href={paper.sourceUrl}
                className="pill-control-light w-fit px-3 py-1.5 text-sm"
              >
                Source
              </a>
            </div>
            <p className="mt-5 text-sm leading-6 text-zero-muted">
              {mode === "plain" ? paper.plainLanguage : paper.technicalAbstract}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
