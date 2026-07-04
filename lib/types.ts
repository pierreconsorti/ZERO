export type ConfidenceLevel = "Very high" | "High" | "Medium" | "Low";

export type IndicatorStatus = "current" | "fallback" | "unavailable";

export type SourceTrustLevel = "Primary" | "High" | "Contextual";

export type ClimateIndicator = {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: string;
  period: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
  confidence: ConfidenceLevel;
  interpretation: string;
  status: IndicatorStatus;
  unavailableReason?: string;
};

export type SourceRecord = {
  id: string;
  name: string;
  url: string;
  type: string;
  updateFrequency: string;
  trustLevel: SourceTrustLevel;
  usedFor: string;
  limitations: string;
};

export type RoadmapLever = {
  id: string;
  title: string;
  currentState: string;
  whyItMatters: string;
  whatNeedsToChange: string;
  speedRequired: string;
  evidenceStrength: ConfidenceLevel;
  dataSources: string[];
  reviewDate: string;
};

export type EvidenceProfile = {
  id: string;
  claim: string;
  whatWeKnow: string;
  whatWeBelieve: string;
  whatWeSuspect: string;
  whatRemainsUnknown: string;
  strengthOfEvidence: ConfidenceLevel;
  scientificConsensus: string;
  researchMaturity: string;
  knownDisagreements: string;
  reviewSchedule: string;
  relatedInterventionIds?: string[];
};

export type WatchlistSignal = {
  id: string;
  label: string;
  whyNow: string;
  linkedIndicatorIds: string[];
  reviewCadence: string;
};
