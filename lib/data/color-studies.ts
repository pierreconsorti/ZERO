export type AccentKey =
  | "hero"
  | "catalogue"
  | "field"
  | "speculation"
  | "signals"
  | "roadmap"
  | "evidence";

export type ColorStudy = {
  key: AccentKey;
  label: string;
  sourceTitle: string;
  sourceUrl: string;
  colors: string[];
};

export const colorStudies: Record<AccentKey, ColorStudy> = {
  hero: {
    key: "hero",
    label: "roof / sky / mineral warmth",
    sourceTitle: "Flat roofs in Ashdod, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Flat_roof#/media/File:Rooftops_in_Ashdod.jpg",
    colors: ["#f7f4ec", "#d7c2a6", "#8fa9b5", "#c88069", "#1a1a1a"]
  },
  catalogue: {
    key: "catalogue",
    label: "solar canopy / asphalt / open air",
    sourceTitle: "Solar canopy at Winona State University, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Solar_canopy#/media/File:Winona_State_University_Solar_Canopy.jpg",
    colors: ["#111111", "#355d7a", "#8ea2a9", "#d8c69d", "#557247"]
  },
  field: {
    key: "field",
    label: "street shade / leaf / pavement",
    sourceTitle: "Street tree imagery, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Street_tree#/media/File:Trees_city_street.jpg",
    colors: ["#0f0f0f", "#315338", "#8b9b67", "#d8c9a8", "#6b6f72"]
  },
  speculation: {
    key: "speculation",
    label: "passive cooling / air path / warm mass",
    sourceTitle: "Passive cooling diagram, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Passive_cooling#/media/File:Passive_Cooling.png",
    colors: ["#111111", "#6e8fa1", "#d7b071", "#f0e7d8", "#4e5458"]
  },
  signals: {
    key: "signals",
    label: "temperature spiral / measured heat",
    sourceTitle: "Climate spiral, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Climate_spiral#/media/File:Climate_spiral.gif",
    colors: ["#141414", "#2f6fb0", "#75a8d3", "#f0c267", "#c74736"]
  },
  roadmap: {
    key: "roadmap",
    label: "urban heat / tree canopy / built mass",
    sourceTitle: "Urban heat island imagery, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Urban_heat_island#/media/File:Urban_heat_island.svg",
    colors: ["#111111", "#87524a", "#d29b64", "#6d875f", "#9aa6a9"]
  },
  evidence: {
    key: "evidence",
    label: "methane record / atmosphere / instrument",
    sourceTitle: "Methane emissions imagery, Wikimedia Commons",
    sourceUrl: "https://en.wikipedia.org/wiki/Methane_emissions#/media/File:20201211_Methane_CH4_observations_2005-2019_-_SCIAMACHY_GOSAT_GOSAT-2_IASI_TROPOMI_-_frames_13-16.gif",
    colors: ["#111111", "#274e9b", "#50a6c7", "#92b95c", "#d26a3d"]
  }
};

export function accentGradient(key: AccentKey) {
  const colors = colorStudies[key].colors;
  return `linear-gradient(96deg, ${colors[0]} 0%, ${colors[2]} 24%, ${colors[1]} 46%, ${colors[3]} 70%, ${colors[4]} 100%)`;
}

export function softAccentGradient(key: AccentKey) {
  const colors = colorStudies[key].colors;
  return `linear-gradient(96deg, ${colors[1]}1A 0%, ${colors[2]}22 28%, ${colors[3]}1F 58%, transparent 100%)`;
}

export const interventionAccentMap: Record<string, AccentKey> = {
  "ultra-white-roof-coatings": "hero",
  "reflective-cooling-textiles": "field",
  "cool-pavements": "roadmap",
  "shade-as-infrastructure": "field",
  "passive-cooling-retrofits": "speculation",
  "methane-leak-detection": "evidence",
  "solar-canopies": "catalogue",
  "urban-shade-corridors": "field",
  "reflective-membranes": "speculation"
};

export const prototypeAccentKeys: AccentKey[] = [
  "hero",
  "field",
  "field",
  "catalogue",
  "roadmap",
  "catalogue"
];
