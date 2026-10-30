"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { NOW, clock, days } from "./days";
import s from "./Panchang.module.css";

/* The sky arc: sunrise on the left, sunset on the right, on a half circle */
const C = { x: 160, y: 168, r: 138 };
const at = (f: number) => {
  const a = Math.PI * (1 - Math.min(1, Math.max(0, f)));
  return [C.x + C.r * Math.cos(a), C.y - C.r * Math.sin(a)] as const;
};
const arc = (f1: number, f2: number) => {
  const [x1, y1] = at(f1);
  const [x2, y2] = at(f2);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${C.r} ${C.r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

/* Panchang: the day drawn as the sun's path, its good and bad windows lit
   on it, then the four limbs of the day as manuscript leaves, the moon,
   and the windows again as a list with times. */
export function Panchang() {
  const [index, setIndex] = useState(1);
  const day = days[index];
  const span = day.sunset - day.sunrise;
  const frac = (min: number) => (min - day.sunrise) / span;
  const isToday = day.id === "today";
  const [sx, sy] = at(frac(NOW));

  return (
    <main className="page">
      <ScreenHeader title="Panchang" eyebrow="Mumbai · Daily almanac" back="/" />

      <div className={`${s.stepper} rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <button type="button" className="icon-btn surface" aria-label="Previous day" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <Icon name="chevron" size={20} className={s.flip} />
        </button>
        <p className={s.date} aria-live="polite">
          <span className={s.dateLabel}>{day.label}</span>
          {day.date}
        </p>
        <button type="button" className="icon-btn surface" aria-label="Next day" disabled={index === days.length - 1} onClick={() => setIndex(index + 1)}>
          <Icon name="chevron" size={20} />
        </button>
      </div>

      {/* The sky */}
      <section className={`${s.sky} rise`} style={{ "--stagger": 2 } as CSSProperties} aria-label="The day's sky">
        <svg viewBox="0 0 320 184" className={s.arc} aria-hidden>
          <path d={arc(0, 1)} className={s.track} />
          {day.windows.map((w) => (
            <path key={w.name} d={arc(frac(w.from), frac(w.to))} className={w.good ? s.good : s.bad} />
          ))}
          {isToday && <path d={arc(0, frac(NOW))} className={s.passed} />}
          <line x1="12" y1={C.y} x2="308" y2={C.y} className={s.horizon} />
          {isToday && (
            <g className={s.sun} style={{ "--x": `${sx}px`, "--y": `${sy}px` } as CSSProperties}>
              <circle r="18" className={s.sunGlow} />
              <circle r="9" className={s.sunDisc} />
            </g>
          )}
        </svg>
        <div className={s.skyCentre}>
          <p className="eyebrow">{day.vara.ruler}&rsquo;s day</p>
          <p className={s.vara}>{day.vara.name}</p>
          {isToday && <p className={s.now}>Now {clock(NOW)}</p>}
        </div>
        <div className={s.horizonLabels}>
          <span>
            <Icon name="sun" size={16} /> {clock(day.sunrise)}
            <small>Sunrise</small>
          </span>
          <span>
            {clock(day.sunset)} <Icon name="moon" size={16} />
            <small>Sunset</small>
          </span>
        </div>
      </section>

      {/* The limbs of the day */}
      <section className={s.section} aria-labelledby="panchang-angas">
        <SectionHeading id="panchang-angas">Panch anga</SectionHeading>
        <ul className={s.leaves}>
          {day.angas.map((a, i) => (
            <li key={`${day.id}-${a.label}`} className={`${s.leaf} rise`} style={{ "--stagger": i } as CSSProperties}>
              <span className={s.leafLabel}>{a.label}</span>
              <span className={s.leafValue}>{a.value}</span>
              <span className={s.leafNote}>{a.note}</span>
              <span className={s.leafEnds}>{a.ends}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Moon */}
      <section className={`${s.moon} surface`} aria-label="Moon">
        <span className={s.moonDisc} style={{ "--lit": day.moonLit, "--wane": day.paksha === "Krishna" ? -1 : 1 } as CSSProperties} aria-hidden />
        <div>
          <p className="eyebrow">{day.paksha} paksha</p>
          <p className={s.moonTitle}>{day.paksha === "Shukla" ? "Waxing moon" : "Waning moon"}</p>
          <p className={s.moonNote}>
            {Math.round(day.moonLit * 100)}% lit · rises {day.moonrise}
          </p>
        </div>
      </section>

      {/* Windows */}
      <section className={s.section} aria-labelledby="panchang-windows">
        <SectionHeading id="panchang-windows">Muhurat and kaal</SectionHeading>
        <ul className={s.windows}>
          {[...day.windows]
            .sort((a, b) => a.from - b.from)
            .map((w) => (
              <li key={`${day.id}-${w.name}`} className={`${s.window} surface`} data-good={w.good || undefined}>
                <span className={s.windowMark} aria-hidden />
                <span className={s.windowText}>
                  <span className={s.windowName}>{w.name}</span>
                  <span className={s.windowNote}>{w.note}</span>
                </span>
                <span className={s.windowTime}>
                  {clock(w.from)}
                  <br />
                  {clock(w.to)}
                </span>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
