"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { notify } from "@/components/ui/demo";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { playSound } from "@/components/ui/sound";
import { BEADS, bead as findBead, beadSrc } from "./beads";
import { LIVE, MALA, mantra as findMantra, mantras, today } from "./mantras";
import s from "./JaapSession.module.css";

type Chant = { id: string; name: string; deity: string; glyph: string; dev: string; tr: string };
type SheetId = "mantra" | "bead" | "target";

const TARGETS = [11, 21, 27, 54, 108, 1008];

/* The strand hangs as a loop (a circle centred high above the stage); the
   bead under your thumb is at its lowest point. Slot n is n beads along to
   the right of it; each chant moves every bead one slot left, rolling as
   it goes. */
const LOOP = { cx: 180, cy: 20, r: 290 };
const STEP = 0.145; // radians between beads
const SHOWN = 7; // slots drawn each side of the thumb
const place = (slot: number) => {
  const a = slot * STEP;
  return [LOOP.cx + LOOP.r * Math.sin(a), LOOP.cy + LOOP.r * Math.cos(a)].map((v) => +v.toFixed(2));
};

/* The dial round the count, like a watch face: a tick for each bead of the
   mala, lit as you pass it, and an outer arc that fills toward your target */
const TICKS = Array.from({ length: MALA }, (_, i) => {
  const a = (i / MALA) * Math.PI * 2 - Math.PI / 2;
  const long = i % 9 === 0;
  const [r0, r1] = [long ? 76 : 79, 86];
  return `M${(100 + r0 * Math.cos(a)).toFixed(2)} ${(100 + r0 * Math.sin(a)).toFixed(2)}L${(100 + r1 * Math.cos(a)).toFixed(2)} ${(100 + r1 * Math.sin(a)).toFixed(2)}`;
});
const ARC = 2 * Math.PI * 94; // the outer arc's length

// A burst of marigold and rose petals: each one's drift, spin and delay
const BURST = Array.from({ length: 16 }, (_, i) => ({ "--dx": `${Math.round(Math.cos(i * 2.3) * 150)}px`, "--dy": `${Math.round(120 + ((i * 37) % 160))}px`, "--r": `${(i * 67) % 360}deg`, "--d": `${(i % 5) * 60}ms` }) as CSSProperties);

/* A jaap session: the mala hangs across the screen and every tap or swipe
   moves one bead past your thumb, with a tick and a buzz. The meru bead
   arrives each 108 with the temple bell and a fall of petals. The mantra,
   the mala and the count you're aiming for each open a sheet. */
export function JaapSession({ id }: { id: string }) {
  const [chant, setChant] = useState<Chant>(findMantra(id)!);
  const [own, setOwn] = useState<Chant[]>([]);
  const [beadId, setBeadId] = useState("rudraksha");
  const [target, setTarget] = useState(MALA);
  const [count, setCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const [sheet, setSheet] = useState<SheetId | null>(null);

  const material = findBead(beadId);
  const src = beadSrc(material);
  const done = count >= target;
  const round = Math.min(Math.ceil(target / MALA), Math.floor(count / MALA) + 1);
  const meruNow = count > 0 && count % MALA === 0;

  function chantOnce() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    const ring = next % MALA === 0 || next === target;
    if (!muted) playSound(ring ? "bell" : "bead");
    navigator.vibrate?.(ring ? [30, 60, 30] : 8);
  }

  function choose(c: Chant) {
    setChant(c);
    setCount(0);
    setSheet(null);
  }

  const slots = Array.from({ length: SHOWN * 2 + 1 }, (_, i) => count - SHOWN + i);

  return (
    <main className={`page ${s.session}`}>
      <Immersive />


      <header className={`${s.top} screen-bar`}>
        <BackLink fallback="/maala-jaap" className="icon-btn surface" label="End session">
          <Icon name="close" size={20} />
        </BackLink>
        <button type="button" className={s.chant} onClick={() => setSheet("mantra")}>
          <span className={s.chantDev} lang="sa">
            {chant.dev.split("\n")[0]}
          </span>
          <span className={s.chantEdit}>
            {chant.name} <Icon name="pencil" size={12} />
          </span>
        </button>
        <button type="button" className={`icon-btn surface ${s.sound}`} aria-pressed={!muted} aria-label="Sound" onClick={() => setMuted(!muted)}>
          <Icon name="bell" size={20} />
        </button>
      </header>

      <div className={s.chips}>
        <button type="button" className={s.chip} onClick={() => setSheet("target")}>
          <span className={s.chipLabel}>Target</span>
          {target.toLocaleString("en-IN")}
        </button>
        <button type="button" className={s.chip} onClick={() => setSheet("bead")}>
          <span className={s.chipLabel}>Mala</span>
          <span className={s.chipBead}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a drawn SVG, nothing to optimise */}
            <img src={src} alt="" width={18} height={18} />
            {material.name}
          </span>
        </button>
        <span className={s.chip}>
          <span className={s.chipLabel}>Today</span>
          {(today.done + count).toLocaleString("en-IN")}
        </span>
      </div>

      <button type="button" className={s.stage} onClick={chantOnce} disabled={done} aria-label={`Chant once. ${count} of ${target}`}>
        <span className={s.face}>
        <svg className={s.dial} viewBox="0 0 200 200" aria-hidden>
          {TICKS.map((d, i) => (
            <path key={i} d={d} className={s.tick} data-lit={i < (meruNow ? MALA : count % MALA) || undefined} data-long={i % 9 === 0 || undefined} />
          ))}
          <circle cx="100" cy="100" r="94" className={s.track} />
          <circle cx="100" cy="100" r="94" className={s.progress} style={{ strokeDasharray: ARC, strokeDashoffset: ARC * (1 - Math.min(1, count / target)) }} />
        </svg>
        <span className={s.counter} aria-live="polite">
          <span key={count} className={s.count}>
            {count.toLocaleString("en-IN")}
          </span>
          <span className={s.of}>
            of {target.toLocaleString("en-IN")}
            {target > MALA && <small>{`Mala ${round} of ${Math.ceil(target / MALA)}`}</small>}
          </span>
        </span>
        </span>

        <svg className={s.strand} viewBox="0 0 360 360" aria-hidden>
          <defs>
            <radialGradient id="jaap-thumb">
              <stop offset="0" stopColor="#ffe6a8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r} className={s.thread} />
          <circle cx={LOOP.cx} cy={LOOP.cy + LOOP.r} r="46" fill="url(#jaap-thumb)" className={s.thumbGlow} />
          {count > 0 && <circle key={count} cx={LOOP.cx} cy={LOOP.cy + LOOP.r} r="26" className={s.ripple} />}
          {slots.map((k) => {
            const slot = k - count;
            const [x, y] = place(slot);
            const meru = k > 0 && k % MALA === 0;
            const size = meru ? 28 : 20;
            return (
              <g key={k} className={s.bead} style={{ transform: `translate(${x}px, ${y}px)` }}>
                {meru && (
                  <g className={s.tassel}>
                    <path d="M-5 24 L-12 66 Q0 72 12 66 L5 24Z" />
                    <rect x="-7" y="20" width="14" height="7" rx="2" />
                  </g>
                )}
                <g className={s.roll} style={{ transform: `rotate(${slot * 26}deg) scale(${slot === 0 ? 1.18 : 1})` }}>
                  <image href={src} x={-size} y={-size} width={size * 2} height={size * 2} />
                  {meru && <circle r={size + 2} className={s.meruRing} />}
                </g>
              </g>
            );
          })}
        </svg>

        {(meruNow || done) && (
          <span key={`burst-${count}`} className={s.burst} aria-hidden>
            {BURST.map((style, i) => (
              <i key={i} style={style} />
            ))}
          </span>
        )}
      </button>

      <p className={s.hint}>{meruNow ? `Mala ${count / MALA} complete. The meru bead: turn and go on` : count === 0 ? "Tap or swipe the mala for each chant" : chant.tr.split(" · ")[0]}</p>

      <p className={s.live}>
        <span className={s.liveDot} aria-hidden />
        {LIVE.toLocaleString("en-IN")} devotees chanting with you
        <span className={s.sample}>sample</span>
      </p>

      {sheet === "mantra" && (
        <MantraSheet current={chant.id} own={own} onAdd={(c) => setOwn([...own, c])} onChoose={choose} onClose={() => setSheet(null)} />
      )}
      {sheet === "bead" && (
        <Sheet title="Choose your mala" onClose={() => setSheet(null)}>
          <p className={s.group}>Free beads</p>
          <ul className={s.options}>
            {BEADS.filter((b) => !b.special).map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  className={s.option}
                  aria-pressed={b.id === beadId}
                  onClick={() => {
                    setBeadId(b.id);
                    setSheet(null);
                  }}
                >
                  <BeadSwatch id={b.id} />
                  <span className={s.optionText}>
                    {b.name}
                    <small>{b.note}</small>
                  </span>
                  {b.id === beadId && <Icon name="check" size={18} className={s.tick} />}
                </button>
              </li>
            ))}
          </ul>
          <p className={s.group}>
            Special malas <small>Yours for good, on every device</small>
          </p>
          <ul className={s.options}>
            {BEADS.filter((b) => b.special).map((b) => (
              <li key={b.id}>
                {/* The notice shows over the screen, so the sheet goes first */}
                <button
                  type="button"
                  className={s.option}
                  onClick={() => {
                    setSheet(null);
                    notify(`${b.name} can't be bought in this demo.`);
                  }}
                >
                  <BeadSwatch id={b.id} />
                  <span className={s.optionText}>
                    {b.name}
                    <small>{b.note}</small>
                  </span>
                  <Icon name="lock" size={16} className={s.lock} />
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      )}
      {sheet === "target" && (
        <TargetSheet
          target={target}
          onConfirm={(t) => {
            setTarget(t);
            setSheet(null);
          }}
          onClose={() => setSheet(null)}
        />
      )}

      {done && (
        <div className={s.done} role="dialog" aria-labelledby="jaap-done">
          <div className={`${s.doneCard} surface`}>
            <span className={s.doneMark} aria-hidden>
              {chant.glyph}
            </span>
            <h2 id="jaap-done">Jaap complete</h2>
            <p>
              {target.toLocaleString("en-IN")} chants of {chant.name}
              {target >= MALA && `, ${Math.floor(target / MALA)} ${target >= MALA * 2 ? "malas" : "mala"}`}.
            </p>
            <p className={s.doneToday}>Today: {(today.done + count).toLocaleString("en-IN")} japa</p>
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

function BeadSwatch({ id }: { id: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- a drawn SVG, nothing to optimise
  return <img src={beadSrc(findBead(id))} alt="" width={40} height={40} className={s.swatch} />;
}

function MantraSheet({ current, own, onAdd, onChoose, onClose }: { current: string; own: Chant[]; onAdd: (c: Chant) => void; onChoose: (c: Chant) => void; onClose: () => void }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const all: Chant[] = [...mantras, ...own];

  if (adding) {
    return (
      <Sheet title="Add your mantra" onClose={onClose}>
        <label className={s.field}>
          <span className="sr-only">Your mantra</span>
          <textarea autoFocus rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your mantra or your guru's naam" />
        </label>
        <button
          type="button"
          className={`btn btn-primary ${s.wide}`}
          disabled={!text.trim()}
          onClick={() => {
            const c = { id: `own-${own.length}`, name: text.trim().split(/\s+/).slice(0, 3).join(" "), deity: "Your mantra", glyph: "ॐ", dev: text.trim(), tr: text.trim() };
            onAdd(c);
            onChoose(c);
          }}
        >
          Add and chant
        </button>
        <p className={s.note}>Kept only until you leave this screen, in this demo.</p>
      </Sheet>
    );
  }

  return (
    <Sheet
      title="Choose mantra"
      onClose={onClose}
      action={
        <button type="button" className={s.addNew} onClick={() => setAdding(true)}>
          <Icon name="plus" size={16} /> Add new
        </button>
      }
    >
      <ul className={s.options}>
        {all.map((m) => (
          <li key={m.id}>
            <button type="button" className={s.option} aria-pressed={m.id === current} onClick={() => onChoose(m)}>
              <span className={s.optionGlyph} aria-hidden>
                {m.glyph}
              </span>
              <span className={s.optionText}>
                <span lang="sa">{m.dev.split("\n")[0]}</span>
                <small>
                  {m.name} · {m.deity}
                </small>
              </span>
              {m.id === current && <Icon name="check" size={18} className={s.tick} />}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function TargetSheet({ target, onConfirm, onClose }: { target: number; onConfirm: (t: number) => void; onClose: () => void }) {
  const [value, setValue] = useState(String(target));
  const n = Math.floor(Number(value));
  const ok = n >= 1 && n <= 100_000;
  return (
    <Sheet title="Set your target" onClose={onClose}>
      <div className={s.targets} role="radiogroup" aria-label="Common targets">
        {TARGETS.map((t) => (
          <button key={t} type="button" role="radio" aria-checked={n === t} className={s.targetOption} onClick={() => setValue(String(t))}>
            {t.toLocaleString("en-IN")}
            <small>{t === 108 ? "one mala" : t === 1008 ? "a sahasra" : t === 27 ? "quarter mala" : t === 54 ? "half mala" : "japa"}</small>
          </button>
        ))}
      </div>
      <label className={s.field}>
        <span className={s.fieldLabel}>Or your own count</span>
        <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))} />
      </label>
      <button type="button" className={`btn btn-primary ${s.wide}`} disabled={!ok} onClick={() => onConfirm(n)}>
        Set {ok ? n.toLocaleString("en-IN") : ""} chants
      </button>
    </Sheet>
  );
}

const CLOSE_MS = 240; // the sheet's closing animation

/* A bottom sheet: a modal <dialog>, so focus stays inside and Esc closes it */
function Sheet({ title, action, onClose, children }: { title: string; action?: ReactNode; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  function leave() {
    setClosing(true);
    setTimeout(onClose, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : CLOSE_MS);
  }

  return (
    <dialog
      ref={dialog}
      className={s.sheet}
      data-closing={closing || undefined}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        leave();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) leave();
      }}
    >
      <span className={s.grip} aria-hidden />
      <header className={s.sheetHead}>
        <h2>{title}</h2>
        {action ?? (
          <button type="button" className="icon-btn surface" aria-label="Close" onClick={leave}>
            <Icon name="close" size={18} />
          </button>
        )}
      </header>
      <div className={s.sheetBody}>{children}</div>
    </dialog>
  );
}
