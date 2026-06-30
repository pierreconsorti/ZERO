"use client";

import { useEffect, useMemo, useState } from "react";

type ZeroImageSequenceProps = {
  open: boolean;
  onClose: () => void;
};

type Frame = {
  id: string;
  alt: string;
  src: string;
};

function frameSvg(
  seed: string,
  colors: readonly [string, string, string, string],
  horizon: number
) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img">
      <defs>
        <linearGradient id="sky-${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${colors[0]}"/>
          <stop offset="0.42" stop-color="${colors[1]}"/>
          <stop offset="0.72" stop-color="${colors[2]}"/>
          <stop offset="1" stop-color="${colors[3]}"/>
        </linearGradient>
        <filter id="grain-${seed}">
          <feTurbulence type="fractalNoise" baseFrequency="0.74" numOctaves="3" seed="${seed.length * 17}"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.18"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#sky-${seed})"/>
      <rect y="${horizon}" width="1600" height="${1000 - horizon}" fill="rgba(0,0,0,0.34)"/>
      <g opacity="0.62">
        <circle cx="260" cy="240" r="210" fill="${colors[3]}"/>
        <circle cx="1260" cy="330" r="260" fill="${colors[1]}"/>
        <circle cx="820" cy="780" r="310" fill="${colors[2]}"/>
      </g>
      <g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2">
        <path d="M120 ${horizon + 80} C 360 ${horizon - 30}, 500 ${horizon + 150}, 740 ${horizon + 26} S 1210 ${horizon - 12}, 1490 ${horizon + 110}"/>
        <path d="M170 ${horizon + 190} C 450 ${horizon + 60}, 720 ${horizon + 260}, 1070 ${horizon + 102} S 1370 ${horizon + 46}, 1540 ${horizon + 140}"/>
      </g>
      <g opacity="0.32" fill="rgba(255,255,255,0.82)">
        <rect x="120" y="${horizon + 250}" width="290" height="18" rx="9"/>
        <rect x="470" y="${horizon + 300}" width="180" height="18" rx="9"/>
        <rect x="890" y="${horizon + 234}" width="430" height="18" rx="9"/>
        <rect x="1110" y="${horizon + 320}" width="210" height="18" rx="9"/>
      </g>
      <rect width="1600" height="1000" filter="url(#grain-${seed})"/>
    </svg>
  `)}`;
}

const frameSpecs = [
  {
    id: "radiant-field",
    alt: "Saturated atmospheric field with terrain-like scientific contours.",
    colors: ["#ff6b2b", "#ffe257", "#00b7ff", "#3424ff"] as const,
    horizon: 520
  },
  {
    id: "surface-study",
    alt: "Colorful material-study image with hot surface bands and cool shadows.",
    colors: ["#0615ff", "#00e0c6", "#f5ff3b", "#ff3d7f"] as const,
    horizon: 470
  },
  {
    id: "heat-map",
    alt: "Abstract heat-map image with spectral plumes and measurement lines.",
    colors: ["#12002f", "#fa3cff", "#ff8a00", "#eaff00"] as const,
    horizon: 560
  },
  {
    id: "urban-shade",
    alt: "Chromatic city-shade study with bands of reflected light.",
    colors: ["#00a5ff", "#6dff8a", "#fff1a8", "#ff594a"] as const,
    horizon: 500
  },
  {
    id: "ocean-signal",
    alt: "Atmospheric ocean-signal image with luminous scientific layers.",
    colors: ["#02124d", "#00b3ff", "#b2ff59", "#ff00a8"] as const,
    horizon: 450
  },
  {
    id: "night-grid",
    alt: "Night infrastructure image with saturated observational color.",
    colors: ["#020202", "#2d4cff", "#00ffd5", "#ff6a00"] as const,
    horizon: 590
  }
] satisfies Array<{
  id: string;
  alt: string;
  colors: readonly [string, string, string, string];
  horizon: number;
}>;

export function ZeroImageSequence({ open, onClose }: ZeroImageSequenceProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = useMemo<Frame[]>(
    () =>
      frameSpecs.map((frame) => ({
        id: frame.id,
        alt: frame.alt,
        src: frameSvg(frame.id, frame.colors, frame.horizon)
      })),
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const resetFrame = window.requestAnimationFrame(() => setFrameIndex(0));
    let interval = 0;
    let closeTimer = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    root.classList.add("zero-sequence-active");
    document.addEventListener("keydown", handleKeyDown);

    if (!reducedMotion) {
      interval = window.setInterval(() => {
        frame += 1;
        setFrameIndex(frame % frames.length);

        if (frame >= 13) {
          window.clearInterval(interval);
          closeTimer = window.setTimeout(onClose, 220);
        }
      }, 118);
    }

    return () => {
      root.classList.remove("zero-sequence-active");
      document.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(resetFrame);
      window.clearInterval(interval);
      window.clearTimeout(closeTimer);
    };
  }, [frames.length, onClose, open]);

  if (!open) {
    return null;
  }

  const frame = frames[frameIndex];

  return (
    <div className="zero-image-sequence" role="dialog" aria-modal="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={frame.id} src={frame.src} alt={frame.alt} />
      <button type="button" onClick={onClose} aria-label="Close image sequence">
        Close
      </button>
    </div>
  );
}
