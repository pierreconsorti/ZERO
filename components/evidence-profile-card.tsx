"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { interventions } from "@/lib/data/interventions";
import type { EvidenceProfile } from "@/lib/types";
import { trackExploredIntervention } from "@/lib/visit-tracking";
import { cn } from "@/lib/utils";
import { ConfidencePill } from "./confidence-pill";
import { GlossaryText } from "./glossary-text";
import { ListenButton } from "./listen-button";

type EvidenceProfileCardProps = {
  profile: EvidenceProfile;
};

export function EvidenceProfileCard({ profile }: EvidenceProfileCardProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
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
