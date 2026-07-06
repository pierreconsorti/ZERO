"use client";

import { Fragment, type ReactNode } from "react";
import { MetadataPopover } from "./metadata-popover";

export const glossary = {
  "greenhouse gases":
    "Heat-trapping gases, including CO2 and methane, that warm the atmosphere.",
  "radiative physics":
    "The physics of how energy enters, leaves, and is absorbed by Earth's system.",
  attribution:
    "Research that separates human influence from natural variability in observed climate change.",
  methane:
    "A powerful heat-trapping gas that breaks down faster than CO2.",
  CO2: "Carbon dioxide, the long-lived greenhouse gas produced by fossil fuel use and land-use change.",
  "clean electricity":
    "Electricity generated with little or no direct fossil carbon emissions.",
  electrification:
    "Replacing direct fuel combustion with electric equipment that can run on clean power.",
  "demand flexibility":
    "Shifting when energy is used so supply, grids, and demand fit together better.",
  "carbon sinks":
    "Forests, soils, wetlands, and oceans that absorb and store carbon.",
  "solar reflectance":
    "How much incoming sunlight a surface reflects instead of absorbing as heat.",
  "mean radiant temperature":
    "A measure of how surrounding surfaces and sunlight affect the heat a person feels.",
  "thermal mass":
    "Material capacity to absorb, store, and release heat over time.",
  evapotranspiration:
    "Cooling from water evaporating through soil, plants, and tree canopies.",
  "embodied carbon":
    "Greenhouse gas emissions created before a material or product is used.",
  adaptation:
    "Changes that reduce harm from climate impacts already underway or expected.",
  mitigation:
    "Actions that reduce the causes of climate change, especially greenhouse gas emissions."
} as const;

const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

function findNextTerm(text: string) {
  const lowerText = text.toLowerCase();

  return terms.reduce<{ term: string; index: number } | null>((match, term) => {
    const index = lowerText.indexOf(term.toLowerCase());

    if (index === -1) {
      return match;
    }

    return match === null || index < match.index ? { term, index } : match;
  }, null);
}

function renderGlossaryText(text: string) {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const match = findNextTerm(remaining);

    if (!match) {
      nodes.push(remaining);
      break;
    }

    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const label = remaining.slice(match.index, match.index + match.term.length);

    nodes.push(
      <MetadataPopover
        key={`${match.term}-${key}`}
        label={label}
        popoverLabel="Glossary"
        buttonClassName="glossary-term"
      >
        {glossary[match.term as keyof typeof glossary]}
      </MetadataPopover>
    );

    remaining = remaining.slice(match.index + match.term.length);
    key += 1;
  }

  return nodes.map((node, index) => (
    <Fragment key={typeof node === "string" ? `${node}-${index}` : index}>
      {node}
    </Fragment>
  ));
}

type GlossaryTextProps = {
  text: string;
};

export function GlossaryText({ text }: GlossaryTextProps) {
  return <>{renderGlossaryText(text)}</>;
}
