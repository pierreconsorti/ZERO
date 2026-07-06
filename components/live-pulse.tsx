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
const pulseStorageKey = "zero-live-pulse";

type PulseCache = {
  temperatureLines?: string[];
  daylightLines?: string[];
  updatedAt?: string;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    time?: string;
  };
  daily?: {
    daylight_duration?: Array<number | null>;
  };
};

function readPulseCache(): PulseCache {
  try {
    return JSON.parse(window.localStorage.getItem(pulseStorageKey) ?? "{}") as PulseCache;
  } catch {
    return {};
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 7500) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

function formatDaylight(seconds: number | null | undefined) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return null;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds - hours * 3600) / 60);

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function LivePulse() {
  const [temperatureLines, setTemperatureLines] = useState<string[]>([]);
  const [daylightLines, setDaylightLines] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPulse() {
      const cached = readPulseCache();

      if (cached.temperatureLines?.length) {
        setTemperatureLines(cached.temperatureLines);
      }

      if (cached.daylightLines?.length) {
        setDaylightLines(cached.daylightLines);
      }

      const rows = await Promise.all(
        pulseCities.map(async (city) => {
          try {
            const forecastParams = new URLSearchParams({
              latitude: String(city.latitude),
              longitude: String(city.longitude),
              current: "temperature_2m",
              daily: "daylight_duration",
              forecast_days: "1",
              timezone: "auto"
            });
            const forecastResponse = await fetchWithTimeout(
              `https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`
            );
            const forecast = forecastResponse.ok
              ? ((await forecastResponse.json()) as ForecastResponse)
              : null;
            const temperature = forecast?.current?.temperature_2m;
            const daylightSeconds = forecast?.daily?.daylight_duration?.[0];

            return {
              city: city.name,
              temperature,
              daylight: formatDaylight(daylightSeconds)
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

      setTemperatureLines((current) =>
        nextTemperatureLines.length > 0 ? nextTemperatureLines : current
      );
      setDaylightLines((current) =>
        nextDaylightLines.length > 0 ? nextDaylightLines : current
      );
      setLoaded(true);

      try {
        window.localStorage.setItem(
          pulseStorageKey,
          JSON.stringify({
            temperatureLines:
              nextTemperatureLines.length > 0
                ? nextTemperatureLines
                : cached.temperatureLines ?? [],
            daylightLines:
              nextDaylightLines.length > 0
                ? nextDaylightLines
                : cached.daylightLines ?? [],
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
              ) : loaded ? (
                "Live city temperatures are temporarily unavailable."
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
              ) : loaded ? (
                "Daylight records are temporarily unavailable."
              ) : (
                "Loading daylight records."
              )}
            </p>
          </div>
          <div>
            <p className="meta-label">Elapsed</p>
            <p className="mt-3 text-sm leading-6 text-zero-muted tabular">
              {elapsedCo2}
            </p>
            <p className="mt-1 text-xs leading-5 text-zero-muted">
              {latestResearchLine()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
