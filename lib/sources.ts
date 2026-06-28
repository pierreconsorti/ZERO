import type { SourceRecord } from "./types";

export const sourceRegistry: SourceRecord[] = [
  {
    id: "nasa-gistemp",
    name: "NASA GISTEMP v4",
    url: "https://data.giss.nasa.gov/gistemp/",
    type: "Observed climate indicator",
    updateFrequency: "Monthly, usually around the 10th",
    trustLevel: "Primary",
    usedFor: "Global surface temperature anomaly.",
    limitations:
      "Monthly values are estimates relative to a baseline and can be revised as station and ocean records are updated."
  },
  {
    id: "noaa-gml-co2",
    name: "NOAA Global Monitoring Laboratory CO2 trends",
    url: "https://gml.noaa.gov/ccgg/trends/global.html",
    type: "Atmospheric greenhouse gas observation",
    updateFrequency: "Monthly",
    trustLevel: "Primary",
    usedFor: "Atmospheric carbon dioxide concentration trend.",
    limitations:
      "Recent monthly values are preliminary and represent atmospheric concentration, not direct emissions."
  },
  {
    id: "noaa-gml-ch4",
    name: "NOAA Global Monitoring Laboratory methane trends",
    url: "https://gml.noaa.gov/ccgg/trends_ch4/",
    type: "Atmospheric greenhouse gas observation",
    updateFrequency: "Monthly",
    trustLevel: "Primary",
    usedFor: "Atmospheric methane concentration trend.",
    limitations:
      "Methane concentration reflects multiple sources and sinks; attribution requires additional analysis."
  },
  {
    id: "copernicus-cds",
    name: "Copernicus Climate Data Store",
    url: "https://cds.climate.copernicus.eu/",
    type: "Climate dataset and reanalysis platform",
    updateFrequency: "Dataset-specific",
    trustLevel: "Primary",
    usedFor: "Climate indicators, reanalysis data, and future expanded datasets.",
    limitations:
      "Individual datasets have different methods, latencies, and uncertainty ranges."
  },
  {
    id: "owid-grapher",
    name: "Our World in Data Grapher",
    url: "https://ourworldindata.org/grapher",
    type: "Open data API",
    updateFrequency: "Dataset-specific",
    trustLevel: "High",
    usedFor: "Energy, emissions, renewables, and country-level chart data.",
    limitations:
      "OWID often harmonizes upstream datasets; users should inspect each chart's original source and notes."
  },
  {
    id: "iea",
    name: "International Energy Agency",
    url: "https://www.iea.org/",
    type: "Energy system analysis",
    updateFrequency: "Annual and report-specific",
    trustLevel: "Contextual",
    usedFor: "Energy-related emissions context and sector transition benchmarks.",
    limitations:
      "Some detailed datasets require licenses or report access; V1 uses IEA mainly as contextual source metadata."
  },
  {
    id: "nasa-sea-level",
    name: "NASA Sea Level Change",
    url: "https://sealevel.nasa.gov/",
    type: "Ocean and cryosphere indicator",
    updateFrequency: "Dataset-specific",
    trustLevel: "Primary",
    usedFor: "Global mean sea level context and future ocean indicators.",
    limitations:
      "Sea level products differ by satellite mission, correction method, and processing latency."
  }
];

export function getSourceById(id: string) {
  return sourceRegistry.find((source) => source.id === id);
}
