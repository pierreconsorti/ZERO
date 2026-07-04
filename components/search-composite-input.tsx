"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import {
  getInterventionFamilies,
  interventionFamilies
} from "@/lib/data/intervention-filters";
import {
  fieldPrototypes,
  interventions,
  type FieldPrototype,
  type Intervention
} from "@/lib/data/interventions";
import { trackExploredIntervention } from "@/lib/visit-tracking";

type InterventionMatch = {
  kind: "intervention";
  item: Intervention;
  score: number;
};

type FieldPrototypeMatch = {
  kind: "prototype";
  item: FieldPrototype;
  score: number;
};

type SearchResult = InterventionMatch | FieldPrototypeMatch;

function fieldIncludes(text: string | string[] | undefined, query: string) {
  const value = Array.isArray(text) ? text.join(" ") : text;

  return value ? value.toLowerCase().includes(query) : false;
}

function searchInterventions(query: string, items: Intervention[]) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  return items
    .map((item, index) => {
      const families = getInterventionFamilies(item).join(" ");
      const fields = [
        { text: item.title, weight: 3 },
        { text: families, weight: 2 },
        { text: item.category, weight: 2 },
        { text: item.mechanism, weight: 1 },
        {
          text: `${item.whatMakesItInteresting} ${item.localPrototype}`,
          weight: 1
        },
        { text: item.risks, weight: 1 },
        {
          text: `${item.scale.join(" ")} ${item.whatToMeasure.join(" ")} ${
            item.status
          } ${item.evidenceStrength} ${item.maturity}`,
          weight: 1
        }
      ];
      const score = fields.reduce(
        (total, field) =>
          fieldIncludes(field.text, q) ? total + field.weight : total,
        0
      );

      return { kind: "intervention" as const, item, score, index };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => ({
      kind: result.kind,
      item: result.item,
      score: result.score
    }));
}

function searchFieldPrototypes(query: string, items: FieldPrototype[]) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  return items
    .map((item, index) => {
      const fields = [
        { text: item.title, weight: 3 },
        {
          text: `${item.whatToTest} ${item.whereToTryIt}`,
          weight: 1
        },
        { text: item.whatToMeasure, weight: 1 },
        { text: item.toolsNeeded, weight: 1 },
        { text: `${item.evidenceValue} ${item.possibleRisk}`, weight: 1 }
      ];
      const score = fields.reduce(
        (total, field) =>
          fieldIncludes(field.text, q) ? total + field.weight : total,
        0
      );

      return { kind: "prototype" as const, item, score, index };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => ({
      kind: result.kind,
      item: result.item,
      score: result.score
    }));
}

function closestFallback(query: string, items: Intervention[], max = 3) {
  const q = query.trim().toLowerCase();
  const matchedFamily = interventionFamilies.find((family) => {
    const normalized = family.toLowerCase();

    return normalized.includes(q) || q.includes(normalized);
  });
  const pool = matchedFamily
    ? items.filter((item) => getInterventionFamilies(item).includes(matchedFamily))
    : items;

  return pool.slice(0, max).map((item) => ({
    kind: "intervention" as const,
    item,
    score: 0
  }));
}

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
                      <span>Intervention</span>
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
