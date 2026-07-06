export type ResearchPaper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  sourceUrl: string;
  relatedClaimId?: string;
  technicalAbstract: string;
  plainLanguage: string;
  editHistoryNote?: string;
  confidenceTimeline?: [string, string, string];
};

export const researchPapers: ResearchPaper[] = [
  {
    id: "raman-radiative-cooling-2014",
    title:
      "Passive radiative cooling below ambient air temperature under direct sunlight",
    authors: "A. P. Raman, M. A. Anoma, L. Zhu, E. Rephaeli, and S. Fan",
    year: 2014,
    sourceUrl: "https://doi.org/10.1038/nature13883",
    relatedClaimId: "adaptation-needed",
    technicalAbstract:
      "The paper demonstrates a multilayer photonic surface that reflects sunlight while emitting thermal radiation through the atmospheric window.",
    plainLanguage:
      "A surface can be engineered to shed heat to the sky even while sunlight is hitting it, which matters for roofs and outdoor materials.",
    editHistoryNote:
      "ZERO treats reflective materials as measurable interventions because radiative cooling moved from physics concept toward tested surface systems.",
    confidenceTimeline: ["2014: demonstrated", "2020: field-tested", "2026: high"]
  },
  {
    id: "saunois-methane-budget-2020",
    title: "The Global Methane Budget 2000-2017",
    authors: "M. Saunois and Global Carbon Project collaborators",
    year: 2020,
    sourceUrl: "https://doi.org/10.5194/essd-12-1561-2020",
    relatedClaimId: "methane-near-term",
    technicalAbstract:
      "Atmospheric methane growth is constrained by bottom-up inventories and atmospheric inversions across energy, agriculture, waste, and natural sources.",
    plainLanguage:
      "Methane is not an abstract future issue: measured atmospheric growth can be tied back to sectors that can be managed.",
    editHistoryNote:
      "ZERO separates methane from long-lived CO2 because its shorter lifetime changes the timing of benefits.",
    confidenceTimeline: ["2019: rising", "2023: high", "2026: high"]
  },
  {
    id: "ipcc-ar6-wg1-2021",
    title: "Climate Change 2021: The Physical Science Basis",
    authors: "IPCC Working Group I",
    year: 2021,
    sourceUrl: "https://www.ipcc.ch/report/ar6/wg1/",
    relatedClaimId: "warming-human-caused",
    technicalAbstract:
      "The assessment synthesizes physical climate science, observed warming, attribution, greenhouse gas forcing, and future response ranges.",
    plainLanguage:
      "The core cause of recent warming is not a guess: many independent lines of evidence point to human-added greenhouse gases.",
    editHistoryNote:
      "ZERO treats human-caused warming as very high confidence because attribution evidence has strengthened across assessments.",
    confidenceTimeline: ["2013: clear", "2021: unequivocal", "2026: very high"]
  }
];

export function latestResearchLine() {
  const paper = researchPapers[0];

  return `Primary source in ZERO: ${paper.title}.`;
}
