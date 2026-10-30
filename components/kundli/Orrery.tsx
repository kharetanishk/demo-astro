"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { chart, planetArt, type Planet } from "./chart";
import s from "./Orrery.module.css";

/* Each graha on its own orbit, in cqw of the sky: its size on screen, how long
   it takes to come round, and which way. Rahu and Ketu share an orbit, always
   opposite, and run backwards. The sun's place is the middle. */
const ORBITS: Record<string, { rx: number; size: number; period: number; backwards?: boolean }> = {
  Moon: { rx: 18, size: 6, period: 42 },
  Mercury: { rx: 23, size: 5.4, period: 58 },
  Venus: { rx: 28, size: 7, period: 78 },
  Mars: { rx: 32.5, size: 6.4, period: 104 },
  Jupiter: { rx: 37, size: 11, period: 150 },
  Saturn: { rx: 42, size: 16, period: 210 },
  Rahu: { rx: 47, size: 7.6, period: 280, backwards: true },
  Ketu: { rx: 47, size: 7.2, period: 280, backwards: true },
};
const TILT = 0.5;
const STEPS = 72;
const LANDING_MS = 1500;

/* Where the planet stood at birth: its longitude, round the ecliptic */
const longitude = (p: Planet) => ((p.sign - 1) * 30 + parseInt(p.degree, 10)) * (Math.PI / 180);

function place(rx: number, a: number) {
  const near = (Math.sin(a) + 1) / 2;
  return `translate(${(Math.cos(a) * rx).toFixed(2)}cqw, ${(Math.sin(a) * rx * TILT).toFixed(2)}cqw) scale(${(0.74 + near * 0.42).toFixed(3)})`;
}

/* A little solar system of your birth chart: the planets start where they stood
   when you were born, then drift on. Tap one to read it. Sampled once into
   keyframes the compositor plays, so it costs the page nothing. */
export function Orrery({ selected, onSelect }: { selected: string; onSelect: (name: string) => void }) {
  const sky = useRef<HTMLDivElement>(null);
  const moving = chart.planets.filter((p) => ORBITS[p.name]);
  const sun = chart.planets.find((p) => p.name === "Sun")!;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sky.current;
    if (!el) return;
    const running: Animation[] = [];
    let live = true;
    moving.forEach((p) => {
      const node = el.querySelector<HTMLElement>(`[data-planet="${p.name}"]`);
      if (!node) return;
      const o = ORBITS[p.name];
      const start = longitude(p);
      const dir = o.backwards ? -1 : 1;
      // They spiral out from the sun, then keep turning
      const landing = Array.from({ length: 25 }, (_, k) => {
        const t = k / 24;
        const ease = 1 - (1 - t) ** 3;
        const a = start - dir * (1 - ease) * Math.PI * 1.4;
        const near = (Math.sin(a) + 1) / 2;
        return { offset: t, transform: `translate(${(Math.cos(a) * o.rx * ease).toFixed(2)}cqw, ${(Math.sin(a) * o.rx * TILT * ease).toFixed(2)}cqw) scale(${((0.74 + near * 0.42) * (0.2 + ease * 0.8)).toFixed(3)})`, opacity: Math.min(1, t * 4) };
      });
      const intro = node.animate(landing, { duration: LANDING_MS, delay: o.rx * 6, fill: "both", easing: "linear" });
      running.push(intro);
      const frames = Array.from({ length: STEPS + 1 }, (_, k) => ({ offset: k / STEPS, transform: place(o.rx, start + dir * (k / STEPS) * Math.PI * 2) }));
      intro.finished
        .then(() => {
          if (!live) return;
          running.push(node.animate(frames, { duration: o.period * 1000, iterations: Infinity, easing: "linear" }));
          intro.cancel();
        })
        .catch(() => {});
    });
    return () => {
      live = false;
      running.forEach((a) => a.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={sky} className={s.orrery}>
      <svg className={s.orbits} viewBox="-50 -27 100 54" aria-hidden>
        {[...new Set(Object.values(ORBITS).map((o) => o.rx))].map((rx) => (
          <ellipse key={rx} rx={rx} ry={rx * TILT} />
        ))}
      </svg>

      <button type="button" className={s.sun} data-on={selected === sun.name || undefined} aria-label="Sun" aria-pressed={selected === sun.name} onClick={() => onSelect(sun.name)}>
        <Image src={planetArt(sun.name)} alt="" width={128} height={128} priority />
      </button>

      {moving.map((p) => {
        const o = ORBITS[p.name];
        return (
          <button
            key={p.name}
            type="button"
            data-planet={p.name}
            className={s.planet}
            data-on={selected === p.name || undefined}
            aria-label={p.name}
            aria-pressed={selected === p.name}
            onClick={() => onSelect(p.name)}
            style={{ "--size": o.size, transform: place(o.rx, longitude(p)) } as CSSProperties}
          >
            <Image src={planetArt(p.name)} alt="" width={96} height={96} loading="eager" />
          </button>
        );
      })}
    </div>
  );
}
