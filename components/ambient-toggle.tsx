"use client";

import { useRef, useState } from "react";

export function AmbientToggle() {
  const audioRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);

  const stop = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    gainRef.current?.disconnect();
    void audioRef.current?.close();
    oscillatorRef.current = null;
    gainRef.current = null;
    audioRef.current = null;
    setEnabled(false);
  };

  const start = () => {
    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const storedTemp = Number(
      window.localStorage.getItem("zero-local-climate-current-temp")
    );
    const baseFrequency = Number.isFinite(storedTemp)
      ? 90 + Math.max(Math.min(storedTemp, 42), -5) * 1.2
      : 110;

    oscillator.type = "sine";
    oscillator.frequency.value = baseFrequency;
    gain.gain.value = 0.018;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    audioRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    setEnabled(true);
  };

  return (
    <button
      type="button"
      className="pill-control-light px-3 py-1.5 text-sm"
      onClick={enabled ? stop : start}
      aria-pressed={enabled}
    >
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
