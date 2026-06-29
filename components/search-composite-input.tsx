"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SearchTheme = {
  keywords: string[];
  motif: "canopy" | "roof" | "plume" | "woven" | "surface" | "radiant";
  palette: string[];
};

type SpeechRecognitionResultLike = {
  readonly 0: {
    readonly transcript: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  readonly results: {
    readonly length: number;
    readonly [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const themes: SearchTheme[] = [
  {
    keywords: ["shade", "canopy", "tree", "street", "bus", "corridor"],
    motif: "canopy",
    palette: ["#0a0f14", "#2f5f69", "#a8d7d6", "#f1f7f5"]
  },
  {
    keywords: ["roof", "white", "paint", "coating", "albedo", "building"],
    motif: "roof",
    palette: ["#111111", "#f3f3ef", "#b9c6ce", "#6d8791"]
  },
  {
    keywords: ["methane", "leak", "gas", "plume", "emission", "detect"],
    motif: "plume",
    palette: ["#050505", "#5a4d8f", "#7dd3c7", "#f1e7b4"]
  },
  {
    keywords: ["textile", "fabric", "shirt", "uniform", "wear", "clothing"],
    motif: "woven",
    palette: ["#101010", "#d7d3c8", "#8f9ea7", "#ffffff"]
  },
  {
    keywords: ["surface", "pavement", "road", "plaza", "asphalt", "material"],
    motif: "surface",
    palette: ["#0d0d0d", "#565656", "#b9b8ae", "#f5f5ef"]
  },
  {
    keywords: ["cool", "heat", "summer", "thermal", "radiant", "solar"],
    motif: "radiant",
    palette: ["#050505", "#1b4b6b", "#d9eef2", "#ffffff"]
  }
];

const fallbackTheme: SearchTheme = {
  keywords: [],
  motif: "radiant",
  palette: ["#070707", "#3b3b3b", "#c9c9c9", "#ffffff"]
};

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTheme(term: string) {
  const normalized = term.toLowerCase();

  return (
    themes.find((theme) =>
      theme.keywords.some((keyword) => normalized.includes(keyword))
    ) ?? fallbackTheme
  );
}

function buildMotif(theme: SearchTheme, random: () => number) {
  if (theme.motif === "canopy") {
    return Array.from({ length: 7 }, (_, index) => {
      const x = 130 + index * 210;
      const y = 290 + random() * 190;
      const width = 180 + random() * 150;
      const height = 80 + random() * 80;

      return `<path d="M${x} ${y} C${x + width * 0.25} ${y - height}, ${x + width * 0.75} ${y - height}, ${x + width} ${y} L${x + width * 0.82} ${y + 28} C${x + width * 0.55} ${y + 4}, ${x + width * 0.32} ${y + 4}, ${x + width * 0.14} ${y + 28} Z" fill="${theme.palette[index % theme.palette.length]}" opacity="0.18"/>`;
    }).join("");
  }

  if (theme.motif === "roof") {
    return Array.from({ length: 9 }, (_, index) => {
      const x = 70 + index * 180;
      const y = 280 + random() * 470;
      const width = 150 + random() * 120;
      const height = 58 + random() * 42;

      return `<path d="M${x} ${y} L${x + width * 0.5} ${y - height} L${x + width} ${y} L${x + width * 0.84} ${y + height * 0.72} L${x + width * 0.16} ${y + height * 0.72} Z" fill="${theme.palette[index % theme.palette.length]}" opacity="0.2"/>`;
    }).join("");
  }

  if (theme.motif === "plume") {
    return Array.from({ length: 8 }, (_, index) => {
      const x = 180 + random() * 1120;
      const y = 820 - index * 85;
      const spread = 180 + random() * 260;

      return `<path d="M${x} ${y} C${x - spread} ${y - 80}, ${x + spread} ${y - 160}, ${x + random() * 240 - 120} ${y - 250}" fill="none" stroke="${theme.palette[index % theme.palette.length]}" stroke-width="${28 + random() * 34}" stroke-linecap="round" opacity="0.18"/>`;
    }).join("");
  }

  if (theme.motif === "woven") {
    const horizontal = Array.from({ length: 12 }, (_, index) => {
      const y = 120 + index * 72;
      return `<path d="M80 ${y} C420 ${y + random() * 38 - 19}, 760 ${y + random() * 38 - 19}, 1520 ${y + random() * 38 - 19}" fill="none" stroke="${theme.palette[index % theme.palette.length]}" stroke-width="22" opacity="0.14"/>`;
    }).join("");
    const vertical = Array.from({ length: 10 }, (_, index) => {
      const x = 140 + index * 150;
      return `<path d="M${x} 80 C${x + random() * 46 - 23} 320, ${x + random() * 46 - 23} 620, ${x} 920" fill="none" stroke="${theme.palette[(index + 2) % theme.palette.length]}" stroke-width="18" opacity="0.12"/>`;
    }).join("");

    return `${horizontal}${vertical}`;
  }

  if (theme.motif === "surface") {
    return Array.from({ length: 18 }, (_, index) => {
      const x = 80 + random() * 1390;
      const y = 110 + random() * 780;
      const width = 120 + random() * 280;
      const height = 32 + random() * 110;
      const rotate = -18 + random() * 36;

      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${theme.palette[index % theme.palette.length]}" opacity="0.15" transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})"/>`;
    }).join("");
  }

  return Array.from({ length: 13 }, (_, index) => {
    const cx = 800;
    const cy = 500;
    const radius = 110 + index * 58 + random() * 30;

    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${theme.palette[index % theme.palette.length]}" stroke-width="${12 + random() * 18}" opacity="${0.08 + random() * 0.09}"/>`;
  }).join("");
}

function buildCompositeImage(term: string) {
  const normalized = term.trim().slice(0, 48);

  if (!normalized) {
    return "none";
  }

  const theme = getTheme(normalized);
  const seed = hashString(normalized);
  const random = seededRandom(seed);
  const escapedTerm = escapeXml(normalized);
  const texture = Array.from({ length: 34 }, (_, index) => {
    const cx = 80 + random() * 1440;
    const cy = 70 + random() * 860;
    const rx = 42 + random() * 210;
    const ry = 24 + random() * 150;
    const rotate = random() * 180;
    const color = theme.palette[index % theme.palette.length];

    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${0.06 + random() * 0.09}" transform="rotate(${rotate} ${cx} ${cy})"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-label="Composite visual for ${escapedTerm}">
  <title>Composite visual for ${escapedTerm}</title>
  <defs>
    <filter id="soften"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="${seed % 997}"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="transparent"/>
  <g filter="url(#soften)">${texture}</g>
  <g>${buildMotif(theme, random)}</g>
  <rect width="1600" height="1000" filter="url(#grain)" opacity="0.055" mix-blend-mode="soft-light"/>
  <text x="82" y="900" fill="${theme.palette[theme.palette.length - 1]}" opacity="0.13" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="700">${escapedTerm}</text>
</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function SearchCompositeInput() {
  const [term, setTerm] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const compositeImage = useMemo(() => buildCompositeImage(term), [term]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--zero-search-image", compositeImage);
    root.style.setProperty("--zero-search-active", term.trim() ? "1" : "0");

    return () => {
      root.style.setProperty("--zero-search-image", "none");
      root.style.setProperty("--zero-search-active", "0");
    };
  }, [compositeImage, term]);

  const startVoiceInput = () => {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;

    if (!Recognition) {
      setVoiceMessage("Voice input is not available in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceMessage("Stopped listening.");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript =
        event.results.length > 0 ? event.results[0][0].transcript.trim() : "";

      if (transcript) {
        setTerm(transcript);
        setVoiceMessage(`Heard: ${transcript}`);
      }
    };
    recognition.onerror = () => {
      setVoiceMessage("Voice input stopped before a term was captured.");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    setVoiceMessage("Listening.");
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceMessage("Voice input could not start.");
    }
  };

  return (
    <form
      role="search"
      className="search-composite-control"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor="zero-search" className="sr-only">
        Search visual background
      </label>
      <span aria-hidden="true">Search</span>
      <input
        id="zero-search"
        type="search"
        value={term}
        placeholder="shade, methane, textile..."
        autoComplete="off"
        onChange={(event) => setTerm(event.target.value)}
      />
      <button
        type="button"
        className="search-voice-button"
        aria-label={isListening ? "Listening for search term" : "Use voice input"}
        aria-pressed={isListening}
        onClick={startVoiceInput}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <path d="M12 19v3" />
        </svg>
      </button>
      {term ? (
        <button type="button" onClick={() => setTerm("")}>
          Clear
        </button>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {voiceMessage}
      </span>
    </form>
  );
}
