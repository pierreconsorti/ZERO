import type { Intervention } from "./interventions";

export const interventionFilterOptions = [
  "All",
  "Materials",
  "Shade",
  "Textiles",
  "Surfaces",
  "Methane",
  "Passive cooling"
] as const;

export type InterventionFilter = (typeof interventionFilterOptions)[number];

const interventionFilterIds: Record<
  Exclude<InterventionFilter, "All">,
  string[]
> = {
  Materials: [
    "ultra-white-roof-coatings",
    "cool-pavements",
    "reflective-membranes"
  ],
  Shade: [
    "shade-as-infrastructure",
    "solar-canopies",
    "urban-shade-corridors",
    "reflective-membranes"
  ],
  Textiles: ["reflective-cooling-textiles"],
  Surfaces: [
    "ultra-white-roof-coatings",
    "cool-pavements",
    "reflective-membranes"
  ],
  Methane: ["methane-leak-detection"],
  "Passive cooling": ["passive-cooling-retrofits"]
};

export function filterInterventions(
  interventions: Intervention[],
  filter: InterventionFilter
) {
  if (filter === "All") {
    return interventions;
  }

  const visibleIds = new Set(interventionFilterIds[filter]);
  return interventions.filter((intervention) => visibleIds.has(intervention.id));
}
