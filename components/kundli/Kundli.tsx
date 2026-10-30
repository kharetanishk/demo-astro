"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { SheetLink } from "@/components/ui/sheet";
import { emblem, signs } from "@/components/rashifal/signs";
import { BHAVAS, RASHIS, chart, houseOfSign, planetArt, planetsIn, signOfHouse } from "./chart";
import { Orrery } from "./Orrery";
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
const ICON = 21; // a planet's step along a house's row, in the chart's units
const RASHI_IDS = signs.map((x) => x.id);

/* Kundli: your sky at birth as a live orrery, in the app's one deep crimson.
   Tap a planet and it's read beneath, and lit in the chart; tap a house and
   that's read too. Then the seals of identity, the dasha running now, the
   planets, and the yogas and doshas. */
export function Kundli() {
  const [focusName, setFocusName] = useState("Moon");
  const focus = chart.planets.find((p) => p.name === focusName)!;
  const [house, setHouse] = useState(houseOfSign(focus.sign));
  const [member, setMember] = useState("You");
  const sign = signOfHouse(house);
  const here = planetsIn(house);
  const top = useRef<HTMLDivElement>(null);
  let n = 0;
  const rise = () => ({ "--stagger": n++ }) as CSSProperties;

  /* A planet chosen anywhere is read here and lit in the chart */
  function choose(name: string, scroll = false) {
    const planet = chart.planets.find((p) => p.name === name)!;
    setFocusName(name);
    setHouse(houseOfSign(planet.sign));
    if (scroll) top.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  return (
    <main className="page">
      <ScreenHeader
        title="Kundli"
        back="/"
        eyebrow="Janma kundli · D1"
        action={
          <button type="button" className="icon-btn surface" aria-label="Share chart" onClick={() => notify("Sharing isn't part of this demo yet.")}>
            <Icon name="share" size={20} />
          </button>
        }
      />

      <div ref={top} className={`${s.family} rise`} style={rise()} role="group" aria-label="Whose chart">
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

      {/* The sky at birth: the one deep, dark place on the screen, so the planets glow */}
      <section className={`${s.sky} rise`} style={rise()} aria-labelledby="kundli-sky">
        <div className={s.skyHead}>
          <p className={`eyebrow ${s.skyEyebrow}`}>The sky when you were born</p>
          <h2 id="kundli-sky" className={s.skyTitle}>
            Simha rising, Tula moon
          </h2>
        </div>
        <Orrery selected={focus.name} onSelect={choose} />
      </section>

      {/* The chosen planet, straddling the sky's lower edge */}
      <article key={focus.name} className={s.focus} aria-live="polite">
        <Image src={planetArt(focus.name)} alt="" width={84} height={84} className={s.focusArt} />
        <div className={s.focusText}>
          <h3 className={s.focusName}>
            {focus.name}
            {focus.retro && <abbr title="Retrograde" className={s.retro}>Retrograde</abbr>}
          </h3>
          <p className={s.focusPlace}>
            {RASHIS[focus.sign - 1]} {focus.degree} · House {houseOfSign(focus.sign)} · {focus.nakshatra}
          </p>
          <p className={s.focusRules}>{focus.rules}</p>
        </div>
      </article>

      <ul className={`${s.rail} rise`} style={rise()} aria-label="Choose a planet">
        {chart.planets.map((p) => (
          <li key={p.name}>
            <button type="button" className={s.railItem} aria-pressed={p.name === focus.name} onClick={() => choose(p.name)}>
              <Image src={planetArt(p.name)} alt="" width={44} height={44} className={s.railArt} />
              {p.name}
            </button>
          </li>
        ))}
      </ul>

      {/* The chart */}
      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-chart">
        <SectionHeading id="kundli-chart">Your birth chart</SectionHeading>
        <div className={s.board}>
          <p className="sr-only">Rashi chart. Choose a house to read it.</p>
          <svg viewBox="-4 -4 308 308" className={s.chart}>
            <rect x="0" y="0" width="300" height="300" rx="6" className={s.frame} />
            {HOUSES.map((h, i) => {
              const num = i + 1;
              const planets = planetsIn(num);
              const row = planets.length * ICON - (ICON - 18);
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
                  {planets.map((p, k) => (
                    <g key={p.name} className={s.chartPlanet}>
                      <image href={planetArt(p.name)} x={h.label[0] - row / 2 + k * ICON} y={h.label[1] - 15} width="18" height="18" data-on={p.name === focus.name || undefined} />
                      <text x={h.label[0] - row / 2 + k * ICON + 9} y={h.label[1] + 10} className={s.planets}>
                        {p.abbr}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}
            <text x="150" y="28" className={s.asc}>
              Asc
            </text>
          </svg>

          {/* The chosen house, read */}
          <div key={house} className={s.reading} aria-live="polite">
            <Image src={emblem(RASHI_IDS[sign - 1])} alt="" width={64} height={64} className={s.readingArt} />
            <div className={s.readingText}>
              <p className={s.readingMeta}>
                House {house} · {RASHIS[sign - 1]}
              </p>
              <h3 className={s.readingTitle}>{BHAVAS[house].name}</h3>
              <p className={s.readingWhat}>{BHAVAS[house].what}</p>
              {here.length > 0 ? (
                <div className={s.readingPlanets}>
                  {here.map((p) => (
                    <button key={p.name} type="button" className={s.readingPlanet} aria-pressed={p.name === focus.name} onClick={() => choose(p.name)}>
                      <Image src={planetArt(p.name)} alt="" width={20} height={20} />
                      {p.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={s.readingEmpty}>No planets here</p>
              )}
            </div>
          </div>
          <SheetLink href="/ai-astrology/general" className={s.ask}>
            Ask AI about house {house}
            <span className={s.askArrow} aria-hidden>
              <Icon name="arrow" size={16} />
            </span>
          </SheetLink>
        </div>
      </section>

      {/* Identity: four seals */}
      <ul className={`${s.seals} rise`} style={rise()} aria-label="Identity">
        {chart.identity.map((id) => {
          const seal = (
            <>
              {"sign" in id && id.sign ? (
                <Image src={emblem(id.sign)} alt="" width={52} height={52} className={s.sealEmblem} />
              ) : (
                <span className={s.sealCoin} aria-hidden>
                  {id.glyph}
                </span>
              )}
              <span className={s.sealLabel}>{id.label}</span>
              <span className={s.sealValue}>{id.value}</span>
              <span className={s.sealNote}>{id.note}</span>
            </>
          );
          return (
            <li key={id.label} className={s.seal}>
              {"sign" in id && id.sign ? (
                <SheetLink href={`/rashifal/${id.sign}`} className={s.sealLink}>
                  {seal}
                </SheetLink>
              ) : (
                seal
              )}
            </li>
          );
        })}
      </ul>

      {/* Dasha: each period nested inside the one above it */}
      <section className={`${s.section} rise`} style={rise()} aria-labelledby="kundli-dasha">
        <SectionHeading id="kundli-dasha">Current period</SectionHeading>
        <ol className={`${s.dashas} surface`}>
          {chart.dasha.map((d, i) => (
            <li key={d.level} className={s.dasha} style={{ "--depth": i, "--done": d.done } as CSSProperties}>
              <div className={s.dashaHead}>
                <span className={s.dashaLevel}>{d.level}</span>
                <span className={s.dashaLord}>
                  <Image src={planetArt(d.lord)} alt="" width={i === 0 ? 34 : 22} height={i === 0 ? 34 : 22} />
                  {d.lord}
                </span>
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
                <button type="button" className={`${s.planet} pressable`} aria-pressed={p.name === focus.name} onClick={() => choose(p.name, true)}>
                  <Image src={planetArt(p.name)} alt="" width={64} height={64} className={s.planetArt} />
                  <span className={s.planetName}>
                    {p.name}
                    {p.retro && <abbr title="Retrograde" className={s.retroMark}>R</abbr>}
                  </span>
                  <span className={s.planetSign}>
                    {RASHIS[p.sign - 1]} {p.degree}
                  </span>
                  <span className={s.planetMeta}>
                    House {h} · {p.nakshatra}
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
