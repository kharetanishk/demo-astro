"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { BANDS, NOW_INDEX, STREAK, WEEK, golden, hours, nth } from "./day";
import s from "./DinChakra.module.css";

/* The mountain: one column per hour, the ridge through each hour's score */
const COL = 52;
const H = 200;
const W = COL * hours.length;
const y = (score: number) => H - 24 - (score / 100) * (H - 48);
const points = hours.map((h, i) => [i * COL + COL / 2, y(h.score)] as const);
const ridge = points.reduce((d, [x, py], i) => {
  if (i === 0) return `M0 ${py.toFixed(1)}L${x} ${py.toFixed(1)}`;
  const [px, pp] = points[i - 1];
  const mx = (px + x) / 2;
  return `${d}C${mx} ${pp.toFixed(1)} ${mx} ${py.toFixed(1)} ${x} ${py.toFixed(1)}`;
}, "") + `L${W} ${points[points.length - 1][1].toFixed(1)}`;

/* Din Chakra: the day as a mountain range you scroll along, sunrise to
   sunrise, night shaded and Rahu Kaal hatched. Tap an hour and its card
   below says what it's good for, and exactly why it scored what it did. */
export function DinChakra() {
  const [selected, setSelected] = useState(NOW_INDEX);
  const scroller = useRef<HTMLDivElement>(null);
  const h = hours[selected];

  // Open on the hour we're in
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = NOW_INDEX * COL - el.clientWidth / 2 + COL / 2;
  }, []);

  return (
    <main className={`page ${s.chakra}`}>
      <ScreenHeader title="Din Chakra" eyebrow="दिन चक्र · hour by hour" back="/" />

      <ol className={`${s.week} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-label={`${STREAK}-day streak`}>
        {WEEK.map((d) => (
          <li key={d.date} className={s.weekDay} data-done={d.done || undefined} aria-current={d.today ? "date" : undefined}>
            <span>{d.day}</span>
            <strong>{d.date}</strong>
          </li>
        ))}
        <li className={s.streak}>
          <strong>{STREAK}</strong>
          <span>day streak</span>
        </li>
      </ol>

      <button type="button" className={`${s.golden} pressable rise`} style={{ "--stagger": 2 } as CSSProperties} onClick={() => setSelected(golden.index)}>
        <span className={s.goldenSun} aria-hidden />
        <span className={s.goldenText}>
          <span className="eyebrow">Golden hour today</span>
          <span className={s.goldenTime}>{golden.label}</span>
          <span className={s.goldenNote}>
            {golden.hora.lord} hora · {golden.choghadiya} · best for {golden.bestFor.join(", ").toLowerCase()}
          </span>
        </span>
        <span className={s.goldenScore}>{golden.score}</span>
      </button>

      {/* The mountain of your day */}
      <section className={`${s.mountain} rise`} style={{ "--stagger": 3 } as CSSProperties} aria-labelledby="dc-mountain">
        <div className={s.mountainHead}>
          <h2 id="dc-mountain" className="eyebrow">
            The mountain of your day
          </h2>
          <span className={s.drag} aria-hidden>
            drag →
          </span>
        </div>
        <div ref={scroller} className={s.scroller}>
          <div className={s.range} style={{ width: W }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={s.terrain} aria-hidden>
              <defs>
                <linearGradient id="dc-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--antique-gold)" stopOpacity="0.85" />
                  <stop offset="1" stopColor="var(--antique-gold)" stopOpacity="0.05" />
                </linearGradient>
                <pattern id="dc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--terracotta)" strokeWidth="1.5" strokeOpacity="0.45" />
                </pattern>
              </defs>
              <rect x={12 * COL} y="0" width={12 * COL} height={H} className={s.night} />
              {hours
                .filter((hr) => hr.rahu)
                .map((hr) => (
                  <rect key={hr.index} x={hr.index * COL} y="0" width={COL} height={H} fill="url(#dc-hatch)" />
                ))}
              <path d={`${ridge}L${W} ${H}L0 ${H}Z`} fill="url(#dc-fill)" />
              <path d={ridge} className={s.ridge} />
              {points.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={i === selected ? 7 : 4} className={s.peak} data-band={hours[i].band} data-now={i === NOW_INDEX || undefined} />
              ))}
            </svg>
            <div className={s.columns} role="radiogroup" aria-label="Hour">
              {hours.map((hr) => (
                <button
                  key={hr.index}
                  type="button"
                  role="radio"
                  aria-checked={hr.index === selected}
                  aria-label={`${hr.label}, ${BANDS[hr.band]}, ${hr.score}`}
                  className={s.column}
                  onClick={() => setSelected(hr.index)}
                >
                  <span className={s.colLabel}>{hr.index === NOW_INDEX ? "Now" : hr.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <ul className={s.legend} aria-label="Bands">
          {(Object.keys(BANDS) as (keyof typeof BANDS)[]).map((b) => (
            <li key={b} data-band={b}>
              {BANDS[b]}
            </li>
          ))}
          <li data-rahu>Rahu Kaal</li>
        </ul>
      </section>

      {/* The chosen hour */}
      <section key={selected} className={`${s.hour} surface`} aria-live="polite" aria-labelledby="dc-hour">
        <div className={s.hourHead}>
          <div>
            <p className={s.hourBand} data-band={h.band}>
              {BANDS[h.band]}
              {h.rahu && " · Rahu Kaal"}
            </p>
            <h2 id="dc-hour" className={s.hourTime}>
              {h.label}
            </h2>
          </div>
          <span className={s.dial} style={{ "--score": h.score } as CSSProperties}>
            <strong>{h.score}</strong>
          </span>
        </div>

        <dl className={s.facts}>
          <div>
            <dt>Hora lord</dt>
            <dd>
              {h.hora.glyph} {h.hora.lord}
            </dd>
          </div>
          <div>
            <dt>Choghadiya</dt>
            <dd data-good={h.chogGood || undefined}>{h.choghadiya}</dd>
          </div>
          <div>
            <dt>Rising</dt>
            <dd>
              {h.rising}, your {nth(h.house)}
            </dd>
          </div>
          <div>
            <dt>Dasha</dt>
            <dd>Rahu–Saturn</dd>
          </div>
        </dl>

        {(h.bestFor.length > 0 || h.goEasyOn.length > 0) && (
          <div className={s.uses}>
            {h.bestFor.map((b) => (
              <span key={b} className={s.use}>
                <Icon name="check" size={14} /> {b}
              </span>
            ))}
            {h.goEasyOn.map((b) => (
              <span key={b} className={s.use} data-avoid>
                <Icon name="close" size={14} /> {b}
              </span>
            ))}
          </div>
        )}

        <h3 className={`eyebrow ${s.whyTitle}`}>Why this score</h3>
        <ul className={s.factors}>
          {h.factors.map((f) => (
            <li key={f.label} className={s.factor} data-neg={f.delta < 0 || undefined} style={{ "--d": f.delta } as CSSProperties}>
              <span className={s.factorLabel}>{f.label}</span>
              <span className={s.factorBar} aria-hidden>
                <span />
              </span>
              <span className={s.factorDelta}>{f.delta > 0 ? `+${f.delta}` : f.delta}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="dc-proof">
        <SectionHeading id="dc-proof">Every score, proven</SectionHeading>
        <p className={s.proof}>
          Each score is Vedic arithmetic: planetary positions, hora, choghadiya, your dasha and transits, from the Swiss Ephemeris. No guessing. Open any hour to see each factor and the points it added.
        </p>
        <button type="button" className={`btn btn-secondary ${s.share}`} onClick={() => notify("Sharing isn't part of this demo yet.")}>
          <Icon name="share" size={18} />
          Share day card
        </button>
      </section>
    </main>
  );
}
