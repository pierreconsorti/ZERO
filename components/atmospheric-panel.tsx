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
  mist: "bg-[#f6f6f6] text-black",
  warm: "bg-[#f4f4f4] text-black",
  ink: "bg-black text-white"
};

export function AtmosphericPanel({
  children,
  className,
  contentClassName,
  tone = "mist"
}: AtmosphericPanelProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-[92rem] overflow-hidden rounded-[2rem] shadow-quiet sm:rounded-[2.75rem]",
        toneClasses[tone],
        className
      )}
    >
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}
