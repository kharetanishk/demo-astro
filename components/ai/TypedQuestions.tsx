"use client";

import { useEffect, useState } from "react";
import { PROMPTS } from "./topics";
import s from "./AiAstrology.module.css";

const TYPE = 48; // ms a letter, give or take, so it reads as a hand
const ERASE = 20;
const HOLD = 1900; // a finished question stays this long
const GAP = 320; // the empty field, before the next one

/* The prompt's placeholder, writing itself: each question is typed out, held,
   erased, and the next begins. It stops while the screen is hidden (the effect
   cleans up), and with reduced motion the first question just sits there. */
export function TypedQuestions() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(PROMPTS[0]);
      return;
    }
    let question = 0;
    let letters = 0;
    let erasing = false;
    let timer: number;

    const step = () => {
      const full = PROMPTS[question];
      letters += erasing ? -1 : 1;
      setText(full.slice(0, letters));
      let wait = erasing ? ERASE : TYPE * (0.6 + Math.random() * 0.8);
      if (!erasing && letters === full.length) {
        erasing = true;
        wait = HOLD;
      } else if (erasing && letters === 0) {
        erasing = false;
        question = (question + 1) % PROMPTS.length;
        wait = GAP;
      }
      timer = window.setTimeout(step, wait);
    };
    timer = window.setTimeout(step, GAP);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={s.typed} aria-hidden>
      {text}
      <span className={s.caret} />
    </span>
  );
}
