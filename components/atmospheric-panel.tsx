import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AtmosphericPanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: "paper" | "mist" | "warm" | "ink";
};

const toneClasses: Record<NonNullable<AtmosphericPanelProps["tone"]>, string> = {
  paper: "bg-white text-black",
  mist: "bg-[#f6f6f2] text-black",
  warm: "bg-[#f4f1eb] text-black",
  ink: "bg-black text-white"
};

export function AtmosphericPanel({
  children,
  className,
  contentClassName,
  tone = "mist"
}: AtmosphericPanelProps) {
  const isInk = tone === "ink";

  return (
    <section
      className={cn(
        "relative mx-auto max-w-[92rem] overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem]",
        toneClasses[tone],
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          isInk ? "bg-white/[0.035]" : "bg-white/[0.34]"
        )}
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}
