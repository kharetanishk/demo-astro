"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/ornaments";
import { planetArt } from "@/components/kundli/chart";
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

/* Each kaal's traditional lord: Rahu Kaal is Rahu's, Gulika is Saturn's son,
   Yamaganda is Jupiter's; Abhijit is the sun at its height */
const WINDOW_LORD: Record<string, string> = { "Rahu Kaal": "Rahu", Gulika: "Saturn", Yamaganda: "Jupiter", Abhijit: "Sun" };

/* Each limb's picture: the tithi's moon in its phase, the nakshatra's ruler,
   the sun and moon whose distance makes the yoga, the karana's half moon */
function AngaArt({ label, note, lit }: { label: string; note: string; lit: number }) {
  const ruler = note.match(/Ruler · (\w+)/)?.[1];
  if (label === "Yoga")
    return (
      <span className={s.leafArt} aria-hidden>
        <Image src={planetArt("Sun")} alt="" width={36} height={36} className={s.pairSun} />
        <Image src={planetArt("Moon")} alt="" width={26} height={26} className={s.pairMoon} />
      </span>
    );
  return (
    <span className={s.leafArt} data-phase={label === "Karana" ? "half" : label === "Tithi" ? "" : undefined} style={{ "--lit": lit } as CSSProperties} aria-hidden>
      <Image src={planetArt(label === "Nakshatra" && ruler ? ruler : "Moon")} alt="" width={40} height={40} />
    </span>
  );
}

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
              <circle r="26" className={s.sunGlow} />
              <image href={planetArt("Sun")} x="-19" y="-19" width="38" height="38" />
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
              <AngaArt label={a.label} note={a.note} lit={day.moonLit} />
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
        <span className={s.moonDisc} style={{ "--lit": day.moonLit, "--wane": day.paksha === "Krishna" ? -1 : 1 } as CSSProperties} aria-hidden>
          <Image src={planetArt("Moon")} alt="" width={72} height={72} />
        </span>
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
                <Image src={planetArt(WINDOW_LORD[w.name] ?? "Sun")} alt="" width={40} height={40} className={s.windowArt} />
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
