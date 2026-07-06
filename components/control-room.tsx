"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { searchInterventions } from "@/lib/catalogue-search";
import { interventions } from "@/lib/data/interventions";
import { latestResearchLine } from "@/lib/research-papers";

const exchanges: Record<string, string> = {
  "is this hopeless":
    "No. Hopelessness is usually a bad measuring instrument. The better question is which action can be tested next.",
  "what is zero":
    "ZERO is a public instrument for finding cooling possibilities that can survive contact with evidence.",
  "what should i do":
    "Pick one intervention, read its field note, and ask what the smallest honest local test would be.",
  "why cooling":
    "Because heat is where planetary change becomes bodily, architectural, and local.",
  "why not despair":
    "Despair can feel precise while measuring nothing. ZERO prefers measurements that make next actions visible.",
  "what matters most":
    "Stopping emissions matters most globally. Reducing heat exposure matters immediately where people live.",
  "is adaptation enough":
    "No. Adaptation without mitigation becomes a treadmill. Mitigation without adaptation leaves people exposed now.",
  "why methane":
    "Methane is short-lived enough that cuts can change near-term warming, but diffuse enough to demand measurement.",
  "why roofs":
    "Roofs are large, exposed, owned surfaces. That makes them boring in the useful way.",
  "why shade":
    "Shade is direct, legible, and felt immediately. A person knows when it is missing.",
  "what is evidence":
    "Evidence is the part of an idea that can embarrass it into becoming more accurate.",
  "who is this for":
    "For people who need climate work to become more concrete without becoming smaller.",
  "what is next summer":
    "A deadline close enough to test against and far enough to prepare for.",
  "does this scale":
    "Some of it. ZERO separates what scales as infrastructure from what must stay local and measured.",
  "what is the risk":
    "The usual risk is not that nothing works. It is that weak evidence gets packaged as certainty.",
  "how to read":
    "Start with a card, open the field note, then follow the evidence claim it depends on.",
  "why no color":
    "Because the site is trying to make structure do the work color is often asked to fake.",
  "why black":
    "Because the first task is attention. The second task is not wasting it.",
  "what is local":
    "Local means the measurements can be argued with by people who live there.",
  "can this fail":
    "Yes. Failure is useful if it is measured, public, and changes the next attempt.",
  "what is speculative":
    "Speculative means worth asking about, not worth pretending is proven.",
  "what is proven":
    "Proven means the mechanism is sturdy enough to test locally without inventing physics.",
  "what is useful":
    "Useful is an idea with a measurement plan and a plausible owner.",
  "what is beautiful":
    "A system that becomes clearer as pressure rises.",
  "are we late":
    "Yes. Late is not the same as done.",
  "where to begin":
    "Begin with surfaces, shade, buildings, and methane. They give different kinds of leverage.",
  "what is a field note":
    "A field note is the smallest version of an intervention that can be tested without mythologizing it.",
  "what should cities buy":
    "Evidence, procurement discipline, and materials that can be measured after installation.",
  "why public":
    "Because climate work fails when evidence becomes private reassurance.",
  "goodnight":
    "The system is still on. So are the measurements."
};

function readPulse() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem("zero-live-pulse") ?? "{}"
    ) as {
      temperatureLines?: string[];
      daylightLines?: string[];
      updatedAt?: string;
    };

    return parsed;
  } catch {
    return {};
  }
}

function runCommand(input: string) {
  const query = input.trim().toLowerCase();

  if (!query) {
    return "Type a query or a command.";
  }

  if (query === "pulse" || query === "status") {
    const pulse = readPulse();

    return [
      ...(pulse.temperatureLines ?? []),
      ...(pulse.daylightLines ?? []),
      latestResearchLine()
    ].join("\n");
  }

  if (query === "hottest city right now") {
    const pulse = readPulse();
    const lines = pulse.temperatureLines ?? [];

    return lines[0] ?? "Live city temperatures are not loaded yet.";
  }

  if (exchanges[query]) {
    return exchanges[query];
  }

  const matches = searchInterventions(input, interventions).slice(0, 5);

  if (matches.length === 0) {
    return `No exact match for "${input}". Try shade, methane, surfaces, textiles, or passive cooling.`;
  }

  return matches
    .map((match, index) => `${index + 1}. ${match.item.title}`)
    .join("\n");
}

export function ControlRoom() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Type pulse, hottest city right now, or any catalogue query.");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (event.key === "`" && !isTyping) {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const history = useMemo(() => output.split("\n"), [output]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="control-room-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <form
        className="control-room-console"
        onSubmit={(event) => {
          event.preventDefault();
          setOutput(runCommand(input));
          setInput("");
        }}
      >
        <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap leading-6 text-white/80">
          {history.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2">
          <span aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-[#fff] outline-none"
            aria-label="Control room command"
          />
        </label>
      </form>
    </div>
  );
}
