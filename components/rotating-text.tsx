"use client";

import { useEffect, useMemo, useState } from "react";

type RotatingTextProps = {
  items: string[];
  intervalMs?: number;
  className?: string;
};

export function RotatingText({
  items,
  className
}: RotatingTextProps) {
  const cleanItems = useMemo(
    () => items.map((item) => item.trim()).filter(Boolean),
    [items]
  );
  const itemSignature = cleanItems.join("\u001f");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (cleanItems.length <= 1) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setIndex(Math.floor(Math.random() * cleanItems.length));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [cleanItems.length, itemSignature]);

  if (cleanItems.length === 0) {
    return null;
  }

  const value = cleanItems[index % cleanItems.length];

  return (
    <span
      className={["rotating-text-static", className].filter(Boolean).join(" ")}
      suppressHydrationWarning
      title={value}
    >
      {value}
    </span>
  );
}
