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
import {
  parseStoredLocation,
  readStoredLocationSnapshot,
  subscribeToLocationChange,
  writeStoredLocation
} from "@/lib/local-climate-location";

type MonthlyTemperature = {
  month: number;
  yearlyHighs: Record<number, number>;
  change: number | null;
};

type TemperatureHistory = {
  years: number[];
  rows: MonthlyTemperature[];
  averageSummerHigh: number;
  strongestChange: {
    month: number;
    earliestYear: number;
    latestYear: number;
    change: number;
  } | null;
};

type ClimateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; history: TemperatureHistory }
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

type ReverseGeocodingResponse = {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const evidenceRank = {
  "very high": 5,
  high: 4,
  medium: 3,
  early: 2,
  speculative: 1
} as const;

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function makeDisplayName(result: NonNullable<GeocodingResponse["results"]>[number]) {
  return [result.name, result.admin1, result.country ?? result.country_code]
    .filter(Boolean)
    .join(", ");
}

function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

function makeReverseDisplayName(response: ReverseGeocodingResponse) {
  const address = response.address;
  const locality =
    address?.city ??
    address?.town ??
    address?.village ??
    address?.municipality ??
    address?.suburb ??
    address?.county;
  const place = [locality, address?.state, address?.country]
    .filter(Boolean)
    .join(", ");

  return place || response.display_name || "";
}

async function reverseGeocodeLocation(latitude: number, longitude: number) {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      zoom: "10",
      addressdetails: "1"
    });
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = (await response.json()) as ReverseGeocodingResponse;
    const displayName = makeReverseDisplayName(data);

    return displayName
      ? { displayName, placeSource: "OpenStreetMap Nominatim" }
      : {
          displayName: formatCoordinates(latitude, longitude),
          placeSource: "Coordinates"
        };
  } catch {
    return {
      displayName: formatCoordinates(latitude, longitude),
      placeSource: "Coordinates"
    };
  }
}

function aggregateMonthlyHistory(response: ArchiveResponse, latitude: number) {
  const times = response.daily?.time ?? [];
  const maxValues = response.daily?.temperature_2m_max ?? [];
  const buckets = new Map<string, { year: number; month: number; total: number; count: number }>();

  times.forEach((time, index) => {
    const max = maxValues[index];

    if (typeof max !== "number") {
      return;
    }

    const year = Number(time.slice(0, 4));
    const month = Number(time.slice(5, 7)) - 1;
    const key = `${year}-${month}`;
    const bucket = buckets.get(key) ?? {
      year,
      month,
      total: 0,
      count: 0
    };

    bucket.total += max;
    bucket.count += 1;
    buckets.set(key, bucket);
  });

  const years = [...new Set([...buckets.values()].map((bucket) => bucket.year))]
    .sort((a, b) => a - b)
    .slice(-3);
  const rows = Array.from({ length: 12 }, (_, month) => {
    const yearlyHighs = years.reduce<Record<number, number>>((values, year) => {
      const bucket = buckets.get(`${year}-${month}`);

      if (bucket && bucket.count > 0) {
        values[year] = bucket.total / bucket.count;
      }

      return values;
    }, {});
    const availableYears = years.filter((year) => yearlyHighs[year] !== undefined);
    const earliestYear = availableYears[0];
    const latestYear = availableYears[availableYears.length - 1];
    const change =
      earliestYear !== undefined &&
      latestYear !== undefined &&
      earliestYear !== latestYear
        ? yearlyHighs[latestYear] - yearlyHighs[earliestYear]
        : null;

    return { month, yearlyHighs, change };
  });
  const summerMonths = latitude >= 0 ? [5, 6, 7] : [11, 0, 1];
  const latestYear = years[years.length - 1];
  const latestSummerValues = rows
    .filter((row) => summerMonths.includes(row.month))
    .map((row) => row.yearlyHighs[latestYear])
    .filter((value): value is number => typeof value === "number");
  const fallbackSummerValues = rows
    .filter((row) => summerMonths.includes(row.month))
    .flatMap((row) => years.map((year) => row.yearlyHighs[year]))
    .filter((value): value is number => typeof value === "number");
  const pool =
    latestSummerValues.length > 0
      ? latestSummerValues
      : fallbackSummerValues.length > 0
        ? fallbackSummerValues
        : rows
            .flatMap((row) => years.map((year) => row.yearlyHighs[year]))
            .filter((value): value is number => typeof value === "number");
  const strongestChange = rows.reduce<TemperatureHistory["strongestChange"]>(
    (strongest, row) => {
      if (row.change === null) {
        return strongest;
      }

      const availableYears = years.filter(
        (year) => row.yearlyHighs[year] !== undefined
      );
      const earliestYear = availableYears[0];
      const latestAvailableYear = availableYears[availableYears.length - 1];

      if (
        earliestYear === undefined ||
        latestAvailableYear === undefined ||
        Math.abs(row.change) <= Math.abs(strongest?.change ?? 0)
      ) {
        return strongest;
      }

      return {
        month: row.month,
        earliestYear,
        latestYear: latestAvailableYear,
        change: row.change
      };
    },
    null
  );

  return {
    years,
    rows,
    averageSummerHigh:
      pool.reduce((total, value) => total + value, 0) / Math.max(pool.length, 1),
    strongestChange
  };
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

function formatTemperature(value: number | undefined) {
  return typeof value === "number" ? `${Math.round(value)}°` : "—";
}

function formatChange(value: number | null) {
  if (value === null) {
    return "—";
  }

  const rounded = Math.round(value);

  return `${rounded > 0 ? "+" : ""}${rounded}°`;
}

function describeChange(value: number) {
  const rounded = Math.round(value);

  if (rounded === 0) {
    return "is roughly flat";
  }

  return `${rounded > 0 ? "is up" : "is down"} ${Math.abs(rounded)}°`;
}

function climateNarrative(history: TemperatureHistory) {
  const earliestYear = history.years[0];
  const latestYear = history.years[history.years.length - 1];
  const rowsWithLatest = history.rows.filter(
    (row) => typeof row.yearlyHighs[latestYear] === "number"
  );

  if (!earliestYear || !latestYear || rowsWithLatest.length === 0) {
    return "";
  }

  const hottest = rowsWithLatest.reduce((max, row) =>
    (row.yearlyHighs[latestYear] ?? Number.NEGATIVE_INFINITY) >
    (max.yearlyHighs[latestYear] ?? Number.NEGATIVE_INFINITY)
      ? row
      : max
  );
  const earliestValue = hottest.yearlyHighs[earliestYear];
  const latestValue = hottest.yearlyHighs[latestYear];

  if (typeof earliestValue !== "number" || typeof latestValue !== "number") {
    return `Temperatures in your area have stayed fairly stable since ${earliestYear}.`;
  }

  const delta = latestValue - earliestValue;

  if (delta >= 1) {
    return `${monthLabels[hottest.month]} is now about ${delta.toFixed(
      1
    )}° hotter than it was in ${earliestYear}.`;
  }

  return `Temperatures in your area have stayed fairly stable since ${earliestYear}.`;
}

function TemperatureHistoryTable({ history }: { history: TemperatureHistory }) {
  const latestYear = history.years[history.years.length - 1];
  const callout = history.strongestChange;
  const rowTemplate = `minmax(2.2rem, 0.72fr) repeat(${Math.max(
    history.years.length,
    1
  )}, minmax(2.3rem, 1fr)) minmax(3rem, 0.86fr)`;

  return (
    <div className="grid gap-3">
      <p className="climate-narrative-line">{climateNarrative(history)}</p>
      {callout ? (
        <p className="metadata-pill w-fit px-3 py-1.5 text-sm">
          {monthLabels[callout.month]} {describeChange(callout.change)} since{" "}
          {callout.earliestYear}
        </p>
      ) : null}
      <div className="climate-history-table" role="table" aria-label="Monthly average high temperature by year">
        <div
          className="climate-history-row climate-history-head"
          role="row"
          style={{ gridTemplateColumns: rowTemplate }}
        >
          <span role="columnheader">Month</span>
          {history.years.map((year) => (
            <span
              key={year}
              role="columnheader"
              className={year === latestYear ? "latest" : undefined}
            >
              {year}
            </span>
          ))}
          <span role="columnheader">Change</span>
        </div>
        {history.rows.map((row) => (
          <div
            className="climate-history-row"
            role="row"
            key={row.month}
            style={{ gridTemplateColumns: rowTemplate }}
          >
            <span role="cell">{monthLabels[row.month]}</span>
            {history.years.map((year) => (
              <span
                key={year}
                role="cell"
                className={year === latestYear ? "latest" : undefined}
              >
                {formatTemperature(row.yearlyHighs[year])}
              </span>
            ))}
            <span role="cell">{formatChange(row.change)}</span>
          </div>
        ))}
      </div>
      {history.years.length < 3 ? (
        <p className="text-sm leading-6 text-zero-muted">
          Showing {history.years.length} available year
          {history.years.length === 1 ? "" : "s"} from the archive.
        </p>
      ) : null}
    </div>
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
  const reverseLookupKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location || location.displayName !== "Your current location") {
      return;
    }

    const lookupKey = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;

    if (reverseLookupKeyRef.current === lookupKey) {
      return;
    }

    let cancelled = false;
    const activeLocation = location;
    reverseLookupKeyRef.current = lookupKey;

    async function upgradeStoredPlaceName() {
      const resolved = await reverseGeocodeLocation(
        activeLocation.latitude,
        activeLocation.longitude
      );

      if (!cancelled) {
        writeStoredLocation({
          ...activeLocation,
          displayName: resolved.displayName,
          placeSource: resolved.placeSource
        });
      }
    }

    void upgradeStoredPlaceName();

    return () => {
      cancelled = true;
    };
  }, [location]);

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
        const history = aggregateMonthlyHistory(archive, activeLocation.latitude);

        if (history.rows.every((row) => Object.keys(row.yearlyHighs).length === 0)) {
          throw new Error("No monthly temperature data returned");
        }

        const averageSummerHigh = history.averageSummerHigh;
        const recommendationIds = getRecommendationIds(averageSummerHigh);

        if (!cancelled) {
          setState({ status: "ready", history });
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
      ? `Average summer high: ${Math.round(visibleState.history.averageSummerHigh)}°C`
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
        displayName: makeDisplayName(result),
        placeSource: "Open-Meteo geocoding"
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
        setLocationMessage("Resolving your place.");
        void reverseGeocodeLocation(
          position.coords.latitude,
          position.coords.longitude
        ).then((resolved) => {
          writeStoredLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            displayName: resolved.displayName,
            placeSource: resolved.placeSource
          });
          setLocationMessage("Location saved.");
        });
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
                <p className="meta-label">Resolved place</p>
                <h3 className="display-tight-md mt-2 text-balance text-[clamp(1.45rem,5.2vw,1.95rem)] text-zero-ink">
                  {location ? location.displayName : "No place set"}
                </h3>
                <p className="mt-3 text-lg font-semibold leading-tight text-zero-ink">
                  {headline}
                </p>
                {location?.placeSource ? (
                  <p className="mt-2 text-xs leading-5 text-zero-muted">
                    Place name via {location.placeSource}.
                  </p>
                ) : null}
              </div>
              {visibleState.status === "loading" ? (
                <span className="metadata-pill w-fit px-3 py-1.5 text-xs">
                  Loading climate record
                </span>
              ) : null}
            </div>

            {visibleState.status === "ready" ? (
              <TemperatureHistoryTable history={visibleState.history} />
            ) : (
              <div className="climate-chart-empty">
                <p>
                  {visibleState.status === "error"
                    ? visibleState.message
                    : "Recent monthly temperature history will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
