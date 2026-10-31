"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { DemoButton } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import { MALA, devotees, mantra, mantras, stats, today, week } from "./mantras";
import s from "./MaalaJaap.module.css";

/* The session's dial, here for the day: a tick per 1/108 of the sankalp,
   a long one where each mala begins */
const TICKS = Array.from({ length: MALA }, (_, i) => {
  const a = (i / MALA) * Math.PI * 2 - Math.PI / 2;
  const p = (r: number) =>
    `${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(80)}L${p(94)}`;
});

type View = "chant" | "stats" | "leaders";
const VIEWS: { id: View; label: string }[] = [
  { id: "chant", label: "Chant" },
  { id: "stats", label: "My stats" },
  { id: "leaders", label: "Leaderboard" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const short = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}K` : String(n);

/* Maala Jaap: today's sankalp on the session's dial with the mantra you
   were on as its action, every mantra in one list led by its Devanagari,
   then your sadhana in numbers and the devotees chanting most. */
export function MaalaJaap() {
  const last = mantra(today.last)!;
  const malas = Math.floor(today.done / MALA);
  const lit = Math.round((today.done / today.sankalp) * MALA);
  const [view, setView] = useState<View>("chant");

  return (
    <main className="page">
      <ScreenHeader
        title="Maala Jaap"
        eyebrow="Sit. Breathe. Count."
        back="/"
      />
      <div className={`${s.views} rise`}>
        <Segmented
          label="Show"
          options={VIEWS}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "chant" && (
        <>
          <section
            className={`${s.hero} rise`}
            style={{ "--stagger": 1 } as CSSProperties}
            aria-labelledby="jaap-sankalp"
          >
            <div className={s.heroTop}>
              <span className={s.face}>
                <svg viewBox="0 0 200 200" className={s.dial} aria-hidden>
                  {TICKS.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      data-lit={i < lit || undefined}
                      data-long={
                        i % (MALA / (today.sankalp / MALA)) === 0 || undefined
                      }
                    />
                  ))}
                </svg>
                <span className={s.faceCount}>
                  {today.done}
                  <small>of {today.sankalp}</small>
                </span>
              </span>
              <div className={s.heroText}>
                <h2 id="jaap-sankalp" className="eyebrow">
                  Today&rsquo;s sankalp
                </h2>
                <p className={s.heroMalas}>
                  {malas} of {today.sankalp / MALA} malas
                </p>
                <p className={s.heroLeft}>
                  {today.sankalp - today.done} japa to go
                </p>
                <p className={s.streak}>
                  <Icon name="sun" size={13} /> {today.streak}-day streak
                </p>
              </div>
            </div>
            <Link
              href={`/maala-jaap/${last.id}`}
              className={`${s.resume} pressable`}
            >
              <span className={s.glyph} aria-hidden>
                {last.glyph}
              </span>
              <span className={s.resumeText}>
                <span className={s.resumeLabel}>Continue</span>
                <span className={s.resumeDev} lang="sa">
                  {last.dev}
                </span>
              </span>
              <span className={s.play} aria-hidden>
                <Icon name="arrow" size={18} />
              </span>
            </Link>
          </section>

          <section className={s.section} aria-labelledby="jaap-mantras">
            <SectionHeading id="jaap-mantras">Popular mantras</SectionHeading>
            <ul
              className={`${s.mantras} surface rise`}
              style={{ "--stagger": 3 } as CSSProperties}
            >
              {mantras.map((m) => (
                <li key={m.id}>
                  <Link href={`/maala-jaap/${m.id}`} className={s.mantra}>
                    <span className={s.glyph} aria-hidden>
                      {m.glyph}
                    </span>
                    <span className={s.mantraText}>
                      <span className={s.mantraDev} lang="sa">
                        {m.dev.split("\n")[0]}
                      </span>
                      <span className={s.mantraName}>
                        {m.name} · {m.deity}
                      </span>
                    </span>
                    <span
                      className={s.mantraCount}
                      title="Times you've chanted it"
                    >
                      {short(m.chanted)}
                    </span>
                    <Icon name="chevron" size={16} className={s.chevron} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.section} aria-labelledby="jaap-own">
            <SectionHeading id="jaap-own">Your jaap</SectionHeading>
            <div className={s.own}>
              <DemoButton
                className={`${s.add} surface`}
                notice="Adding your own naam isn't part of this demo yet."
              >
                <Icon name="plus" size={20} />
                <span>Naam Jaap</span>
                <small>Chant a name of your own</small>
              </DemoButton>
              <DemoButton
                className={`${s.add} surface`}
                notice="Adding your own mantra isn't part of this demo yet."
              >
                <Icon name="plus" size={20} />
                <span>Mantra Jaap</span>
                <small>Add your guru&rsquo;s mantra</small>
              </DemoButton>
            </div>
          </section>
        </>
      )}

      {view === "stats" && (
        <section className={s.section} aria-labelledby="jaap-stats">
          <SectionHeading id="jaap-stats">Your sadhana</SectionHeading>
          <ol className={`${s.week} surface`} aria-label="This week">
            {week.map((d, i) => (
              <li key={DAYS[i]} data-day={d}>
                <span>{DAYS[i]}</span>
                <i aria-label={d}>
                  {d === "done" ? (
                    <Icon name="check" size={14} />
                  ) : d === "missed" ? (
                    <Icon name="close" size={12} />
                  ) : null}
                </i>
              </li>
            ))}
          </ol>
          <dl className={s.stats}>
            {(
              [
                ["Current streak", `${stats.streak} days`, "sun"],
                ["Best streak", `${stats.best} days`, "star"],
                ["Total jaap", stats.total.toLocaleString("en-IN"), "heart"],
                ["Malas", stats.malas.toLocaleString("en-IN"), "refresh"],
                ["Punya", stats.punya.toLocaleString("en-IN"), "star"],
                ["Your rank", `Top ${stats.rank}%`, "globe"],
              ] as const
            ).map(([label, value, icon]) => (
              <div key={label} className={`${s.stat} surface`}>
                <span className={s.statIcon} aria-hidden>
                  <Icon name={icon} size={16} />
                </span>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {view === "leaders" && (
        <section className={s.section} aria-labelledby="jaap-devotees">
          <SectionHeading id="jaap-devotees">Top devotees today</SectionHeading>
          <ol className={s.devotees}>
            {devotees.map((d, i) => (
              <li
                key={d.name}
                className={`${s.devotee} surface`}
                data-rank={i < 3 ? i + 1 : undefined}
              >
                <span className={s.rank}>{i + 1}</span>
                <span className={s.devoteeName}>{d.name}</span>
                <span className={s.devoteeStreak} title="Day streak">
                  <Icon name="sun" size={12} /> {d.streak}
                </span>
                <span className={s.devoteeJaap}>{short(d.jaap)}</span>
              </li>
            ))}
            <li className={`${s.devotee} ${s.you}`}>
              <span className={s.rank}>You</span>
              <span className={s.devoteeName}>
                Top {stats.rank}%<small>Chant 3 more malas to climb</small>
              </span>
              <span className={s.devoteeStreak}>
                <Icon name="sun" size={12} /> {stats.streak}
              </span>
              <span className={s.devoteeJaap}>{short(today.done)}</span>
            </li>
          </ol>
          <p className={s.sampleNote}>
            Sample community until sign-in is connected.
          </p>
        </section>
      )}
    </main>
  );
}
