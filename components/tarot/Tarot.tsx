"use client";

import { useState, type CSSProperties } from "react";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import s from "./Tarot.module.css";

// Major arcana, upright meanings
const DECK = [
  { name: "The Fool", num: "0", glyph: "✧", meaning: "A fresh start. Step forward with trust, even before the path is clear." },
  { name: "The Magician", num: "I", glyph: "∞", meaning: "You hold every tool you need. Focus your will and begin." },
  { name: "The High Priestess", num: "II", glyph: "☽", meaning: "Listen inward. The answer is already known to you, quietly." },
  { name: "The Empress", num: "III", glyph: "♀", meaning: "Abundance and care. What you nurture now grows richly." },
  { name: "The Emperor", num: "IV", glyph: "♈", meaning: "Structure and steadiness. Lead with clear boundaries." },
  { name: "The Lovers", num: "VI", glyph: "♡", meaning: "A choice of the heart. Align with what you truly value." },
  { name: "The Chariot", num: "VII", glyph: "✦", meaning: "Determined motion. Hold the reins and you will arrive." },
  { name: "Strength", num: "VIII", glyph: "♌", meaning: "Gentle courage. Patience tames what force cannot." },
  { name: "The Hermit", num: "IX", glyph: "✶", meaning: "Withdraw to see clearly. Solitude brings its lamp." },
  { name: "Wheel of Fortune", num: "X", glyph: "☸", meaning: "The wheel turns in your favour. Meet change with openness." },
  { name: "The Star", num: "XVII", glyph: "★", meaning: "Hope renewed. Healing is underway; keep faith." },
  { name: "The Sun", num: "XIX", glyph: "☉", meaning: "Joy, success and clarity. Let yourself be seen." },
];
const SLOTS = ["Past", "Present", "Future"];

/* Tarot: the deck fanned like a hand of cards. Pick three; each flies to
   its place (past, present, future) and turns over, and its meaning is
   read beneath in order. */
export function Tarot() {
  const [picked, setPicked] = useState<number[]>([]);
  const [question, setQuestion] = useState("");
  const full = picked.length === SLOTS.length;

  function pick(i: number) {
    if (full || picked.includes(i)) return;
    setPicked([...picked, i]);
  }

  return (
    <main className={`page ${s.tarot}`}>
      <ScreenHeader title="Tarot" eyebrow="Three-card spread" back="/" />

      <label className={`${s.ask} surface rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <span className="sr-only">Your question</span>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Hold a question in mind, or write it here" />
      </label>

      {/* The spread */}
      <ol className={`${s.spread} rise`} style={{ "--stagger": 2 } as CSSProperties} aria-label="Your spread">
        {SLOTS.map((slot, i) => {
          const card = picked[i] !== undefined ? DECK[picked[i]] : null;
          return (
            <li key={slot} className={s.slot}>
              <div className={s.card} data-flipped={card ? "" : undefined}>
                <span className={s.back} aria-hidden />
                <span className={s.face}>
                  {card && (
                    <>
                      <span className={s.faceNum}>{card.num}</span>
                      <span className={s.faceGlyph} aria-hidden>
                        {card.glyph}
                      </span>
                      <span className={s.faceName}>{card.name}</span>
                    </>
                  )}
                </span>
              </div>
              <span className={s.slotLabel}>{slot}</span>
            </li>
          );
        })}
      </ol>

      {!full ? (
        <section className={s.deckArea} aria-label="The deck">
          <p className={s.prompt}>
            {picked.length === 0 ? "Breathe, then pick three cards" : `Pick ${SLOTS.length - picked.length} more`}
          </p>
          <ul className={s.fan}>
            {DECK.map((c, i) => (
              <li key={c.name} style={{ "--i": i - (DECK.length - 1) / 2 } as CSSProperties}>
                <button type="button" className={s.fanCard} disabled={picked.includes(i)} onClick={() => pick(i)} aria-label={`Card ${i + 1}`} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className={s.reading} aria-labelledby="tarot-reading">
          <h2 id="tarot-reading" className="eyebrow">
            {question ? `On “${question}”` : "Your reading"}
          </h2>
          <ol className={s.readings}>
            {picked.map((p, i) => (
              <li key={p} className={`${s.readingItem} surface`} style={{ "--stagger": i } as CSSProperties}>
                <span className={s.readingSlot}>{SLOTS[i]}</span>
                <h3 className={s.readingName}>{DECK[p].name}</h3>
                <p>{DECK[p].meaning}</p>
              </li>
            ))}
          </ol>
          <button type="button" className={`btn btn-secondary ${s.again}`} onClick={() => setPicked([])}>
            Shuffle and draw again
          </button>
        </section>
      )}
    </main>
  );
}
