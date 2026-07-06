import {
  getInterventionFamilies,
  interventionFamilies
} from "@/lib/data/intervention-filters";
import type { FieldPrototype, Intervention } from "@/lib/data/interventions";

export type InterventionMatch = {
  kind: "intervention";
  item: Intervention;
  score: number;
};

export type FieldPrototypeMatch = {
  kind: "prototype";
  item: FieldPrototype;
  score: number;
};

export type SearchResult = InterventionMatch | FieldPrototypeMatch;

function fieldIncludes(text: string | string[] | undefined, query: string) {
  const value = Array.isArray(text) ? text.join(" ") : text;

  return value ? value.toLowerCase().includes(query) : false;
}

export function searchInterventions(query: string, items: Intervention[]) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  return items
    .map((item, index) => {
      const families = getInterventionFamilies(item).join(" ");
      const fields = [
        { text: item.title, weight: 3 },
        { text: families, weight: 2 },
        { text: item.category, weight: 2 },
        { text: item.mechanism, weight: 1 },
        {
          text: `${item.whatMakesItInteresting} ${item.localPrototype}`,
          weight: 1
        },
        { text: item.risks, weight: 1 },
        {
          text: `${item.scale.join(" ")} ${item.whatToMeasure.join(" ")} ${
            item.status
          } ${item.evidenceStrength} ${item.maturity}`,
          weight: 1
        }
      ];
      const score = fields.reduce(
        (total, field) =>
          fieldIncludes(field.text, q) ? total + field.weight : total,
        0
      );

      return { kind: "intervention" as const, item, score, index };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => ({
      kind: result.kind,
      item: result.item,
      score: result.score
    }));
}

export function searchFieldPrototypes(query: string, items: FieldPrototype[]) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  return items
    .map((item, index) => {
      const fields = [
        { text: item.title, weight: 3 },
        {
          text: `${item.whatToTest} ${item.whereToTryIt}`,
          weight: 1
        },
        { text: item.whatToMeasure, weight: 1 },
        { text: item.toolsNeeded, weight: 1 },
        { text: `${item.evidenceValue} ${item.possibleRisk}`, weight: 1 }
      ];
      const score = fields.reduce(
        (total, field) =>
          fieldIncludes(field.text, q) ? total + field.weight : total,
        0
      );

      return { kind: "prototype" as const, item, score, index };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => ({
      kind: result.kind,
      item: result.item,
      score: result.score
    }));
}

export function closestFallback(query: string, items: Intervention[], max = 3) {
  const q = query.trim().toLowerCase();
  const matchedFamily = interventionFamilies.find((family) => {
    const normalized = family.toLowerCase();

    return normalized.includes(q) || q.includes(normalized);
  });
  const pool = matchedFamily
    ? items.filter((item) => getInterventionFamilies(item).includes(matchedFamily))
    : items;

  return pool.slice(0, max).map((item) => ({
    kind: "intervention" as const,
    item,
    score: 0
  }));
}
