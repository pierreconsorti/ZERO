"use client";

import { useEffect, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

function mixRgb(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number
) {
  const progress = clamp(amount, 0, 1);

  return [
    Math.round(from[0] + (to[0] - from[0]) * progress),
    Math.round(from[1] + (to[1] - from[1]) * progress),
    Math.round(from[2] + (to[2] - from[2]) * progress)
  ] as const;
}

function getScrollBackground(progress: number) {
  return mixRgb([0, 0, 0], [255, 255, 255], progress);
}

function getLuminance([red, green, blue]: readonly [number, number, number]) {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

type AmbientLightSensorLike = EventTarget & {
  illuminance: number;
  start: () => void;
  stop: () => void;
};

type AmbientLightSensorConstructor = new () => AmbientLightSensorLike;

export function ScrollToneController() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [needsMotionPermission, setNeedsMotionPermission] = useState(false);

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
    let permissionFrame = 0;
    let ambientSensor: AmbientLightSensorLike | null = null;

    const setRgb = (name: string, rgb: readonly [number, number, number]) => {
      root.style.setProperty(name, `${rgb[0]} ${rgb[1]} ${rgb[2]}`);
    };

    const resetReplay = () => {
      root.style.setProperty("--zero-content-fade", "1");
      root.style.setProperty("--zero-replay-blur", "0px");
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

        root.style.setProperty("--zero-content-fade", `${(1 - pulse * 0.025).toFixed(3)}`);
        root.style.setProperty("--zero-replay-blur", `${(pulse * 1.4).toFixed(2)}px`);
        root.style.setProperty("--zero-scroll-veil", `${(pulse * 0.045).toFixed(3)}`);

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
      const progress = smoothStep(rawProgress);
      const percent = Math.round(rawProgress * 100);
      const background = getScrollBackground(progress);
      const textRgb =
        getLuminance(background) > 0.54
          ? ([0, 0, 0] as const)
          : ([255, 255, 255] as const);
      const inverseTextRgb =
        textRgb[0] === 0 ? ([255, 255, 255] as const) : ([0, 0, 0] as const);
      const surfaceRgb =
        textRgb[0] === 0
          ? mixRgb(background, [255, 255, 255], 0.78)
          : mixRgb(background, [0, 0, 0], 0.72);

      if (percent !== lastPercent) {
        lastPercent = percent;
        setScrollPercent(percent);
      }

      setRgb("--zero-page-bg-rgb", background);
      setRgb("--zero-page-fg-rgb", textRgb);
      setRgb("--zero-inverse-fg-rgb", inverseTextRgb);
      setRgb("--zero-section-bg-rgb", surfaceRgb);
      setRgb("--zero-card-bg-rgb", surfaceRgb);
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

      if (!replayed && rawProgress > 0.42 && samples.length >= 8) {
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

    const setAmbientDim = (lux: number) => {
      const dim = clamp((80 - lux) / 80, 0, 1) * 0.045;
      root.style.setProperty("--zero-ambient-dim", dim.toFixed(3));
    };

    try {
      const Sensor = (window as Window & {
        AmbientLightSensor?: AmbientLightSensorConstructor;
      }).AmbientLightSensor;

      if (Sensor) {
        ambientSensor = new Sensor();
        ambientSensor.addEventListener("reading", () => {
          if (ambientSensor) {
            setAmbientDim(ambientSensor.illuminance);
          }
        });
        ambientSensor.addEventListener("error", () => {
          root.style.setProperty("--zero-ambient-dim", "0");
        });
        ambientSensor.start();
      }
    } catch {
      root.style.setProperty("--zero-ambient-dim", "0");
    }

    const maybeOrientation = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<PermissionState>;
        })
      | undefined;

    permissionFrame = window.requestAnimationFrame(() => {
      setNeedsMotionPermission(
        typeof maybeOrientation?.requestPermission === "function"
      );
    });

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

      const panel = event.target.closest(".object-card, .atmospheric-panel");

      if (!panel) {
        return;
      }

      panel.classList.add("is-pressing-panel");
      root.classList.add("zero-touch-reveal-active");
      window.clearTimeout(revealTimeout);
      revealTimeout = window.setTimeout(() => {
        panel.classList.remove("is-pressing-panel");
        root.classList.remove("zero-touch-reveal-active");
      }, 560);
    };

    const releaseTouchReveal = () => {
      window.clearTimeout(revealTimeout);
      document
        .querySelectorAll(".is-pressing-panel")
        .forEach((panel) => panel.classList.remove("is-pressing-panel"));
      root.classList.remove("zero-touch-reveal-active");
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerdown", triggerTouchReveal, { passive: true });
    document.addEventListener("pointerup", releaseTouchReveal);
    document.addEventListener("pointercancel", releaseTouchReveal);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerdown", triggerTouchReveal);
      document.removeEventListener("pointerup", releaseTouchReveal);
      document.removeEventListener("pointercancel", releaseTouchReveal);
      window.clearTimeout(revealTimeout);
      releaseTouchReveal();
      root.classList.remove("zero-touch-reveal-active");
      setTilt(0);
      root.style.setProperty("--zero-ambient-dim", "0");
      try {
        ambientSensor?.stop();
      } catch {
        // Sensor APIs may throw when already stopped or denied.
      }
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      if (permissionFrame) {
        window.cancelAnimationFrame(permissionFrame);
      }
      if (replayFrame) {
        window.cancelAnimationFrame(replayFrame);
      }
      resetReplay();
    };
  }, []);

  const requestMotionPermission = async () => {
    const maybeOrientation = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<PermissionState>;
        })
      | undefined;

    if (typeof maybeOrientation?.requestPermission !== "function") {
      setNeedsMotionPermission(false);
      return;
    }

    try {
      const result = await maybeOrientation.requestPermission();
      setNeedsMotionPermission(result !== "granted");
    } catch {
      setNeedsMotionPermission(false);
    }
  };

  return (
    <div className="scroll-progress-indicator" aria-live="polite">
      <span aria-label={`Scroll progress ${scrollPercent}%`}>{scrollPercent}%</span>
      {needsMotionPermission ? (
        <button type="button" onClick={requestMotionPermission}>
          Tilt
        </button>
      ) : null}
    </div>
  );
}
