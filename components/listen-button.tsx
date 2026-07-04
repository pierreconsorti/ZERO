"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const narrationStartEvent = "zero-narration-start";
const narrationStopEvent = "zero-narration-stop";

type ListenButtonProps = {
  text: string;
  className?: string;
};

export function ListenButton({ text, className }: ListenButtonProps) {
  const id = useId();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSupported(
        "speechSynthesis" in window &&
          "SpeechSynthesisUtterance" in window
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!supported) {
      return undefined;
    }

    function handleNarrationStart(event: Event) {
      const startEvent = event as CustomEvent<{ id?: string }>;

      if (startEvent.detail?.id !== id) {
        setSpeaking(false);
        utteranceRef.current = null;
      }
    }

    function handleNarrationStop() {
      setSpeaking(false);
      utteranceRef.current = null;
    }

    window.addEventListener(narrationStartEvent, handleNarrationStart);
    window.addEventListener(narrationStopEvent, handleNarrationStop);

    return () => {
      window.removeEventListener(narrationStartEvent, handleNarrationStart);
      window.removeEventListener(narrationStopEvent, handleNarrationStop);
    };
  }, [id, supported]);

  if (!supported) {
    return null;
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    window.dispatchEvent(new CustomEvent(narrationStopEvent));
  };

  const startSpeaking = () => {
    window.speechSynthesis.cancel();
    window.dispatchEvent(
      new CustomEvent(narrationStartEvent, { detail: { id } })
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => {
      utteranceRef.current = null;
      setSpeaking(false);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setSpeaking(false);
    };

    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      aria-pressed={speaking}
      onClick={speaking ? stopSpeaking : startSpeaking}
      className={cn(
        "pill-control-light px-3 py-1.5 text-xs transition hover:bg-black hover:text-white",
        className
      )}
    >
      {speaking ? "Stop" : "Listen"}
    </button>
  );
}
