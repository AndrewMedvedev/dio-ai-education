import { useEffect, useMemo, useRef, useState } from "react";
import "./easter-egg.css";

const FLIGHT_DURATION_MS = 4600;
const FLOOD_DURATION_MS = 2100;
const HOLD_DURATION_MS = 900;
const FADE_DURATION_MS = 900;
const MASCOT_IMAGE_SRC = "/easter-egg/fish-plush.png";

const FLIGHT_PATH = [
  { x: 91, y: 84 },
  { x: 82, y: 70 },
  { x: 68, y: 52 },
  { x: 52, y: 35 },
  { x: 33, y: 28 },
  { x: 18, y: 40 },
  { x: 23, y: 58 },
  { x: 40, y: 72 },
  { x: 61, y: 72 },
  { x: 79, y: 58 },
  { x: 86, y: 38 },
  { x: 70, y: 24 },
  { x: 48, y: 22 },
  { x: 30, y: 35 },
  { x: 24, y: 55 },
  { x: 36, y: 68 },
  { x: 58, y: 66 },
  { x: 76, y: 52 },
  { x: 86, y: 34 },
];

const SCREEN_DRIPS = [
  { left: "3%", delay: "0ms", duration: "1480ms", size: 6 },
  { left: "7%", delay: "150ms", duration: "1360ms", size: 5 },
  { left: "11%", delay: "310ms", duration: "1720ms", size: 7 },
  { left: "15%", delay: "470ms", duration: "1620ms", size: 6 },
  { left: "19%", delay: "80ms", duration: "1560ms", size: 8 },
  { left: "23%", delay: "240ms", duration: "1460ms", size: 5 },
  { left: "27%", delay: "400ms", duration: "1690ms", size: 7 },
  { left: "31%", delay: "560ms", duration: "1410ms", size: 6 },
  { left: "35%", delay: "120ms", duration: "1770ms", size: 9 },
  { left: "39%", delay: "280ms", duration: "1520ms", size: 6 },
  { left: "43%", delay: "440ms", duration: "1670ms", size: 7 },
  { left: "47%", delay: "600ms", duration: "1380ms", size: 5 },
  { left: "51%", delay: "70ms", duration: "1740ms", size: 8 },
  { left: "55%", delay: "230ms", duration: "1580ms", size: 6 },
  { left: "59%", delay: "390ms", duration: "1490ms", size: 7 },
  { left: "63%", delay: "550ms", duration: "1640ms", size: 5 },
  { left: "67%", delay: "110ms", duration: "1710ms", size: 8 },
  { left: "71%", delay: "270ms", duration: "1470ms", size: 6 },
  { left: "75%", delay: "430ms", duration: "1590ms", size: 7 },
  { left: "79%", delay: "590ms", duration: "1430ms", size: 5 },
  { left: "83%", delay: "130ms", duration: "1760ms", size: 9 },
  { left: "87%", delay: "290ms", duration: "1510ms", size: 6 },
  { left: "91%", delay: "450ms", duration: "1660ms", size: 7 },
  { left: "95%", delay: "610ms", duration: "1390ms", size: 5 },
];

function getFlightState(progress) {
  const normalized = Math.min(1, Math.max(0, progress));
  const segmentCount = FLIGHT_PATH.length - 1;
  const scaled = normalized * segmentCount;
  const fromIndex = Math.min(segmentCount - 1, Math.floor(scaled));
  const local = scaled - fromIndex;
  const from = FLIGHT_PATH[fromIndex];
  const to = FLIGHT_PATH[fromIndex + 1];
  const x = from.x + (to.x - from.x) * local;
  const y = from.y + (to.y - from.y) * local;
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI) + 90;

  return { x, y, angle };
}

export default function EasterEgg() {
  const rafRef = useRef(0);
  const [phase, setPhase] = useState("idle");
  const [flightProgress, setFlightProgress] = useState(0);
  const [floodProgress, setFloodProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const rocketState = useMemo(() => getFlightState(flightProgress), [flightProgress]);
  const canTrigger = phase === "idle";
  const showRocket = phase === "launch" || phase === "flood";
  const showOverlay = phase !== "idle";
  const shotScale = phase === "flood" ? 1.6 + floodProgress * 3 : 1.05 + flightProgress * 0.45;
  const shotOpacity = phase === "flood" ? 0.98 : 0.86;

  const startEasterEgg = () => {
    if (!canTrigger) {
      return;
    }

    setFadeOut(false);
    setFlightProgress(0);
    setFloodProgress(0);
    setPhase("launch");
  };

  useEffect(() => {
    if (phase !== "launch") {
      return undefined;
    }

    const startedAt = performance.now();

    const animate = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / FLIGHT_DURATION_MS);
      setFlightProgress(progress);

      if (progress >= 1) {
        setPhase("flood");
        return;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "flood") {
      return undefined;
    }

    const startedAt = performance.now();

    const animate = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / FLOOD_DURATION_MS);
      setFloodProgress(progress);

      if (progress >= 1) {
        setPhase("hold");
        return;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "hold") {
      return undefined;
    }

    const holdTimer = window.setTimeout(() => {
      setFadeOut(true);
      setPhase("fade");
    }, HOLD_DURATION_MS);

    return () => {
      window.clearTimeout(holdTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "fade") {
      return undefined;
    }

    const fadeTimer = window.setTimeout(() => {
      setPhase("idle");
      setFadeOut(false);
      setFlightProgress(0);
      setFloodProgress(0);
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="egg-trigger-cell"
        onClick={startEasterEgg}
        disabled={!canTrigger}
        aria-label="Запустить пасхалку"
        title="Пасхалка"
      />

      {showOverlay && (
        <div className={`egg-overlay ${fadeOut ? "is-fading" : ""}`} aria-hidden="true">
          <div className="egg-liquid" style={{ "--egg-flood-progress": floodProgress }}>
            <div className="egg-liquid-drips">
              {SCREEN_DRIPS.map((drip, index) => (
                <span
                  key={`screen-drip-${index}`}
                  className="egg-liquid-drip"
                  style={{
                    left: drip.left,
                    "--egg-drip-delay": drip.delay,
                    "--egg-drip-duration": drip.duration,
                    "--egg-drip-size": `${drip.size}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {showRocket && (
            <div
              className="egg-rocket"
              style={{
                left: `${rocketState.x}%`,
                top: `${rocketState.y}%`,
                transform: `translate(-50%, -50%) rotate(${rocketState.angle}deg)`,
              }}
            >
              <img className="egg-mascot-img" src={MASCOT_IMAGE_SRC} alt="" draggable="false" />
              <span
                className="egg-rocket-shot"
                style={{
                  "--egg-shot-scale": shotScale,
                  "--egg-shot-opacity": shotOpacity,
                }}
              >
                <span className="egg-rocket-drip egg-rocket-drip-a" />
                <span className="egg-rocket-drip egg-rocket-drip-b" />
                <span className="egg-rocket-drip egg-rocket-drip-c" />
                <span className="egg-rocket-drip egg-rocket-drip-d" />
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
