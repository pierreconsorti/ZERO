"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function buildLetterGradient(term: string) {
  const normalized = term.trim().slice(0, 42);

  if (!normalized) {
    return "none";
  }

  const hash = hashString(normalized);
  const letters = Array.from(normalized).filter((character) => character.trim());
  const angle = 18 + (hash % 124);
  const primaryHue = hash % 360;
  const secondaryHue = (primaryHue + 156 + letters.length * 11) % 360;
  const tertiaryHue = (primaryHue + 242 + letters.length * 7) % 360;
  const stops = letters.slice(0, 12).map((letter, index) => {
    const code = letter.charCodeAt(0);
    const hue = (primaryHue + code * 3 + index * 29) % 360;
    const position = Math.round((index / Math.max(letters.length - 1, 1)) * 100);

    return `hsl(${hue} 78% 54% / 0.18) ${position}%`;
  });

  return [
    `linear-gradient(${angle}deg, hsl(${primaryHue} 84% 50% / 0.22), hsl(${secondaryHue} 78% 54% / 0.2), hsl(${tertiaryHue} 74% 58% / 0.16))`,
    `linear-gradient(${angle + 82}deg, ${stops.join(", ")})`,
    `linear-gradient(${angle + 180}deg, transparent 0%, rgb(255 255 255 / 0.05) 46%, transparent 100%)`
  ].join(", ");
}

export function SearchCompositeInput() {
  const [term, setTerm] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const gradient = useMemo(() => buildLetterGradient(term), [term]);

  const stopRecognition = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Some browsers throw if recognition is already idle.
    }
  }, []);

  useEffect(() => {
    const supportFrame = window.requestAnimationFrame(() => {
      setVoiceAvailable(
        Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)
      );
    });

    return () => {
      window.cancelAnimationFrame(supportFrame);
      const recognition = recognitionRef.current;

      if (recognition) {
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onresult = null;
        stopRecognition();
        recognitionRef.current = null;
      }
    };
  }, [stopRecognition]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--zero-search-gradient", gradient);
    root.style.setProperty("--zero-search-active", term.trim() ? "1" : "0");

    return () => {
      root.style.setProperty("--zero-search-gradient", "none");
      root.style.setProperty("--zero-search-active", "0");
    };
  }, [gradient, term]);

  const startVoiceInput = () => {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;

    if (!Recognition) {
      setVoiceMessage("Voice input is not available in this browser.");
      return;
    }

    if (isListening) {
      stopRecognition();
      setIsListening(false);
      setVoiceMessage("Stopped listening.");
      return;
    }

    stopRecognition();

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
      {voiceAvailable ? (
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
      ) : null}
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
