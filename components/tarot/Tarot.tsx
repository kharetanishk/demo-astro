"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Symbol } from "./symbols";
import s from "./Tarot.module.css";

// Major arcana, upright meanings
const DECK = [
  { id: "fool", name: "The Fool", num: "0", meaning: "A fresh start. Step forward with trust, even before the path is clear." },
  { id: "magician", name: "The Magician", num: "I", meaning: "You hold every tool you need. Focus your will and begin." },
  { id: "priestess", name: "The High Priestess", num: "II", meaning: "Listen inward. The answer is already known to you, quietly." },
  { id: "empress", name: "The Empress", num: "III", meaning: "Abundance and care. What you nurture now grows richly." },
  { id: "emperor", name: "The Emperor", num: "IV", meaning: "Structure and steadiness. Lead with clear boundaries." },
  { id: "lovers", name: "The Lovers", num: "VI", meaning: "A choice of the heart. Align with what you truly value." },
  { id: "chariot", name: "The Chariot", num: "VII", meaning: "Determined motion. Hold the reins and you will arrive." },
  { id: "strength", name: "Strength", num: "VIII", meaning: "Gentle courage. Patience tames what force cannot." },
  { id: "hermit", name: "The Hermit", num: "IX", meaning: "Withdraw to see clearly. Solitude brings its lamp." },
  { id: "wheel", name: "Wheel of Fortune", num: "X", meaning: "The wheel turns in your favour. Meet change with openness." },
  { id: "star", name: "The Star", num: "XVII", meaning: "Hope renewed. Healing is underway; keep faith." },
  { id: "sun", name: "The Sun", num: "XIX", meaning: "Joy, success and clarity. Let yourself be seen." },
];
const SLOTS = ["Past", "Present", "Future"];
const N = DECK.length;

const FLIP_STAGGER = 380;

type Phase = "intro" | "shuffling" | "dealing" | "settling" | "choose" | "ready" | "revealed";
type Pose = { x: number; y: number; r: number; s: number; o: number; d?: number };

/* The rig, in the artwork's own 1155 × 1362 pixels: where each piece sits, and
   the elbow or shoulder it turns on. Every motion below is computed from these
   joints, so a card in her fingers moves exactly as her hand does. */
const ART = { w: 1155, h: 1362 };
const RIG = {
  armUpper: { x: 233, y: 632, w: 368, h: 332, pivot: [215, 895] },
  armLower: { x: 553, y: 934, w: 352, h: 133, pivot: [960, 1010] },
  wingLeft: { x: 5, y: 77, w: 316, h: 657, pivot: [312, 470] },
  wingRight: { x: 841, y: 17, w: 314, h: 676, pivot: [846, 470] },
} as const;
const GRIP = { x: 628, y: 772, r: -20 }; // the card in her fingers
const FAN = { x: 665, y: 1005, radius: 110, from: -55, to: 66 }; // the fan in her other hand

/* Stage positions are in cqw of the stage, x from its centre: resolution-free,
   and only ever transforms and opacity, so the compositor runs the motion. */
const K = 108 / ART.w; // artwork px to cqw
const IN_HAND_SCALE = 0.45;
const ARC = { y: 110, radius: 74, step: 6.2 };
const SLOT_X = [-30, 0, 30];
const CARD_SCALE = { fan: 0.7, slot: 0.55 };

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const spin = ([x, y]: number[], [px, py]: readonly number[], deg: number) => {
  const a = (deg * Math.PI) / 180;
  const dx = x - px;
  const dy = y - py;
  return [px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a)];
};
const toStage = ([x, y]: number[]) => [-54 + x * K, 2 + y * K];

/* A card held in her upper hand, `n` cards deep in the packet */
function inGrip(upper: number, n = 0): Pose {
  const [x, y] = toStage(spin([GRIP.x - n * 3, GRIP.y + n * 2], RIG.armUpper.pivot, upper));
  return { x, y, r: GRIP.r + upper - n * 1.5, s: IN_HAND_SCALE, o: 1 };
}

/* A card fanned in her lower hand, at a place from 0 to N - 1 */
function inFan(place: number, lower: number): Pose {
  const a = lerp(FAN.from, FAN.to, place / (N - 1));
  const rad = (a * Math.PI) / 180;
  const p = [FAN.x + Math.sin(rad) * FAN.radius, FAN.y - Math.cos(rad) * FAN.radius];
  const [x, y] = toStage(spin(p, RIG.armLower.pivot, lower));
  return { x, y, r: a + lower, s: IN_HAND_SCALE, o: 1 };
}

const mix = (a: Pose, b: Pose, t: number): Pose => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), r: lerp(a.r, b.r, t), s: lerp(a.s, b.s, t), o: lerp(a.o, b.o, t) });

function onTable(i: number): Pose {
  const a = ((i - (N - 1) / 2) * ARC.step * Math.PI) / 180;
  return { x: Math.sin(a) * ARC.radius, y: ARC.y + (1 - Math.cos(a)) * ARC.radius, r: (a * 180) / Math.PI, s: CARD_SCALE.fan, o: 1 };
}

/* At rest: the last card in her fingers, the rest in the fan (her painted pose) */
const atRest = (i: number) => (i === N - 1 ? inGrip(0) : inFan(i * ((N - 1) / (N - 2)), 0));

/* The motion is written as curves over time, then sampled into keyframes the
   compositor plays. Both arms and all twelve cards read the same curves. */
type Curve = [number, number][];
const at = (curve: Curve, t: number) => {
  if (t <= curve[0][0]) return curve[0][1];
  for (let k = 1; k < curve.length; k++) {
    if (t <= curve[k][0]) return lerp(curve[k - 1][1], curve[k][1], smooth((t - curve[k - 1][0]) / (curve[k][0] - curve[k - 1][0])));
  }
  return curve[curve.length - 1][1];
};

/* The shuffle: an overhand shuffle, three times. Her upper hand comes down to
   the fan, lifts a packet away, and lets it fall back card by card; her lower
   hand rises to meet it. */
const PRE = 0.8; // she lays the held card into the fan
const CYCLE = 1.55;
const CYCLES = 3;
const SHUFFLE_S = PRE + CYCLE * CYCLES + 0.35;
const PACKET = 4;

const upperCurve: Curve = [[0, 0], [PRE * 0.8, 5], [PRE, 2]];
const lowerCurve: Curve = [[0, 0], [PRE * 0.8, 2], [PRE, 0]];
for (let c = 0; c < CYCLES; c++) {
  const t = PRE + c * CYCLE;
  upperCurve.push([t + 0.32, 5], [t + 0.72, -6], [t + 1.25, -2], [t + 1.55, c === CYCLES - 1 ? 0 : 2]);
  lowerCurve.push([t + 0.32, 2], [t + 0.75, -1.8], [t + 1.2, 1], [t + 1.55, 0]);
}

/* Each cycle's fan order: the lifted packet comes back at the far end */
function shuffleOrders(): number[][] {
  const orders = [Array.from({ length: N }, (_, i) => i)];
  for (let c = 0; c < CYCLES; c++) {
    const last = orders[c];
    const from = [7, 2, 5][c];
    const packet = last.slice(from, from + PACKET);
    const rest = last.filter((x) => !packet.includes(x));
    orders.push(c % 2 ? [...packet, ...rest] : [...rest, ...packet]);
  }
  return orders;
}

function shufflePose(i: number, t: number, orders: number[][]): Pose {
  const upper = at(upperCurve, t);
  const lower = at(lowerCurve, t);
  // Where it sits in the fan, sliding as the fan regroups
  let place = orders[0].indexOf(i);
  let grip = 0;
  let deep = 0;
  for (let c = 0; c < CYCLES; c++) {
    const start = PRE + c * CYCLE;
    place = lerp(place, orders[c + 1].indexOf(i), smooth((t - start - 0.85) / 0.6));
    const j = orders[c].indexOf(i) - [7, 2, 5][c];
    if (j >= 0 && j < PACKET) {
      const take = start + 0.34 + j * 0.04;
      const drop = start + 0.86 + (PACKET - 1 - j) * 0.11;
      if (t >= take && t < drop + 0.34) {
        grip = smooth((t - take) / 0.22) * (1 - smooth((t - drop) / 0.34));
        deep = j;
      }
    }
  }
  if (i === N - 1 && t < PRE) grip = 1 - smooth((t - PRE * 0.45) / (PRE * 0.45));
  const pose = mix(inFan(place, lower), inGrip(upper, deep), grip);
  return { ...pose, y: pose.y - Math.sin(grip * Math.PI) * 1.2 };
}

/* The deal: she takes each card from the fan and lays it down in front of you */
const DEAL_GAP = 0.2;
const DEAL_FLIGHT = 0.7;
const DEAL_S = DEAL_GAP * N + DEAL_FLIGHT;

function dealUpper(t: number) {
  if (t > DEAL_GAP * N) return lerp(-3, 0, smooth((t - DEAL_GAP * N) / DEAL_FLIGHT));
  return 2 + Math.sin((t / DEAL_GAP) * Math.PI * 2 - Math.PI / 2) * -4;
}

function dealPose(i: number, t: number, order: number[]): Pose {
  const upper = dealUpper(t);
  const lower = Math.sin((t / DEAL_S) * Math.PI) * -2;
  const turn = order.length - 1 - order.indexOf(i);
  const start = turn * DEAL_GAP;
  const held = inGrip(upper);
  const home = inFan(order.indexOf(i), lower);
  const table = onTable(i);
  if (t < start) return home;
  const taking = smooth((t - start) / (DEAL_GAP * 0.55));
  if (t < start + DEAL_GAP * 0.55) return mix(home, held, taking);
  const flight = smooth((t - start - DEAL_GAP * 0.55) / DEAL_FLIGHT);
  const pose = mix(held, table, flight);
  return { ...pose, y: pose.y - Math.sin(flight * Math.PI) * 5 };
}

const FPS = 40; // samples a second; the browser interpolates between them

const cardFrame = (p: Pose): Keyframe => ({
  transform: `translate(${p.x.toFixed(2)}cqw, ${p.y.toFixed(2)}cqw) rotate(${p.r.toFixed(2)}deg) translateY(0cqw) scale(${p.s.toFixed(3)})`,
  opacity: p.o,
});

function sample(seconds: number, frame: (t: number) => Keyframe): Keyframe[] {
  const count = Math.round(seconds * FPS);
  return Array.from({ length: count + 1 }, (_, k) => ({ ...frame((k / count) * seconds), offset: k / count }));
}

const armFrame = (deg: number): Keyframe => ({ transform: `rotate(${deg.toFixed(2)}deg)` });

function sparkFrames(i: number): Keyframe[] {
  const [cx, cy] = toStage([FAN.x, FAN.y - 110]);
  const a = (i / 18) * Math.PI * 2;
  const reach = 14 + ((i * 7) % 5) * 3;
  return [
    { offset: 0, transform: `translate(${cx}cqw, ${cy}cqw) scale(0.4)`, opacity: 0 },
    { offset: 0.25, transform: `translate(${cx + Math.cos(a) * reach * 0.5}cqw, ${cy + Math.sin(a) * reach * 0.3 - 2}cqw) scale(1.1)`, opacity: 1 },
    { offset: 1, transform: `translate(${cx + Math.cos(a) * reach}cqw, ${cy + Math.sin(a) * reach * 0.6 - 9}cqw) scale(0.3)`, opacity: 0 },
  ];
}

const pct = (n: number, of: number) => `${(n / of) * 100}%`;
const place = (b: { x: number; y: number; w: number; h: number; pivot: readonly number[] }): CSSProperties => ({
  left: pct(b.x, ART.w),
  top: pct(b.y, ART.h),
  width: pct(b.w, ART.w),
  transformOrigin: `${b.pivot[0] - b.x}px ${b.pivot[1] - b.y}px`,
});

/* Tarot: an angel in a palace holds the deck in her own hands. Her arms are
   separate layers on their elbows, so she truly shuffles: an overhand shuffle
   with the real cards, then she deals them out one by one and the table rises
   beneath them. You choose three, and they turn over in turn. */
export function Tarot() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState("");
  const [order, setOrder] = useState(() => DECK.map((_, i) => i));
  const [picked, setPicked] = useState<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const reading = useRef<HTMLElement>(null);
  const finalOrder = useRef<number[]>([]);

  // Each phase plays its motion, then moves on; leaving cancels it
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
    const upper = el.querySelector<HTMLElement>("[data-arm=upper]");
    const lower = el.querySelector<HTMLElement>("[data-arm=lower]");
    if (!upper || !lower) return;

    function play(seconds: number, options: KeyframeAnimationOptions, cardAt: (i: number, t: number) => Pose, upperAt: (t: number) => number, lowerAt: (t: number) => number) {
      const timing = { duration: seconds * 1000, easing: "linear", ...options };
      return [
        upper!.animate(sample(seconds, (t) => armFrame(upperAt(t))), timing),
        lower!.animate(sample(seconds, (t) => armFrame(lowerAt(t))), timing),
        ...cards.map((c, i) => c.animate(sample(seconds, (t) => cardFrame(cardAt(i, t))), timing)),
      ];
    }

    if (phase === "intro" && !still) {
      // At rest she breathes, and the cards in her hands move with her
      const period = 6;
      const up = (t: number) => Math.sin((t / period) * Math.PI * 2) * 1.1;
      const low = (t: number) => Math.sin((t / period) * Math.PI * 2 + 1) * 0.8;
      const rest = (i: number, t: number) => (i === N - 1 ? inGrip(up(t)) : inFan(i * ((N - 1) / (N - 2)), low(t)));
      const anims = play(period, { iterations: Infinity }, rest, up, low);
      return () => anims.forEach((a) => a.cancel());
    }

    if (phase === "shuffling") {
      if (still) {
        setPhase("choose");
        return;
      }
      const orders = shuffleOrders();
      finalOrder.current = orders[CYCLES];
      const anims = play(SHUFFLE_S, { fill: "both" }, (i, t) => shufflePose(i, t, orders), (t) => at(upperCurve, t), (t) => at(lowerCurve, t));
      const sparks = [...el.querySelectorAll<HTMLElement>("[data-spark]")].map((c, i) => c.animate(sparkFrames(i), { duration: 1500, delay: PRE * 1000 + (i % 3) * CYCLE * 1000 + 800 + i * 18, fill: "both" }));
      let live = true;
      anims[0].finished
        .then(() => {
          if (!live) return;
          setPhase("dealing");
        })
        .catch(() => {});
      return () => {
        live = false;
        [...anims, ...sparks].forEach((a) => a.cancel());
      };
    }

    if (phase === "dealing") {
      const order = finalOrder.current;
      const anims = play(DEAL_S, { fill: "both" }, (i, t) => dealPose(i, t, order), dealUpper, (t) => Math.sin((t / DEAL_S) * Math.PI) * -2);
      let live = true;
      anims[0].finished
        .then(() => {
          if (!live) return;
          setPhase("settling");
        })
        .catch(() => {});
      return () => {
        live = false;
        anims.forEach((a) => a.cancel());
      };
    }

    if (phase === "settling") {
      const timer = setTimeout(() => setPhase("choose"), 1100);
      return () => clearTimeout(timer);
    }

    if (phase === "revealed") {
      const timer = setTimeout(() => reading.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }), still ? 0 : FLIP_STAGGER * 3 + 900);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  function shuffle() {
    setOrder(DECK.map((_, i) => i).sort(() => Math.random() - 0.5));
    setPicked([]);
    setPhase("shuffling");
  }

  function again() {
    scrollTo({ top: 0, behavior: "instant" });
    setPicked([]);
    setPhase("intro");
  }

  function pick(i: number) {
    if (phase !== "choose" || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === SLOTS.length) setTimeout(() => setPhase("ready"), 620);
  }

  function pose(i: number): Pose {
    const slot = picked.indexOf(i);
    const settled = phase === "ready" || phase === "revealed";
    if (slot >= 0) return settled ? { x: SLOT_X[slot] * 1.06, y: 84, r: 0, s: 1, o: 1 } : { x: SLOT_X[slot], y: 67, r: 0, s: CARD_SCALE.slot, o: 1 };
    if (phase === "intro") return atRest(i);
    if (phase === "shuffling") return atRest(i);
    if (settled) return { ...onTable(i), y: 165, o: 0, d: Math.abs(i - (N - 1) / 2) * 30 };
    return onTable(i);
  }

  const left = SLOTS.length - picked.length;
  const prompt =
    phase === "shuffling" || phase === "dealing"
      ? question || "Hold your question in mind"
      : phase === "ready"
        ? "Your cards are ready"
        : phase === "revealed"
          ? question || "Your reading"
          : left === SLOTS.length
            ? "Breathe, and choose three cards"
            : `Choose ${left} more`;

  return (
    <main className={`page ${s.tarot}`} data-phase={phase}>
      <div className={s.scene} aria-hidden>
        <Image src="/tarot/sanctum.webp" alt="" width={800} height={1000} unoptimized priority className={s.gate} />
      </div>

      <ScreenHeader title="Tarot" eyebrow="Three-card spread" back="/" />

      {phase === "intro" ? (
        <label className={s.ask}>
          <span className="sr-only">Your question</span>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Hold a question in mind, or write it here" />
          <Icon name="pencil" size={16} />
        </label>
      ) : (
        <p key={prompt} className={s.prompt} aria-live="polite">
          {prompt}
        </p>
      )}

      <div className={s.play}>
        <div ref={stage} className={s.stage} data-phase={phase}>
          <span className={s.aura} aria-hidden />

          {/* Her wings and body, behind the cards */}
          <div className={s.angel} aria-hidden>
            <Image src="/tarot/wing-left.webp" alt="" width={RIG.wingLeft.w} height={RIG.wingLeft.h} unoptimized priority className={`${s.piece} ${s.wingLeft}`} style={place(RIG.wingLeft)} />
            <Image src="/tarot/wing-right.webp" alt="" width={RIG.wingRight.w} height={RIG.wingRight.h} unoptimized priority className={`${s.piece} ${s.wingRight}`} style={place(RIG.wingRight)} />
            <Image src="/tarot/body.webp" alt="" width={ART.w} height={ART.h} unoptimized priority className={s.body} />
            {/* Her head on its neck, bowing a little while she shuffles; her eyes stay on you.
                When she blinks, the painted lowered lids show. */}
            <div className={s.head}>
              <Image src="/tarot/head.webp" alt="" width={454} height={575} unoptimized priority className={s.headArt} />
              <Image src="/tarot/eyes.webp" alt="" width={194} height={96} unoptimized priority className={s.eyes} />
            </div>
          </div>

          <div className={s.swirl} aria-hidden>
            <span />
          </div>

          {/* Her hands, in front of the cards they hold */}
          <div className={`${s.angel} ${s.hands}`} aria-hidden>
            <Image src="/tarot/arm-lower.webp" alt="" width={RIG.armLower.w} height={RIG.armLower.h} unoptimized priority data-arm="lower" className={s.piece} style={place(RIG.armLower)} />
            <Image src="/tarot/arm-upper.webp" alt="" width={RIG.armUpper.w} height={RIG.armUpper.h} unoptimized priority data-arm="upper" className={s.piece} style={place(RIG.armUpper)} />
          </div>

          <div className={s.table} aria-hidden>
            <svg viewBox="0 0 120 90" preserveAspectRatio="none">
              <ellipse cx="60" cy="58" rx="58" ry="38" />
              <ellipse cx="60" cy="58" rx="46" ry="29" />
              <ellipse cx="60" cy="58" rx="20" ry="12" />
              <path d="M60 20V96M2 58H118M19 31L101 85M101 31L19 85" />
            </svg>
          </div>

          <ol className={s.slots} aria-label="Your spread">
            {SLOTS.map((slot, i) => (
              <li key={slot} className={s.slot} style={{ "--x": SLOT_X[i] } as CSSProperties} data-filled={picked[i] !== undefined || undefined}>
                <span className={s.slotFrame} aria-hidden />
                <span className={s.slotLabel}>{slot}</span>
              </li>
            ))}
          </ol>

          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} data-spark className={s.spark} aria-hidden />
          ))}

          {DECK.map((_, i) => {
            const p = pose(i);
            const slot = picked.indexOf(i);
            const card = DECK[order[i]];
            const chosen = slot >= 0;
            return (
              <button
                key={i}
                type="button"
                data-card
                className={s.card}
                disabled={phase !== "choose" || chosen}
                data-chosen={chosen || undefined}
                onClick={() => pick(i)}
                aria-label={chosen ? `${SLOTS[slot]}: ${phase === "revealed" ? card.name : "face down"}` : `Choose card ${i + 1}`}
                style={{ "--x": p.x, "--y": p.y, "--r": p.r, "--s": p.s, "--o": p.o, "--d": `${phase === "ready" && !chosen ? p.d ?? 0 : 0}ms`, zIndex: chosen ? 50 + slot : phase === "intro" || phase === "shuffling" || phase === "dealing" ? 10 + i : 30 + i } as CSSProperties}
              >
                <span className={s.flip} data-flipped={(phase === "revealed" && chosen) || undefined} style={{ "--flip-delay": `${Math.max(0, slot) * FLIP_STAGGER}ms` } as CSSProperties}>
                  <Image src="/tarot/back.svg" alt="" width={240} height={400} unoptimized className={s.back} />
                  {chosen && (
                    <span className={s.face}>
                      <span className={s.faceNum}>{card.num}</span>
                      <Symbol name={card.id} className={s.faceSymbol} />
                      <span className={s.faceName}>{card.name}</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {phase === "intro" && (
            <button type="button" className={`btn btn-primary ${s.cta}`} onClick={shuffle}>
              Shuffle the cards
              <span className={s.ctaArrow} aria-hidden>
                <Icon name="arrow" size={18} />
              </span>
            </button>
          )}
          {phase === "shuffling" && (
            <p className={s.caption}>
              <strong>The cards are aligning</strong>
              Let the universe speak
            </p>
          )}
          {phase === "ready" && (
            <button type="button" className={`btn btn-primary ${s.cta}`} onClick={() => setPhase("revealed")}>
              Reveal my cards
              <span className={s.ctaArrow} aria-hidden>
                <Icon name="arrow" size={18} />
              </span>
            </button>
          )}
        </div>
      </div>

      {phase === "revealed" && (
        <section ref={reading} className={s.reading} aria-labelledby="tarot-reading">
          <h2 id="tarot-reading" className="eyebrow">
            {question ? `On “${question}”` : "Your reading"}
          </h2>
          <ol className={s.readings}>
            {picked.map((p, i) => {
              const card = DECK[order[p]];
              return (
                <li key={p} className={s.readingItem} style={{ "--stagger": i } as CSSProperties}>
                  <span className={s.readingMark}>
                    <Symbol name={card.id} />
                  </span>
                  <div>
                    <span className={s.readingSlot}>{SLOTS[i]}</span>
                    <h3 className={s.readingName}>{card.name}</h3>
                    <p className={s.readingText}>{card.meaning}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <button type="button" className={`btn btn-secondary ${s.again}`} onClick={again}>
            Shuffle and draw again
          </button>
        </section>
      )}
    </main>
  );
}
