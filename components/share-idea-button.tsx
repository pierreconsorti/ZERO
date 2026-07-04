"use client";

import { useEffect, useRef, useState } from "react";

type ShareIdeaButtonProps = {
  id: string;
  title: string;
  description: string;
};

type ShareStatus = "idle" | "opening" | "copied";

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function isShareAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareIdeaButton({
  id,
  title,
  description
}: ShareIdeaButtonProps) {
  const resetTimerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<ShareStatus>("idle");

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const showCopied = () => {
    setStatus("copied");

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, 1800);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#${id}`;
    const shareData = {
      title,
      text: description,
      url
    };

    if (navigator.share) {
      setStatus("opening");

      try {
        await navigator.share(shareData);
        setStatus("idle");
        return;
      } catch (error) {
        if (isShareAbort(error)) {
          setStatus("idle");
          return;
        }
      }
    }

    try {
      await copyToClipboard(`${title}\n${description}\n${url}`);
      showCopied();
    } catch {
      setStatus("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="pill-control-dark w-full px-4 py-2 text-sm shadow-quiet transition hover:opacity-85 sm:w-auto"
      aria-live="polite"
    >
      {status === "opening"
        ? "Opening..."
        : status === "copied"
          ? "Copied"
          : "Share"}
    </button>
  );
}
