import type { ReactNode } from "react";
import { atmosphericGradient, type AccentKey } from "@/lib/data/color-studies";
import { cn } from "@/lib/utils";

type AtmosphericPanelProps = {
  accent: AccentKey;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  dark?: boolean;
};

export function AtmosphericPanel({
  accent,
  children,
  className,
  contentClassName,
  dark = false
}: AtmosphericPanelProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-[92rem] overflow-hidden rounded-[2rem] sm:rounded-[3rem]",
        dark ? "bg-black text-white" : "bg-white text-black",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-90 blur-2xl"
        style={{ background: atmosphericGradient(accent) }}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          dark ? "bg-black/[0.66]" : "bg-white/[0.68]"
        )}
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}
