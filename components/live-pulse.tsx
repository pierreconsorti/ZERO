"use client";

import { useEffect, useMemo, useState } from "react";
import { latestResearchLine } from "@/lib/research-papers";
import { RotatingText } from "./rotating-text";

type PulseCity = {
  name: string;
  latitude: number;
  longitude: number;
};

const pulseCities: PulseCity[] = [
  { name: "Phoenix", latitude: 33.4484, longitude: -112.074 },
  { name: "Lagos", latitude: 6.5244, longitude: 3.3792 },
  { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { name: "Reykjavik", latitude: 64.1466, longitude: -21.9426 },
  { name: "Santiago", latitude: -33.4489, longitude: -70.6693 },
  { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777 }
];

const annualCo2Gt = 37.4;
const kgCo2PerSecond = (annualCo2Gt * 1_000_000_000_000) / (365 * 24 * 60 * 60);

function formatDaylight(seconds: number | undefined) {
  if (typeof seconds !== "number") {
    return null;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function LivePulse() {
  const [temperatureLines, setTemperatureLines] = useState<string[]>([]);
  const [daylightLines, setDaylightLines] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPulse() {
      const rows = await Promise.all(
        pulseCities.map(async (city) => {
          try {
            const forecastParams = new URLSearchParams({
              latitude: String(city.latitude),
              longitude: String(city.longitude),
              current_weather: "true",
              timezone: "auto"
            });
            const daylightParams = new URLSearchParams({
              lat: String(city.latitude),
              lng: String(city.longitude),
              formatted: "0"
            });
            const [forecastResponse, daylightResponse] = await Promise.all([
              fetch(
                `https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`
              ),
              fetch(
                `https://api.sunrise-sunset.org/json?${daylightParams.toString()}`
              )
            ]);
            const forecast = forecastResponse.ok
              ? ((await forecastResponse.json()) as {
                  current_weather?: { temperature?: number };
                })
              : null;
            const daylight = daylightResponse.ok
              ? ((await daylightResponse.json()) as {
                  results?: { day_length?: number };
                })
              : null;

            return {
              city: city.name,
              temperature: forecast?.current_weather?.temperature,
              daylight: formatDaylight(daylight?.results?.day_length)
            };
          } catch {
            return {
              city: city.name,
              temperature: undefined,
              daylight: null
            };
          }
        })
      );

      if (cancelled) {
        return;
      }

      const nextTemperatureLines = rows
        .filter((row) => typeof row.temperature === "number")
        .sort((a, b) => (b.temperature ?? 0) - (a.temperature ?? 0))
        .map((row) => `${row.city}: ${Math.round(row.temperature ?? 0)}°C now.`);
      const nextDaylightLines = rows
        .filter((row) => row.daylight)
        .map((row) => `${row.city}: ${row.daylight} of daylight today.`);

      setTemperatureLines(nextTemperatureLines);
      setDaylightLines(nextDaylightLines);

      try {
        window.localStorage.setItem(
          "zero-live-pulse",
          JSON.stringify({
            temperatureLines: nextTemperatureLines,
            daylightLines: nextDaylightLines,
            updatedAt: new Date().toISOString()
          })
        );
      } catch {
        // The visible pulse still works without storage.
      }
    }

    void loadPulse();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const elapsedCo2 = useMemo(() => {
    const tonnes = (kgCo2PerSecond * seconds) / 1000;

    return `${Math.round(tonnes).toLocaleString()} tonnes of energy-related CO2 emitted globally since this page loaded, using annual-rate math.`;
  }, [seconds]);

  return (
    <section className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="object-card grid gap-4 p-4 sm:p-6 lg:grid-cols-3">
          <div>
            <p className="meta-label">Live pulse</p>
            <p className="mt-3 text-sm leading-6 text-zero-muted">
              {temperatureLines.length > 0 ? (
                <RotatingText items={temperatureLines} intervalMs={6500} />
              ) : (
                "Loading current city temperatures."
              )}
            </p>
          </div>
          <div>
            <p className="meta-label">Daylight</p>
            <p className="mt-3 text-sm leading-6 text-zero-muted">
              {daylightLines.length > 0 ? (
                <RotatingText items={daylightLines} intervalMs={7600} />
              ) : (
                "Loading daylight records."
              )}
            </p>
          </div>
          <div>
            <p className="meta-label">Elapsed</p>
            <p className="mt-3 text-sm leading-6 text-zero-muted">
              <RotatingText
                items={[elapsedCo2, latestResearchLine()]}
                intervalMs={7200}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
