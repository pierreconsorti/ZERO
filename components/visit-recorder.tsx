"use client";

import { useEffect, useRef } from "react";
import { recordVisit } from "@/lib/visit-tracking";

export function VisitRecorder() {
  const recordedRef = useRef(false);

  useEffect(() => {
    if (recordedRef.current) {
      return;
    }

    recordedRef.current = true;
    recordVisit();
  }, []);

  return null;
}
