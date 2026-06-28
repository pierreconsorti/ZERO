import type { ClimateIndicator } from "../types";
import { fallbackFor } from "./sample";
import { formatMonth, formatSigned, parseCsvRows, parseNumber, safeFetchError } from "./parsers";

const GISTEMP_URL = "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type TemperaturePoint = {
  year: number;
  month: number;
  anomaly: number;
};

function normalizeGistempValue(raw: number) {
  return Math.abs(raw) > 10 ? raw / 100 : raw;
}

function parseGistemp(text: string): TemperaturePoint[] {
  const rows = parseCsvRows(text);
  const points: TemperaturePoint[] = [];

  for (const row of rows) {
    const year = parseNumber(row[0]);
    if (!year || year < 1880 || year > 2200) {
      continue;
    }

    for (let monthIndex = 0; monthIndex < MONTHS.length; monthIndex += 1) {
      const value = parseNumber(row[monthIndex + 1]);
      if (value === null) {
        continue;
      }

      points.push({
        year,
        month: monthIndex + 1,
        anomaly: normalizeGistempValue(value)
      });
    }
  }

  return points.sort((a, b) => a.year - b.year || a.month - b.month);
}

export async function getGlobalTemperature(): Promise<ClimateIndicator> {
  try {
    const response = await fetch(GISTEMP_URL, {
      next: { revalidate: 60 * 60 * 12 }
    });

    if (!response.ok) {
      throw new Error(`NASA GISTEMP returned ${response.status}`);
    }

    const points = parseGistemp(await response.text());
    const latest = points.at(-1);

    if (!latest) {
      throw new Error("NASA GISTEMP data had no monthly points.");
    }

    const priorYear = points.find(
      (point) => point.year === latest.year - 1 && point.month === latest.month
    );
    const change = priorYear ? latest.anomaly - priorYear.anomaly : null;
    const trend =
      change === null
        ? "Recent anomaly available"
        : `${change >= 0 ? "Warmer" : "Cooler"} than same month last year (${formatSigned(change)}°C)`;

    return {
      id: "global-temperature",
      name: "Global temperature anomaly",
      value: latest.anomaly.toFixed(2),
      unit: "°C",
      trend,
      period: formatMonth(latest.year, latest.month),
      sourceId: "nasa-gistemp",
      sourceName: "NASA GISTEMP v4",
      sourceUrl: GISTEMP_URL,
      lastUpdated: formatMonth(latest.year, latest.month),
      confidence: "High",
      interpretation:
        "This anomaly compares global surface temperature with NASA's reference climate. It tracks the heat signal people experience as warming.",
      status: "current"
    };
  } catch (error) {
    return fallbackFor("global-temperature", safeFetchError(error));
  }
}
