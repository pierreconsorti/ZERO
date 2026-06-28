import { accentGradient, type AccentKey } from "@/lib/data/color-studies";
import { cn } from "@/lib/utils";

type AccentRuleProps = {
  accent: AccentKey;
  className?: string;
};

export function AccentRule({ accent, className }: AccentRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full rounded-full", className)}
      style={{ background: accentGradient(accent) }}
    />
  );
}
