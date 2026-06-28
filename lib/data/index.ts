import type { ClimateIndicator } from "../types";
import { getGlobalTemperature } from "./nasa";
import { getAtmosphericCo2, getAtmosphericMethane } from "./noaa";
import { getEnergyCo2Emissions, getRenewableEnergyShare } from "./owid";
import { fallbackFor } from "./sample";

export async function getPlanetHeatIndicators(): Promise<ClimateIndicator[]> {
  const indicators = await Promise.all([
    getGlobalTemperature(),
    getAtmosphericCo2(),
    getAtmosphericMethane(),
    getEnergyCo2Emissions(),
    getRenewableEnergyShare()
  ]);

  return [...indicators, fallbackFor("ocean-cryosphere")];
}

export function getLastUpdatedLabel(indicators: ClimateIndicator[]) {
  const current = indicators.filter((indicator) => indicator.status === "current");

  if (current.length === 0) {
    return "Live data unavailable";
  }

  const periods = current.map((indicator) => indicator.lastUpdated);
  return periods[0] === periods.at(-1)
    ? periods[0]
    : `${periods[0]} to ${periods.at(-1)}`;
}
