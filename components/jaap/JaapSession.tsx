"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { playSound } from "@/components/ui/sound";
import { MALA, mantra } from "./mantras";
import s from "./JaapSession.module.css";

const TARGETS = [1, 3, 11];

/* The mala: 108 beads on a circle, the meru bead at the bottom */
const BEADS = Array.from({ length: MALA }, (_, i) => {
  const a = Math.PI / 2 + ((i + 0.5) / MALA) * Math.PI * 2;
  // rounded, so server and browser trig agree on hydration
  return [+(150 + 128 * Math.cos(a)).toFixed(2), +(150 + 128 * Math.sin(a)).toFixed(2)] as const;
});

/* A jaap session: the whole mala is one big button. Each tap moves a bead
   (a tick and a buzz), each full round rings the bell, and reaching the
   count you chose ends the session with what you did. */
export function JaapSession({ id }: { id: string }) {
  const m = mantra(id)!;
  const [malas, setMalas] = useState(1);
  const [count, setCount] = useState(0);
  const target = malas * MALA;
  const bead = count % MALA;
  const round = Math.min(malas, Math.floor(count / MALA) + 1);
  const done = count >= target;

  function tap() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    if (next % MALA === 0) {
      playSound("bell");
      navigator.vibrate?.([30, 60, 30]);
    } else {
      playSound("bead");
      navigator.vibrate?.(8);
    }
  }

  return (
    <main className={`page ${s.session}`}>
      <Immersive />
      <header className={`${s.top} screen-bar`}>
        <BackLink fallback="/maala-jaap" className="icon-btn surface" label="End session">
          <Icon name="close" size={20} />
        </BackLink>
        <div className={s.title}>
          <p className="eyebrow">{m.deity}</p>
          <h1>{m.name}</h1>
        </div>
        <span className={s.slot} aria-hidden />
      </header>

      <div className={s.targets} role="radiogroup" aria-label="Malas to chant">
        {TARGETS.map((t) => (
          <button key={t} type="button" role="radio" aria-checked={malas === t} disabled={count > 0} className={s.target} onClick={() => setMalas(t)}>
            {t} {t === 1 ? "mala" : "malas"}
            <small>{t * MALA}</small>
          </button>
        ))}
      </div>

      <button type="button" className={s.mala} onClick={tap} aria-label={`Count a bead. ${count} of ${target}`} disabled={done}>
        <svg viewBox="0 0 300 300" aria-hidden>
          <circle cx="150" cy="150" r="128" className={s.thread} />
          {BEADS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === bead && !done ? 7 : 4.6} className={s.bead} data-lit={i < bead || (done && count > 0) || undefined} data-current={(i === bead && !done) || undefined} />
          ))}
          <circle cx="150" cy="286" r="9" className={s.meru} />
        </svg>
        <span className={s.centre}>
          <span key={count} className={s.count}>
            {bead === 0 && count > 0 ? MALA : bead}
          </span>
          <span className={s.of}>of {MALA}</span>
          {malas > 1 && (
            <span className={s.round}>
              Mala {round} of {malas}
            </span>
          )}
        </span>
      </button>

      <p className={s.hint}>{count === 0 ? "Tap the mala for each chant" : `${count} of ${target} japa`}</p>

      <section className={s.words}>
        <p className={s.dev} lang="sa">
          {m.dev}
        </p>
        <p className={s.tr}>{m.tr}</p>
      </section>

      {done && (
        <div className={s.done} role="dialog" aria-labelledby="jaap-done">
          <div className={`${s.doneCard} surface`}>
            <span className={s.doneMark} aria-hidden>
              {m.glyph}
            </span>
            <h2 id="jaap-done">Jaap complete</h2>
            <p>
              {target} chants of {m.name}, {malas} {malas === 1 ? "mala" : "malas"}.
            </p>
            <div className={s.doneActions}>
              <button type="button" className="btn btn-secondary" onClick={() => setCount(0)}>
                Again
              </button>
              <Link href="/maala-jaap" className="btn btn-primary">
                Done
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
