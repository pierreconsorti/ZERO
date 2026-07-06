"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { interventions } from "@/lib/data/interventions";
import { researchPapers } from "@/lib/research-papers";
import type { EvidenceProfile } from "@/lib/types";
import { trackExploredIntervention } from "@/lib/visit-tracking";
import { cn } from "@/lib/utils";
import { ConfidencePill } from "./confidence-pill";
import { GlossaryText } from "./glossary-text";
import { ListenButton } from "./listen-button";

type EvidenceProfileCardProps = {
  profile: EvidenceProfile;
};

const plainLanguageClaims: Record<string, string> = {
  "warming-human-caused":
    "The planet is warming mainly because people added heat-trapping gases to the air.",
  "methane-near-term":
    "Cutting methane can slow near-term heating faster than many slower-moving climate actions.",
  "clean-energy-scale":
    "Fossil energy has to be replaced by clean power, electric machines, better grids, storage, and smarter demand.",
  "adaptation-needed":
    "Even if emissions fall, people still need shade, safer infrastructure, and better planning for heat already arriving."
};

const counterArguments: Record<string, string> = {
  "warming-human-caused":
    "The strongest objection is not that physics is absent, but that natural variability and regional records can complicate short-term attribution.",
  "methane-near-term":
    "The strongest objection is that some methane sources are diffuse, seasonal, or hard to assign to one accountable actor.",
  "clean-energy-scale":
    "The strongest objection is that deployment constraints, permitting, materials, and grid queues can slow technically mature solutions.",
  "adaptation-needed":
    "The strongest objection is that adaptation can be used as an excuse to delay mitigation if the two are not held together."
};

const costOfDoingNothing: Record<string, string> = {
  "warming-human-caused":
    "This is one reason emissions cuts matter now: accumulated greenhouse gases keep shaping future heat.",
  "methane-near-term":
    "This is one reason methane matters now: short-lived gases can change the next few decades of warming.",
  "clean-energy-scale":
    "This is one reason deployment speed matters now: infrastructure delays can lock in years of fossil use.",
  "adaptation-needed":
    "This is one reason practical cooling matters now: heat exposure is already changing daily life."
};

export function EvidenceProfileCard({ profile }: EvidenceProfileCardProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"simple" | "precise">("simple");
  const [showCounter, setShowCounter] = useState(false);
  const fields = [
    { label: "What we know", value: profile.whatWeKnow },
    { label: "What we believe", value: profile.whatWeBelieve },
    { label: "What we suspect", value: profile.whatWeSuspect },
    { label: "What remains unknown", value: profile.whatRemainsUnknown },
    { label: "Scientific consensus", value: profile.scientificConsensus },
    { label: "Research maturity", value: profile.researchMaturity },
    { label: "Known disagreements", value: profile.knownDisagreements },
    { label: "Review schedule", value: profile.reviewSchedule }
  ];
  const narrationText = fields
    .map((field) => `${field.label}: ${field.value}`)
    .join(" ");
  const relatedInterventions = useMemo(() => {
    const relatedIds = profile.relatedInterventionIds ?? [];

    return relatedIds
      .map((id) => interventions.find((intervention) => intervention.id === id))
      .filter((intervention): intervention is (typeof interventions)[number] =>
        Boolean(intervention)
      );
  }, [profile.relatedInterventionIds]);
  const relatedPaper = researchPapers.find(
    (paper) => paper.relatedClaimId === profile.id
  );
  const displayedClaim =
    mode === "simple"
      ? plainLanguageClaims[profile.id] ?? profile.claim
      : profile.claim;

  useEffect(() => {
    function handleSharedClose() {
      setOpen(false);
      setShowCounter(false);
    }

    window.addEventListener("zero-close-overlays", handleSharedClose);

    return () =>
      window.removeEventListener("zero-close-overlays", handleSharedClose);
  }, []);

  return (
    <article id={profile.id} className="object-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-balance text-xl font-semibold leading-[1.12] text-zero-ink">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
            className="evidence-claim-toggle"
          >
            <span>{profile.claim}</span>
            <span
              aria-hidden="true"
              className="pill-control-light shrink-0 px-3 py-1.5 font-mono text-lg leading-none transition"
            >
              {open ? "−" : "+"}
            </span>
          </button>
        </h3>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <ConfidencePill level={profile.strengthOfEvidence} />
          <ListenButton
            text={`${profile.claim}. ${narrationText}`}
            className="px-3 py-1 text-xs"
          />
        </div>
      </div>
      <div
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "evidence-accordion-panel grid transition-all duration-200 ease-out",
          open
            ? "visible mt-5 grid-rows-[1fr] opacity-100"
            : "invisible mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mb-5 grid gap-4 rounded-[1.1rem] bg-black/[0.035] p-4">
            <div className="flex flex-wrap gap-2">
              {(["simple", "precise"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={mode === option}
                  className="filter-chip px-3 py-1.5 text-sm"
                  onClick={() => setMode(option)}
                >
                  {option === "simple" ? "Explain simply" : "Explain precisely"}
                </button>
              ))}
              <button
                type="button"
                aria-expanded={showCounter}
                className="filter-chip px-3 py-1.5 text-sm"
                onClick={() => setShowCounter((current) => !current)}
              >
                Counter-argument
              </button>
            </div>
            <p className="text-base leading-7 text-zero-ink">
              <GlossaryText text={displayedClaim} />
            </p>
            {showCounter ? (
              <p className="text-sm leading-6 text-zero-muted">
                <GlossaryText
                  text={counterArguments[profile.id] ?? profile.knownDisagreements}
                />
              </p>
            ) : null}
            {relatedPaper?.confidenceTimeline ? (
              <p className="text-sm leading-6 text-zero-muted">
                {relatedPaper.confidenceTimeline.join(" → ")}
              </p>
            ) : null}
            {relatedPaper?.editHistoryNote ? (
              <p className="text-sm leading-6 text-zero-muted">
                Changed-mind note: {relatedPaper.editHistoryNote}
              </p>
            ) : null}
            <p className="text-sm leading-6 text-zero-muted">
              {costOfDoingNothing[profile.id]}
            </p>
          </div>
          <dl className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <EvidenceField
                key={field.label}
                label={field.label}
                value={field.value}
              />
            ))}
          </dl>
          {relatedInterventions.length > 0 ? (
            <div className="mt-5 rounded-[1.1rem] bg-black/[0.035] p-4">
              <p className="meta-label">Related interventions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedInterventions.map((intervention) => (
                  <Link
                    key={intervention.id}
                    href={`/#${intervention.id}`}
                    onClick={() => trackExploredIntervention(intervention.id)}
                    className="pill-control-light px-3 py-1.5 text-sm transition hover:bg-black hover:text-white"
                  >
                    {intervention.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EvidenceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] bg-black/[0.035] p-4">
      <dt className="meta-label">{label}</dt>
      <dd className="mt-2 text-[0.98rem] leading-6 text-zero-muted sm:text-sm">
        <GlossaryText text={value} />
      </dd>
    </div>
  );
}
