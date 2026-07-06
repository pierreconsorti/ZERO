"use client";

import { useState } from "react";
import { interventions } from "@/lib/data/interventions";
import { trackExploredIntervention } from "@/lib/visit-tracking";

const templates = [
  (a: string, b: string) =>
    `${a} and ${b} are both classified as deployable interventions.`,
  (a: string) => `${a} is organized around a measurable cooling mechanism.`,
  (a: string, b: string) =>
    `${a} and ${b} address different mechanisms of urban heat.`,
  (a: string) => `${a} can be evaluated through a local field note.`,
  (a: string, b: string) =>
    `${a} and ${b} both connect material choices to public heat exposure.`
];

function chooseHeadline() {
  const deployable = interventions.filter(
    (intervention) =>
      intervention.maturity === "deployable" || intervention.maturity === "known"
  );
  const pool = deployable.length >= 2 ? deployable : interventions;
  const a = pool[Math.floor(Math.random() * pool.length)];
  const b =
    pool.filter((item) => item.id !== a.id)[
      Math.floor(Math.random() * Math.max(pool.length - 1, 1))
    ] ?? pool[0];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template(a.title, b.title);
}

export function CatalogueActions() {
  const [headline, setHeadline] = useState(
    "Deployable interventions are prioritized when evidence and local testing can meet."
  );

  const surprise = () => {
    const item = interventions[Math.floor(Math.random() * interventions.length)];
    const target = document.getElementById(item.id);

    if (target) {
      trackExploredIntervention(item.id);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("catalogue-pulse");
      window.setTimeout(() => target.classList.remove("catalogue-pulse"), 450);
    }
  };

  return (
    <div className="grid gap-3">
      <p className="text-sm leading-6 text-zero-muted">{headline}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="pill-control-light px-4 py-2 text-sm"
          onClick={() => setHeadline(chooseHeadline())}
        >
          Generate a headline
        </button>
        <button
          type="button"
          className="pill-control-light px-4 py-2 text-sm"
          onClick={surprise}
        >
          Surprise me
        </button>
      </div>
    </div>
  );
}
