"use client";

import { useEffect, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function ScrollToneController() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const samples: number[] = [];
    let frame = 0;
    let replayFrame = 0;
    let replayed = false;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let lastPercent = -1;
    let revealTimeout = 0;

    const setRgb = (name: string, value: number) => {
      const channel = Math.round(clamp(value, 0, 255));
      root.style.setProperty(name, `${channel} ${channel} ${channel}`);
    };

    const resetReplay = () => {
      root.style.setProperty("--zero-scroll-blur", "0px");
      root.style.setProperty("--zero-scroll-fade", "1");
      root.style.setProperty("--zero-scroll-veil", "0");
    };

    const startReplay = (amplitude: number) => {
      if (motionQuery.matches) {
        return;
      }

      const startedAt = performance.now();
      const duration = 900;

      const tick = (now: number) => {
        const elapsed = clamp((now - startedAt) / duration, 0, 1);
        const wave = Math.sin(elapsed * Math.PI);
        const pulse = wave * amplitude;

        root.style.setProperty("--zero-scroll-blur", `${(pulse * 2.4).toFixed(2)}px`);
        root.style.setProperty("--zero-scroll-fade", `${(1 - pulse * 0.075).toFixed(3)}`);
        root.style.setProperty("--zero-scroll-veil", `${(pulse * 0.055).toFixed(3)}`);

        if (elapsed < 1) {
          replayFrame = window.requestAnimationFrame(tick);
        } else {
          resetReplay();
        }
      };

      replayFrame = window.requestAnimationFrame(tick);
    };

    const update = (now: number) => {
      frame = 0;

      const y = window.scrollY;
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      const rawProgress = clamp(y / maxScroll, 0, 1);
      const progress = smoothStep(clamp(y / (maxScroll * 0.82), 0, 1));
      const percent = Math.round(rawProgress * 100);
      const channel = progress * 255;

      if (percent !== lastPercent) {
        lastPercent = percent;
        setScrollPercent(percent);
      }

      setRgb("--zero-page-bg-rgb", channel);
      setRgb("--zero-page-fg-rgb", 255 - channel);
      setRgb("--zero-section-bg-rgb", 18 + progress * 226);
      setRgb("--zero-card-bg-rgb", 10 + progress * 245);
      root.style.setProperty("--zero-scroll-progress", rawProgress.toFixed(4));

      const deltaY = y - lastY;
      const deltaT = Math.max(now - lastT, 1);
      const velocity = Math.abs(deltaY / deltaT);

      if (Math.abs(deltaY) > 0.5) {
        samples.push(velocity);
        if (samples.length > 36) {
          samples.shift();
        }
      }

      if (!replayed && progress > 0.42 && samples.length >= 8) {
        const averageVelocity =
          samples.reduce((total, sample) => total + sample, 0) / samples.length;
        const amplitude = clamp(averageVelocity / 2.4, 0.16, 0.72);
        replayed = true;
        startReplay(amplitude);
      }

      if (replayed && progress < 0.08) {
        replayed = false;
        samples.length = 0;
      }

      lastY = y;
      lastT = now;
    };

    const scheduleUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const setTilt = (value: number) => {
      const tilt = clamp(value, -1, 1);
      root.style.setProperty("--zero-tilt-x", tilt.toFixed(3));
      root.style.setProperty("--zero-tilt-cool", Math.max(0, -tilt).toFixed(3));
      root.style.setProperty("--zero-tilt-warm", Math.max(0, tilt).toFixed(3));
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.gamma !== "number") {
        return;
      }

      setTilt(event.gamma / 35);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const x = event.clientX / Math.max(window.innerWidth, 1);
      setTilt((x - 0.5) * 0.45);
    };

    const triggerTouchReveal = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (!event.target.closest(".object-card, .atmospheric-panel")) {
        return;
      }

      root.classList.add("zero-touch-reveal-active");
      window.clearTimeout(revealTimeout);
      revealTimeout = window.setTimeout(() => {
        root.classList.remove("zero-touch-reveal-active");
      }, 420);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerdown", triggerTouchReveal, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerdown", triggerTouchReveal);
      window.clearTimeout(revealTimeout);
      root.classList.remove("zero-touch-reveal-active");
      setTilt(0);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      if (replayFrame) {
        window.cancelAnimationFrame(replayFrame);
      }
      resetReplay();
    };
  }, []);

  return (
    <div
      className="scroll-progress-indicator"
      aria-label={`Scroll progress ${scrollPercent}%`}
      aria-live="polite"
    >
      {scrollPercent}%
    </div>
  );
}
