import type { ClimateIndicator } from "../types";
import { fallbackFor } from "./sample";
import { parseCsvRows, parseNumber, safeFetchError } from "./parsers";

const EMISSIONS_URL =
  "https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv?tab=chart&country=~OWID_WRL";
const RENEWABLE_SHARE_URL =
  "https://ourworldindata.org/grapher/renewable-share-energy.csv?tab=chart&country=~OWID_WRL";

type OwidPoint = {
  year: number;
  value: number;
};

function findValueColumn(header: string[], fallbackIndex: number, includes: string[]) {
  const index = header.findIndex((cell) => {
    const normalized = cell.toLowerCase();
    return includes.every((part) => normalized.includes(part));
  });

  return index >= 0 ? index : fallbackIndex;
}

async function fetchOwidRows(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    throw new Error(`OWID returned ${response.status}`);
  }

  return parseCsvRows(await response.text());
}

function parseWorldRows(rows: string[][], valueColumn: number): OwidPoint[] {
  return rows
    .slice(1)
    .filter((row) => row[0] === "World" || row[1] === "OWID_WRL")
    .map((row) => {
      const year = parseNumber(row[2]);
      const value = parseNumber(row[valueColumn]);

      if (!year || value === null) {
        return null;
      }

      return { year, value };
    })
    .filter((point): point is OwidPoint => Boolean(point))
    .sort((a, b) => a.year - b.year);
}

export async function getEnergyCo2Emissions(): Promise<ClimateIndicator> {
  try {
    const rows = await fetchOwidRows(EMISSIONS_URL);
    const valueColumn = findValueColumn(rows[0] ?? [], 3, ["annual", "co", "emissions"]);
    const points = parseWorldRows(rows, valueColumn);
    const latest = points.at(-1);
    const previous = points.at(-2);

    if (!latest) {
      throw new Error("OWID emissions data had no world rows.");
    }

    const gt = latest.value / 1_000_000_000;
    const change = previous ? (latest.value - previous.value) / 1_000_000_000 : null;

    return {
      id: "energy-co2-emissions",
      name: "Annual CO2 emissions",
      value: gt.toFixed(1),
      unit: "GtCO2",
      trend:
        change === null
          ? "Latest annual value available"
          : `${change >= 0 ? "Higher" : "Lower"} than previous year (${change > 0 ? "+" : ""}${change.toFixed(1)} GtCO2)`,
      period: String(latest.year),
      sourceId: "owid-grapher",
      sourceName: "Our World in Data Grapher",
      sourceUrl: EMISSIONS_URL,
      lastUpdated: String(latest.year),
      confidence: "High",
      interpretation:
        "Annual CO2 emissions show whether the world is still adding long-lived greenhouse gases at planetary scale.",
      status: "current"
    };
  } catch (error) {
    return fallbackFor("energy-co2-emissions", safeFetchError(error));
  }
}

export async function getRenewableEnergyShare(): Promise<ClimateIndicator> {
  try {
    const rows = await fetchOwidRows(RENEWABLE_SHARE_URL);
    const valueColumn = findValueColumn(rows[0] ?? [], 3, ["renewable"]);
    const points = parseWorldRows(rows, valueColumn);
    const latest = points.at(-1);
    const previous = points.at(-2);

    if (!latest) {
      throw new Error("OWID renewable share data had no world rows.");
    }

    const change = previous ? latest.value - previous.value : null;

    return {
      id: "renewable-energy",
      name: "Renewable energy share",
      value: latest.value.toFixed(1),
      unit: "%",
      trend:
        change === null
          ? "Latest annual value available"
          : `${change >= 0 ? "Growing" : "Lower"} than previous year (${change > 0 ? "+" : ""}${change.toFixed(1)} points)`,
      period: String(latest.year),
      sourceId: "owid-grapher",
      sourceName: "Our World in Data Grapher",
      sourceUrl: RENEWABLE_SHARE_URL,
      lastUpdated: String(latest.year),
      confidence: "Medium",
      interpretation:
        "Renewable share is a transition signal: growth must compound quickly enough to replace fossil energy, not only meet new demand.",
      status: "current"
    };
  } catch (error) {
    return fallbackFor("renewable-energy", safeFetchError(error));
  }
}
