export type ImpactScope = {
  name: string;
  roofAreaKm2: number;
};

const wattsAvoidedPerM2 = 35;
const summerSunHours = 6;
const summerDays = 90;

export function estimateWhiteRoofCooling(scope: ImpactScope) {
  const areaM2 = scope.roofAreaKm2 * 1_000_000;
  const dailyMwh = (areaM2 * wattsAvoidedPerM2 * summerSunHours) / 1_000_000;
  const seasonalGwh = (dailyMwh * summerDays) / 1000;

  return {
    scope: scope.name,
    dailyMwh,
    seasonalGwh,
    summary:
      scope.roofAreaKm2 >= 100
        ? `A screening estimate: whitening ${Math.round(
            scope.roofAreaKm2
          ).toLocaleString()} km² of hot-city roofs could avoid about ${Math.round(
            seasonalGwh
          ).toLocaleString()} GWh of absorbed summer heat.`
        : `A screening estimate: whitening ${scope.roofAreaKm2.toFixed(
            1
          )} km² of roofs in ${scope.name} could avoid about ${seasonalGwh.toFixed(
            1
          )} GWh of absorbed summer heat.`
  };
}
