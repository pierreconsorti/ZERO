import type { ClimateIndicator } from "../types";

export const fallbackIndicators: Record<string, ClimateIndicator> = {
  "global-temperature": {
    id: "global-temperature",
    name: "Global temperature anomaly",
    value: "1.28",
    unit: "C",
    trend: "Above the late-20th-century baseline",
    period: "Recent monthly sample",
    sourceId: "nasa-gistemp",
    sourceName: "NASA GISTEMP v4",
    sourceUrl: "https://data.giss.nasa.gov/gistemp/",
    lastUpdated: "Fallback sample",
    confidence: "High",
    interpretation:
      "Global temperature anomalies show how far the planet has moved from the reference climate used by the dataset.",
    status: "fallback",
    unavailableReason: "Live NASA data could not be loaded."
  },
  "atmospheric-co2": {
    id: "atmospheric-co2",
    name: "Atmospheric CO2",
    value: "427",
    unit: "ppm",
    trend: "Still rising",
    period: "Recent monthly sample",
    sourceId: "noaa-gml-co2",
    sourceName: "NOAA GML CO2 trends",
    sourceUrl: "https://gml.noaa.gov/ccgg/trends/global.html",
    lastUpdated: "Fallback sample",
    confidence: "Very high",
    interpretation:
      "CO2 is the main long-lived driver of human-caused warming. Stabilizing temperature requires stopping net additions.",
    status: "fallback",
    unavailableReason: "Live NOAA CO2 data could not be loaded."
  },
  "atmospheric-methane": {
    id: "atmospheric-methane",
    name: "Atmospheric methane",
    value: "1930",
    unit: "ppb",
    trend: "Still rising",
    period: "Recent monthly sample",
    sourceId: "noaa-gml-ch4",
    sourceName: "NOAA GML methane trends",
    sourceUrl: "https://gml.noaa.gov/ccgg/trends_ch4/",
    lastUpdated: "Fallback sample",
    confidence: "High",
    interpretation:
      "Methane is a powerful near-term warming gas. Cutting methane can slow the rate of additional heating.",
    status: "fallback",
    unavailableReason: "Live NOAA methane data could not be loaded."
  },
  "energy-co2-emissions": {
    id: "energy-co2-emissions",
    name: "Annual CO2 emissions",
    value: "37.8",
    unit: "GtCO2",
    trend: "Near record high",
    period: "Recent annual sample",
    sourceId: "owid-grapher",
    sourceName: "Our World in Data Grapher",
    sourceUrl: "https://ourworldindata.org/grapher/annual-co2-emissions-per-country",
    lastUpdated: "Fallback sample",
    confidence: "High",
    interpretation:
      "Annual CO2 emissions show whether the world is still adding long-lived heat-trapping gases at scale.",
    status: "fallback",
    unavailableReason: "Live OWID emissions data could not be loaded."
  },
  "renewable-energy": {
    id: "renewable-energy",
    name: "Renewable energy share",
    value: "14.6",
    unit: "%",
    trend: "Growing, not yet dominant",
    period: "Recent annual sample",
    sourceId: "owid-grapher",
    sourceName: "Our World in Data Grapher",
    sourceUrl: "https://ourworldindata.org/grapher/renewable-share-energy",
    lastUpdated: "Fallback sample",
    confidence: "Medium",
    interpretation:
      "Renewable energy growth shows whether clean supply is expanding quickly enough to displace fossil demand.",
    status: "fallback",
    unavailableReason: "Live OWID renewable data could not be loaded."
  },
  "ocean-cryosphere": {
    id: "ocean-cryosphere",
    name: "Ocean and cryosphere signal",
    value: "Unavailable",
    unit: "",
    trend: "Waiting for live source",
    period: "V1 placeholder",
    sourceId: "nasa-sea-level",
    sourceName: "NASA Sea Level Change",
    sourceUrl: "https://sealevel.nasa.gov/",
    lastUpdated: "Data unavailable",
    confidence: "Medium",
    interpretation:
      "Sea level, ocean heat, and ice indicators translate accumulated planetary heat into physical change.",
    status: "unavailable",
    unavailableReason:
      "A stable public endpoint has not been connected in V1. The interface reserves the slot instead of inventing data."
  }
};

export function fallbackFor(id: keyof typeof fallbackIndicators, reason?: string) {
  const indicator = fallbackIndicators[id];

  return {
    ...indicator,
    unavailableReason: reason ?? indicator.unavailableReason
  };
}
