# ZERO V1

ZERO is an autonomous, real-time public website that helps people understand the roadmap toward zero additional planetary heating.

It is designed as a living knowledge interface: calm, typographic, precise, and information-led. V1 uses server-side data fetching, modular climate data adapters, visible source attribution, and explicit fallback states when live data is unavailable.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Project structure

```text
app/                 Next.js App Router routes
components/          Reusable interface components
lib/content.ts       Roadmap, evidence profiles, and watchlist copy
lib/data/interventions.ts  Cooling catalogue, field prototypes, speculation
lib/sources.ts       Internal source registry
lib/types.ts         Shared TypeScript schemas
lib/data/            Source adapters, parsers, and fallback data
```

## Data model

Climate indicators use the `ClimateIndicator` type in `lib/types.ts`. Every indicator includes:

- metric name
- latest value and unit
- trend language
- source attribution
- last updated period
- confidence level
- plain-English interpretation
- status: `current`, `fallback`, or `unavailable`

Fallback values are intentionally labeled. They are sample context, not fake live data.

## Current adapters

- `lib/data/nasa.ts` reads NASA GISTEMP global monthly surface temperature anomalies.
- `lib/data/noaa.ts` reads NOAA GML monthly global CO2 and methane trend files.
- `lib/data/owid.ts` reads Our World in Data Grapher CSV endpoints for annual CO2 emissions and renewable energy share.
- `lib/data/index.ts` combines the indicators and adds the ocean/cryosphere reserved slot.

Next.js fetch revalidation is used for local caching. V1 does not need a database.

## Add a new source

1. Add a registry entry in `lib/sources.ts`.
2. Add or extend a typed adapter in `lib/data/`.
3. Return a `ClimateIndicator` with a clear `status`.
4. Add a fallback record in `lib/data/sample.ts`.
5. Include the indicator in `getPlanetHeatIndicators()` or a route-specific fetch function.
6. Keep source limitations visible in the UI.

## Add a new intervention

1. Add a typed `Intervention` record in `lib/data/interventions.ts`.
2. Give it a clear maturity level, mechanism, local prototype, measurements, risks, and evidence strength.
3. Keep speculative ideas in `possibleNotProven` unless there is enough evidence to treat them as deployable.
4. The homepage catalogue reads this file directly, so new records appear without changing the page layout.

## Design principles

- No images, decorative graphics, climate cliches, or sensational language.
- Use whitespace, typography, thin rules, data cards, and quiet interaction.
- Treat uncertainty as a first-class part of the interface.
- Prefer primary scientific and institutional sources.
- Update when better evidence appears.
