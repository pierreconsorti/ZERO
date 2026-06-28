import type { ClimateIndicator } from "../types";
import { fallbackFor } from "./sample";
import { formatMonth, formatSigned, parseNumber, safeFetchError } from "./parsers";

const CO2_URL = "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_gl.txt";
const CH4_URL = "https://gml.noaa.gov/webdata/ccgg/trends/ch4/ch4_mm_gl.txt";

type NoaaPoint = {
  year: number;
  month: number;
  value: number;
};

function parseNoaaMonthly(text: string): NoaaPoint[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .map((columns) => {
      const year = parseNumber(columns[0]);
      const month = parseNumber(columns[1]);
      const value = parseNumber(columns[3]);

      if (!year || !month || value === null) {
        return null;
      }

      return { year, month, value };
    })
    .filter((point): point is NoaaPoint => Boolean(point))
    .sort((a, b) => a.year - b.year || a.month - b.month);
}

async function fetchNoaaText(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 12 }
  });

  if (!response.ok) {
    throw new Error(`NOAA returned ${response.status}`);
  }

  return response.text();
}

export async function getAtmosphericCo2(): Promise<ClimateIndicator> {
  try {
    const points = parseNoaaMonthly(await fetchNoaaText(CO2_URL));
    const latest = points.at(-1);

    if (!latest) {
      throw new Error("NOAA CO2 data had no monthly points.");
    }

    const priorYear = points.find(
      (point) => point.year === latest.year - 1 && point.month === latest.month
    );
    const change = priorYear ? latest.value - priorYear.value : null;

    return {
      id: "atmospheric-co2",
      name: "Atmospheric CO2",
      value: latest.value.toFixed(1),
      unit: "ppm",
      trend:
        change === null
          ? "Recent concentration available"
          : `${change >= 0 ? "Still rising" : "Lower than last year"} (${formatSigned(change, 1)} ppm year over year)`,
      period: formatMonth(latest.year, latest.month),
      sourceId: "noaa-gml-co2",
      sourceName: "NOAA GML CO2 trends",
      sourceUrl: CO2_URL,
      lastUpdated: formatMonth(latest.year, latest.month),
      confidence: "Very high",
      interpretation:
        "CO2 is the main long-lived driver of human-caused warming. The roadmap bends only when net additions stop.",
      status: "current"
    };
  } catch (error) {
    return fallbackFor("atmospheric-co2", safeFetchError(error));
  }
}

export async function getAtmosphericMethane(): Promise<ClimateIndicator> {
  try {
    const points = parseNoaaMonthly(await fetchNoaaText(CH4_URL));
    const latest = points.at(-1);

    if (!latest) {
      throw new Error("NOAA methane data had no monthly points.");
    }

    const priorYear = points.find(
      (point) => point.year === latest.year - 1 && point.month === latest.month
    );
    const change = priorYear ? latest.value - priorYear.value : null;

    return {
      id: "atmospheric-methane",
      name: "Atmospheric methane",
      value: latest.value.toFixed(0),
      unit: "ppb",
      trend:
        change === null
          ? "Recent concentration available"
          : `${change >= 0 ? "Still rising" : "Lower than last year"} (${formatSigned(change, 0)} ppb year over year)`,
      period: formatMonth(latest.year, latest.month),
      sourceId: "noaa-gml-ch4",
      sourceName: "NOAA GML methane trends",
      sourceUrl: CH4_URL,
      lastUpdated: formatMonth(latest.year, latest.month),
      confidence: "High",
      interpretation:
        "Methane is a powerful near-term warming gas. Cutting methane can slow additional heating while CO2 falls.",
      status: "current"
    };
  } catch (error) {
    return fallbackFor("atmospheric-methane", safeFetchError(error));
  }
}
