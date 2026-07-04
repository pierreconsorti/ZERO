"use client";

import { useEffect, useRef, useState } from "react";

type ShareIdeaButtonProps = {
  id: string;
  title: string;
  description: string;
};

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const showCopied = () => {
    setCopied(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
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
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (isShareAbort(error)) {
          return;
        }
      }
    }

    try {
      await copyToClipboard(`${title}\n${description}\n${url}`);
      showCopied();
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="pill-control-dark w-full px-4 py-2 text-sm shadow-quiet transition hover:opacity-85 sm:w-auto"
      aria-live="polite"
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}
