"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { roadmapLevers } from "@/lib/content";
import { sourceRegistry } from "@/lib/sources";

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

type SearchResult = {
  id: string;
  title: string;
  source: string;
  body: string;
  href: string;
  kind: "Source" | "System lever";
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const trustedNames = [
  "NASA",
  "NOAA",
  "Our World in Data",
  "OWID",
  "IEA",
  "International Energy Agency"
];

const searchEntries: SearchResult[] = [
  ...sourceRegistry
    .filter((source) =>
      trustedNames.some((trusted) => source.name.includes(trusted))
    )
    .map((source) => ({
      id: source.id,
      title: source.name,
      source: source.trustLevel,
      body: `${source.usedFor} ${source.limitations}`,
      href: source.url,
      kind: "Source" as const
    })),
  ...roadmapLevers
    .filter((lever) =>
      lever.dataSources.some((source) =>
        trustedNames.some((trusted) => source.includes(trusted))
      )
    )
    .map((lever) => ({
      id: lever.id,
      title: lever.title,
      source: lever.dataSources.join(" / "),
      body: `${lever.currentState} ${lever.whatNeedsToChange}`,
      href: "/roadmap",
      kind: "System lever" as const
    }))
];

function matchesQuery(result: SearchResult, query: string) {
  const haystack = `${result.title} ${result.source} ${result.body}`.toLowerCase();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return terms.every((term) => haystack.includes(term));
}

export function SearchCompositeInput() {
  const [term, setTerm] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const results = useMemo(() => {
    const query = term.trim();

    if (!query) {
      return [];
    }

    return searchEntries.filter((entry) => matchesQuery(entry, query)).slice(0, 5);
  }, [term]);

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

  const handleSubmit = () => {
    if (results[0]) {
      window.location.assign(results[0].href);
    }
  };

  return (
    <form
      role="search"
      className="search-composite-control"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor="zero-search" className="sr-only">
        Search authoritative climate sources
      </label>
      <span aria-hidden="true">Search</span>
      <input
        id="zero-search"
        type="search"
        value={term}
        placeholder="NASA, methane, energy..."
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
      {term ? (
        <div className="search-results-panel" aria-live="polite">
          {results.length > 0 ? (
            results.map((result) => (
              <a
                key={result.id}
                href={result.href}
                className="search-result-item"
              >
                <span>{result.kind}</span>
                <strong>{result.title}</strong>
                <small>{result.source}</small>
              </a>
            ))
          ) : (
            <p>
              No match in NASA, NOAA, OWID, or IEA-backed records.
            </p>
          )}
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {voiceMessage}
      </span>
    </form>
  );
}
