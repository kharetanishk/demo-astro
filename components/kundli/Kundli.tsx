"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { BHAVAS, RASHIS, chart, houseOfSign, planetsIn, signOfHouse } from "./chart";
import s from "./Kundli.module.css";

/* North Indian chart on a 300 square: the houses are fixed, the signs turn
   with the lagna. House 1 is the top diamond; they run anticlockwise. */
const HOUSES: { points: string; label: [number, number]; sign: [number, number] }[] = [
  { points: "150,0 225,75 150,150 75,75", label: [150, 70], sign: [150, 132] },
  { points: "0,0 150,0 75,75", label: [75, 28], sign: [75, 62] },
  { points: "0,0 75,75 0,150", label: [26, 75], sign: [60, 75] },
  { points: "0,150 75,75 150,150 75,225", label: [75, 145], sign: [132, 150] },
  { points: "0,150 75,225 0,300", label: [26, 225], sign: [60, 225] },
  { points: "0,300 75,225 150,300", label: [75, 272], sign: [75, 238] },
  { points: "150,300 75,225 150,150 225,225", label: [150, 225], sign: [150, 168] },
  { points: "150,300 225,225 300,300", label: [225, 272], sign: [225, 238] },
  { points: "300,300 225,225 300,150", label: [274, 225], sign: [240, 225] },
  { points: "300,150 225,225 150,150 225,75", label: [225, 145], sign: [168, 150] },
  { points: "300,150 225,75 300,0", label: [274, 75], sign: [240, 75] },
  { points: "300,0 225,75 150,0", label: [225, 28], sign: [225, 62] },
];

const FAMILY = ["You", "Maa", "Papa"];

/* Kundli: the chart itself is the hero; tap a house and its reading opens
   beneath. Then the four seals of identity, the dasha running now as
   nested bars, the planets, and the yogas and doshas. */
export function Kundli() {
  const [house, setHouse] = useState(1);
  const [member, setMember] = useState("You");
  const sign = signOfHouse(house);
  const here = planetsIn(house);
  let n = 0;
  const rise = () => ({ "--stagger": n++ }) as CSSProperties;

  return (
    <main className="page">
      <ScreenHeader
        title="Kundli"
        eyebrow="Janma kundli · D1"
        action={
          <button type="button" className="icon-btn surface" aria-label="Share chart" onClick={() => notify("Sharing isn't part of this demo yet.")}>
            <Icon name="share" size={20} />
          </button>
        }
      />

      <div className={`${s.family} rise`} style={rise()} role="group" aria-label="Whose chart">
        {FAMILY.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={member === f}
            className={s.member}
            onClick={() => (f === "You" ? setMember(f) : notify(`${f}'s chart isn't part of this demo yet.`))}
          >
            <span className={s.memberInitial} aria-hidden>
              {f.charAt(0)}
            </span>
            {f}
          </button>
        ))}
        <button type="button" className={s.member} onClick={() => notify("Adding family isn't part of this demo yet.")}>
          <span className={s.memberInitial} aria-hidden>
            <Icon name="plus" size={14} />
          </span>
          Add
        </button>
      </div>

      {/* The chart, in gold leaf */}
      <section className={`${s.board} rise`} style={rise()} aria-labelledby="kundli-chart">
        <h2 id="kundli-chart" className="sr-only">
          Rashi chart. Choose a house to read it.
        </h2>
        <svg viewBox="-4 -4 308 308" className={s.chart}>
          <rect x="0" y="0" width="300" height="300" rx="6" className={s.frame} />
          {HOUSES.map((h, i) => {
            const num = i + 1;
            const planets = planetsIn(num);
            return (
              <g key={num} className={s.house} data-active={num === house || undefined}>
                <polygon
                  points={h.points}
                  role="button"
                  tabIndex={0}
                  aria-label={`House ${num}, ${RASHIS[signOfHouse(num) - 1]}${planets.length ? `, ${planets.map((p) => p.name).join(", ")}` : ""}`}
                  aria-pressed={num === house}
                  onClick={() => setHouse(num)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setHouse(num))}
                />
                <text x={h.sign[0]} y={h.sign[1]} className={s.signNum}>
                  {signOfHouse(num)}
                </text>
                <text x={h.label[0]} y={h.label[1] - (planets.length > 2 ? 7 : 0)} className={s.planets}>
                  {planets.slice(0, 2).map((p) => p.abbr).join(" ")}
                  {planets.length > 2 && (
                    <tspan x={h.label[0]} dy="13">
                      {planets.slice(2).map((p) => p.abbr).join(" ")}
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
          <text x="150" y="104" className={s.asc}>
            Asc
          </text>
        </svg>

        {/* The chosen house, read */}
        <div className={s.reading} aria-live="polite">
          <span className={s.houseNum} aria-hidden>
            {house}
          </span>
          <div className={s.readingText}>
            <p className={s.readingMeta}>
              House {house} · {RASHIS[sign - 1]}
            </p>
            <h3 className={s.readingTitle}>{BHAVAS[house].name}</h3>
            <p className={s.readingWhat}>{BHAVAS[house].what}</p>
            <p className={s.readingPlanets}>{here.length ? `Planets here: ${here.map((p) => p.name).join(", ")}` : "No planets here"}</p>
          </div>
        </div>
        <Link href="/ai-astrology/general" className={s.ask}>
          Ask AI about house {house}
          <Icon name="arrow" size={16} />
        </Link>
      </section>

      {/* Identity: four seals */}
      <ul className={`${s.seals} rise`} style={rise()} aria-label="Identity">
        {chart.identity.map((id) => (
          <li key={id.label} className={s.seal}>
            <span className={s.sealCoin} aria-hidden>
              {id.glyph}
            </span>
            <span className={s.sealLabel}>{id.label}</span>
            <span className={s.sealValue}>{id.value}</span>
            <span className={s.sealNote}>{id.note}</span>
          </li>
        ))}
      </ul>

      {/* Dasha: each period nested inside the one above it */}
      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-dasha">
        <SectionHeading id="kundli-dasha">Current period</SectionHeading>
        <ol className={`${s.dashas} surface`}>
          {chart.dasha.map((d, i) => (
            <li key={d.level} className={s.dasha} style={{ "--depth": i, "--done": d.done } as CSSProperties}>
              <div className={s.dashaHead}>
                <span className={s.dashaLevel}>{d.level}</span>
                <span className={s.dashaLord}>{d.lord}</span>
              </div>
              <span className={s.dashaBar} aria-hidden>
                <span />
              </span>
              <span className={s.dashaDates}>
                {d.from} – {d.to}
                <span className="sr-only">, {Math.round(d.done * 100)}% through</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Planets */}
      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-planets">
        <SectionHeading id="kundli-planets">Planets</SectionHeading>
        <ul className={s.planetGrid}>
          {chart.planets.map((p) => {
            const h = houseOfSign(p.sign);
            return (
              <li key={p.name}>
                <button type="button" className={`${s.planet} surface`} aria-pressed={h === house} onClick={() => setHouse(h)}>
                  <span className={s.planetGlyph} aria-hidden>
                    {p.glyph}
                  </span>
                  <span className={s.planetName}>
                    {p.name}
                    {p.retro && <abbr title="Retrograde" className={s.retro}>R</abbr>}
                  </span>
                  <span className={s.planetSign}>
                    {RASHIS[p.sign - 1]} {p.degree}
                  </span>
                  <span className={s.planetMeta}>
                    H{h} · {p.nakshatra}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Yogas and doshas */}
      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-yogas">
        <SectionHeading id="kundli-yogas">Yogas</SectionHeading>
        <ul className={s.yogas}>
          {chart.yogas.map((y) => (
            <li key={y.name} className={`${s.yoga} surface`}>
              <span className="diamond" aria-hidden />
              <div>
                <h3 className={s.yogaName}>{y.name}</h3>
                <p className={s.yogaNote}>{y.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-doshas">
        <SectionHeading id="kundli-doshas">Doshas</SectionHeading>
        <ul className={s.doshas}>
          {chart.doshas.map((d) => (
            <li key={d.name} className={`${s.dosha} surface`} data-present={d.present || undefined}>
              <span className={s.doshaState}>{d.present ? "Present" : "Absent"}</span>
              <h3 className={s.doshaName}>{d.name}</h3>
              <p className={s.doshaNote}>{d.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className={`${s.birth} rise`} style={rise()}>
        Born {chart.birth.date}, {chart.birth.time} · {chart.birth.place}
        <br />
        Ayanamsa {chart.ayanamsa}
      </p>
    </main>
  );
}
