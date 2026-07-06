"use client";

import { useEffect, useMemo, useState } from "react";

type RotatingTextProps = {
  items: string[];
  intervalMs?: number;
  className?: string;
};

export function RotatingText({
  items,
  intervalMs = 6500,
  className
}: RotatingTextProps) {
  const cleanItems = useMemo(
    () => items.map((item) => item.trim()).filter(Boolean),
    [items]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (cleanItems.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % cleanItems.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [cleanItems.length, intervalMs]);

  if (cleanItems.length === 0) {
    return null;
  }

  return <span className={className}>{cleanItems[index % cleanItems.length]}</span>;
}
