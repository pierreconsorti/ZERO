"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
import {
  getInterventionFamilies,
  interventionFamilies
} from "@/lib/data/intervention-filters";
import {
  closestFallback,
  searchFieldPrototypes,
  searchInterventions,
  type SearchResult
} from "@/lib/catalogue-search";
import {
  fieldPrototypes,
  interventions,
  type FieldPrototype,
  type Intervention
} from "@/lib/data/interventions";
import {
  logPersonalEvent,
  readExploredInterventionIds,
  subscribeToVisitTracking,
  trackExploredIntervention
} from "@/lib/visit-tracking";

function resultHref(result: SearchResult) {
  return `/#${result.item.id}`;
}

function interventionSubtitle(item: Intervention) {
  const families = getInterventionFamilies(item);

  return `${families.join(" / ")} · ${item.maturity} · Evidence ${item.evidenceStrength}`;
}

function prototypeSubtitle(item: FieldPrototype) {
  return `Field prototype · ${item.whatToMeasure.slice(0, 2).join(" / ")}`;
}

export function SearchCompositeInput() {
  const inputId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const resultsPanelRef = useRef<HTMLDivElement | null>(null);
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const exploredKey = useSyncExternalStore(
    subscribeToVisitTracking,
    () => readExploredInterventionIds().join("\u001f"),
    () => ""
  );
  const exploredIds = useMemo(
    () => new Set(exploredKey ? exploredKey.split("\u001f") : []),
    [exploredKey]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedTerm(term);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        formRef.current &&
        !formRef.current.contains(target)
      ) {
        setPanelOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const query = debouncedTerm.trim();
  const exactInterventions = useMemo(
    () => searchInterventions(query, interventions),
    [query]
  );
  const exactPrototypes = useMemo(
    () => searchFieldPrototypes(query, fieldPrototypes),
    [query]
  );
  const isFallback =
    query.length > 0 &&
    exactInterventions.length === 0 &&
    exactPrototypes.length === 0;
  const fallbackInterventions = useMemo(
    () => (isFallback ? closestFallback(query, interventions) : []),
    [isFallback, query]
  );
  const visibleInterventions = isFallback
    ? fallbackInterventions
    : exactInterventions.slice(0, 4);
  const visiblePrototypes = isFallback ? [] : exactPrototypes.slice(0, 3);
  const fallbackNames = fallbackInterventions
    .map((result) => result.item.title)
    .join(", ");

  const runSuggestionSearch = (suggestion: string) => {
    setTerm(suggestion);
    setDebouncedTerm(suggestion);
    setPanelOpen(true);
  };

  const handleSubmit = () => {
    if (!term.trim()) {
      return;
    }

    setDebouncedTerm(term);
    setPanelOpen(true);
    logPersonalEvent({
      type: "searched",
      label: term.trim(),
      timestamp: new Date().toISOString()
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resultsPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  };

  return (
    <form
      ref={formRef}
      role="search"
      className="search-composite-control"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search ZERO catalogue
      </label>
      <span aria-hidden="true">Search</span>
      <input
        id={inputId}
        data-zero-search-input="true"
        type="search"
        value={term}
        placeholder="shade, methane, cool roofs..."
        autoComplete="off"
        onChange={(event) => {
          setTerm(event.target.value);
          setPanelOpen(true);
        }}
        onFocus={() => setPanelOpen(true)}
      />
      {term ? (
        <button
          type="button"
          onClick={() => {
            setTerm("");
            setDebouncedTerm("");
            setPanelOpen(true);
          }}
        >
          Clear
        </button>
      ) : null}
      {panelOpen ? (
        <div
          ref={resultsPanelRef}
          className="search-results-panel"
          aria-live="polite"
        >
          {term.trim() ? (
            <>
              {isFallback ? (
                <p>
                  No exact match for &quot;{query}&quot; — closest: {fallbackNames}
                </p>
              ) : null}
              {visibleInterventions.length > 0 ? (
                <div className="search-results-section">
                  <p className="search-results-group-label">Interventions</p>
                  {visibleInterventions.map((result) => (
                    <a
                      key={result.item.id}
                      href={resultHref(result)}
                      className="search-result-item"
                      onClick={() => {
                        trackExploredIntervention(result.item.id);
                        setPanelOpen(false);
                      }}
                    >
                      <span>
                        Intervention
                        {exploredIds.has(result.item.id) ? " · Explored" : ""}
                      </span>
                      <strong>{result.item.title}</strong>
                      <small>{interventionSubtitle(result.item)}</small>
                    </a>
                  ))}
                </div>
              ) : null}
              {visiblePrototypes.length > 0 ? (
                <div className="search-results-section">
                  <p className="search-results-group-label">Field prototypes</p>
                  {visiblePrototypes.map((result) => (
                    <a
                      key={result.item.id}
                      href={resultHref(result)}
                      className="search-result-item"
                      onClick={() => setPanelOpen(false)}
                    >
                      <span>Field prototype</span>
                      <strong>{result.item.title}</strong>
                      <small>{prototypeSubtitle(result.item)}</small>
                    </a>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="search-suggestions">
              <p className="search-results-group-label">Try searching</p>
              <div className="search-suggestion-grid">
                {interventionFamilies.slice(0, 6).map((family) => (
                  <button
                    key={family}
                    type="button"
                    onClick={() => runSuggestionSearch(family)}
                  >
                    {family}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
