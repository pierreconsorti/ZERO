"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
import {
  getInterventionFamilies,
  type InterventionFamily
} from "@/lib/data/intervention-filters";
import { interventions } from "@/lib/data/interventions";

type StoredLocation = {
  latitude: number;
  longitude: number;
  displayName: string;
};

type MonthlyTemperature = {
  month: number;
  averageMax: number;
  averageMin: number;
};

type ClimateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; monthly: MonthlyTemperature[]; averageSummerHigh: number }
  | { status: "error"; message: string };

export type ClimateProfile = {
  locationName: string;
  averageSummerHigh: number;
  recommendationIds: string[];
};

type LocalClimatePanelProps = {
  onProfileChange: (profile: ClimateProfile | null) => void;
};

type GeocodingResponse = {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    admin1?: string;
    country?: string;
    country_code?: string;
  }>;
};

type ArchiveResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
  };
};

const locationStorageKey = "zero-local-climate-location";
const locationChangeEvent = "zero-local-climate-location-change";
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const evidenceRank = {
  "very high": 5,
  high: 4,
  medium: 3,
  early: 2,
  speculative: 1
} as const;

function subscribeToLocationChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(locationChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(locationChangeEvent, callback);
  };
}

function readStoredLocationSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(locationStorageKey);
  } catch {
    return null;
  }
}

function parseStoredLocation(snapshot: string | null): StoredLocation | null {
  if (!snapshot) {
    return null;
  }

  try {
    const parsed = JSON.parse(snapshot) as Partial<StoredLocation>;

    if (!parsed) {
      return null;
    }

    const { latitude, longitude, displayName } = parsed;

    return typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof displayName === "string"
      ? { latitude, longitude, displayName }
      : null;
  } catch {
    return null;
  }
}

function writeStoredLocation(location: StoredLocation | null) {
  try {
    if (location) {
      window.localStorage.setItem(locationStorageKey, JSON.stringify(location));
    } else {
      window.localStorage.removeItem(locationStorageKey);
    }
  } catch {
    // The module should remain usable even if storage is unavailable.
  }

  window.dispatchEvent(new Event(locationChangeEvent));
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function makeDisplayName(result: NonNullable<GeocodingResponse["results"]>[number]) {
  return [result.name, result.admin1, result.country ?? result.country_code]
    .filter(Boolean)
    .join(", ");
}

function aggregateMonthly(response: ArchiveResponse) {
  const times = response.daily?.time ?? [];
  const maxValues = response.daily?.temperature_2m_max ?? [];
  const minValues = response.daily?.temperature_2m_min ?? [];
  const buckets = Array.from({ length: 12 }, (_, month) => ({
    month,
    maxTotal: 0,
    minTotal: 0,
    count: 0
  }));

  times.forEach((time, index) => {
    const max = maxValues[index];
    const min = minValues[index];

    if (typeof max !== "number" || typeof min !== "number") {
      return;
    }

    const month = Number(time.slice(5, 7)) - 1;
    const bucket = buckets[month];

    if (!bucket) {
      return;
    }

    bucket.maxTotal += max;
    bucket.minTotal += min;
    bucket.count += 1;
  });

  return buckets
    .filter((bucket) => bucket.count > 0)
    .map((bucket) => ({
      month: bucket.month,
      averageMax: bucket.maxTotal / bucket.count,
      averageMin: bucket.minTotal / bucket.count
    }));
}

function getAverageSummerHigh(monthly: MonthlyTemperature[], latitude: number) {
  const summerMonths = latitude >= 0 ? [5, 6, 7] : [11, 0, 1];
  const values = monthly
    .filter((month) => summerMonths.includes(month.month))
    .map((month) => month.averageMax);
  const pool = values.length > 0 ? values : monthly.map((month) => month.averageMax);

  return pool.reduce((total, value) => total + value, 0) / Math.max(pool.length, 1);
}

function getRecommendationIds(averageSummerHigh: number) {
  const hotClimate = averageSummerHigh >= 30;
  const priorityFamilies: InterventionFamily[] = [
    "Shade",
    "Passive cooling",
    "Materials",
    "Surfaces"
  ];

  return interventions
    .map((intervention, index) => {
      const families = getInterventionFamilies(intervention);
      const climateScore = hotClimate
        ? priorityFamilies.reduce(
            (score, family, familyIndex) =>
              families.includes(family) ? score + 8 - familyIndex : score,
            0
          )
        : 0;
      const evidenceScore = evidenceRank[intervention.evidenceStrength];
      const maturityScore =
        intervention.maturity === "known" || intervention.maturity === "deployable"
          ? 2
          : 0;

      return {
        id: intervention.id,
        index,
        score: climateScore + evidenceScore + maturityScore
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 4)
    .map((result) => result.id);
}

function TemperatureRangeChart({ monthly }: { monthly: MonthlyTemperature[] }) {
  const width = 360;
  const height = 170;
  const paddingX = 22;
  const paddingY = 18;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2 - 18;
  const values = monthly.flatMap((month) => [month.averageMax, month.averageMin]);
  const minValue = Math.floor(Math.min(...values) - 2);
  const maxValue = Math.ceil(Math.max(...values) + 2);
  const range = Math.max(maxValue - minValue, 1);
  const y = (value: number) =>
    paddingY + ((maxValue - value) / range) * plotHeight;
  const x = (month: number) => paddingX + (month / 11) * plotWidth;

  return (
    <svg
      className="climate-chart"
      role="img"
      aria-label="Average monthly high and low temperature range"
      viewBox={`0 0 ${width} ${height}`}
    >
      {[0, 0.5, 1].map((ratio) => (
        <line
          key={ratio}
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingY + ratio * plotHeight}
          y2={paddingY + ratio * plotHeight}
          className="climate-chart-grid"
        />
      ))}
      {monthly.map((month) => {
        const maxY = y(month.averageMax);
        const minY = y(month.averageMin);
        const monthX = x(month.month);

        return (
          <g key={month.month}>
            <line
              x1={monthX}
              x2={monthX}
              y1={maxY}
              y2={minY}
              className="climate-chart-range"
            />
            <circle cx={monthX} cy={maxY} r="2.2" className="climate-chart-dot" />
            <circle cx={monthX} cy={minY} r="2.2" className="climate-chart-dot" />
            {month.month % 2 === 0 ? (
              <text x={monthX} y={height - 6} textAnchor="middle">
                {monthLabels[month.month]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function LocalClimatePanel({ onProfileChange }: LocalClimatePanelProps) {
  const locationSnapshot = useSyncExternalStore(
    subscribeToLocationChange,
    readStoredLocationSnapshot,
    () => null
  );
  const location = useMemo(
    () => parseStoredLocation(locationSnapshot),
    [locationSnapshot]
  );
  const [city, setCity] = useState("");
  const [state, setState] = useState<ClimateState>({ status: "idle" });
  const [locationMessage, setLocationMessage] = useState("");
  const loadedLocationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location || !locationSnapshot) {
      loadedLocationKeyRef.current = null;
      onProfileChange(null);
      return;
    }

    if (loadedLocationKeyRef.current === locationSnapshot) {
      return;
    }

    let cancelled = false;
    const activeLocation = location;
    const activeLocationKey = locationSnapshot;
    loadedLocationKeyRef.current = activeLocationKey;

    async function loadClimate() {
      setState({ status: "loading" });
      onProfileChange(null);

      try {
        const end = new Date();
        end.setDate(end.getDate() - 1);
        const start = new Date(end);
        start.setFullYear(start.getFullYear() - 3);

        const params = new URLSearchParams({
          latitude: String(activeLocation.latitude),
          longitude: String(activeLocation.longitude),
          start_date: formatDate(start),
          end_date: formatDate(end),
          daily: "temperature_2m_max,temperature_2m_min",
          timezone: "auto"
        });
        const response = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Archive request failed");
        }

        const archive = (await response.json()) as ArchiveResponse;
        const monthly = aggregateMonthly(archive);

        if (monthly.length === 0) {
          throw new Error("No monthly temperature data returned");
        }

        const averageSummerHigh = getAverageSummerHigh(
          monthly,
          activeLocation.latitude
        );
        const recommendationIds = getRecommendationIds(averageSummerHigh);

        if (!cancelled) {
          setState({ status: "ready", monthly, averageSummerHigh });
          onProfileChange({
            locationName: activeLocation.displayName,
            averageSummerHigh,
            recommendationIds
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Couldn't load climate data right now."
          });
          onProfileChange(null);
        }
      }
    }

    void loadClimate();

    return () => {
      cancelled = true;
      if (loadedLocationKeyRef.current === activeLocationKey) {
        loadedLocationKeyRef.current = null;
      }
    };
  }, [location, locationSnapshot, onProfileChange]);

  const visibleState = useMemo<ClimateState>(
    () => (location ? state : { status: "idle" }),
    [location, state]
  );
  const headline =
    visibleState.status === "ready"
      ? `Average summer high: ${Math.round(visibleState.averageSummerHigh)}°C`
      : "Set a place to see recent heat patterns.";

  async function resolveCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.trim();

    if (!query) {
      return;
    }

    setLocationMessage("Looking for that city.");

    try {
      const params = new URLSearchParams({
        name: query,
        count: "1",
        language: "en",
        format: "json"
      });
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }

      const data = (await response.json()) as GeocodingResponse;
      const result = data.results?.[0];

      if (!result) {
        setLocationMessage("No city match found. Try a nearby larger city.");
        return;
      }

      writeStoredLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        displayName: makeDisplayName(result)
      });
      setCity("");
      setLocationMessage("Location saved.");
    } catch {
      setLocationMessage("Couldn't resolve that city right now.");
    }
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Browser location is not available here.");
      return;
    }

    setLocationMessage("Waiting for location permission.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        writeStoredLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          displayName: "Your current location"
        });
        setLocationMessage("Location saved.");
      },
      () => {
        setLocationMessage("Location permission was not granted. You can type a city instead.");
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 30, timeout: 10000 }
    );
  }

  return (
    <section className="px-1.5 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="object-card grid gap-5 p-4 sm:gap-7 sm:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-5">
            <div>
              <p className="meta-label">Local climate</p>
              <h2 className="display-tight-md mt-4 max-w-2xl text-balance text-[clamp(1.55rem,5.8vw,2.05rem)] text-zero-ink">
                What can you try where you live?
              </h2>
              <p className="mt-4 max-w-xl text-[1.02rem] leading-7 text-zero-muted">
                Type a city or use browser location to compare recent monthly
                temperature ranges with practical intervention starting points.
              </p>
            </div>

            <div className="grid gap-3">
              <form className="climate-location-form" onSubmit={resolveCity}>
                <label htmlFor="zero-city" className="sr-only">
                  City name
                </label>
                <input
                  id="zero-city"
                  value={city}
                  placeholder="City name"
                  onChange={(event) => setCity(event.target.value)}
                />
                <button type="submit">Set city</button>
              </form>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="pill-control-light px-4 py-2 text-sm"
                  onClick={useBrowserLocation}
                >
                  Use my location
                </button>
                {location ? (
                  <button
                    type="button"
                    className="pill-control-light px-4 py-2 text-sm"
                    onClick={() => {
                      writeStoredLocation(null);
                      setLocationMessage("Location cleared.");
                    }}
                  >
                    Clear place
                  </button>
                ) : null}
              </div>
              {locationMessage ? (
                <p className="text-sm leading-6 text-zero-muted" aria-live="polite">
                  {locationMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="metadata-tile grid gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="meta-label">
                  {location ? location.displayName : "No place set"}
                </p>
                <p className="mt-2 text-lg font-semibold leading-tight text-zero-ink">
                  {headline}
                </p>
              </div>
              {visibleState.status === "loading" ? (
                <span className="metadata-pill w-fit px-3 py-1.5 text-xs">
                  Loading climate record
                </span>
              ) : null}
            </div>

            {visibleState.status === "ready" ? (
              <TemperatureRangeChart monthly={visibleState.monthly} />
            ) : (
              <div className="climate-chart-empty">
                <p>
                  {visibleState.status === "error"
                    ? visibleState.message
                    : "Recent monthly temperature ranges will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
