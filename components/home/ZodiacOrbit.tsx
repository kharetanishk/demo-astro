"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import s from "./Sarvadrishti.module.css";

/* The 12 rashi medallions in /public/zodiac, in zodiac order */
const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

const TURN_MS = 60_000;

/* Where medallion i is at time t, on the unit ellipse: clockwise, so it
   crosses the back (top, y < 0) left to right and the front right to left.
   d is its nearness, 0 at the back to 1 at the front. */
function place(i: number, t: number) {
  const a = 2 * Math.PI * (t / TURN_MS + i / 12);
  const y = -Math.cos(a);
  return { x: Math.sin(a), y, d: (y + 1) / 2 };
}

const style = (i: number, t: number) => {
  const p = place(i, t);
  return { "--x": p.x.toFixed(4), "--y": p.y.toFixed(4), "--d": p.d.toFixed(4), zIndex: p.y > 0 ? 3 : 1 };
};

/* One clock moves all 12, so each sits exactly on the track every frame;
   CSS turns the unit position into the stage's own size (see .rashi).
   Reduced motion: they stay where they start, evenly round the orbit. */
export function ZodiacOrbit() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const st = style(i, now - start);
        el.style.setProperty("--x", st["--x"]);
        el.style.setProperty("--y", st["--y"]);
        el.style.setProperty("--d", st["--d"]);
        el.style.zIndex = String(st.zIndex);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return RASHIS.map((rashi, i) => (
    <span
      key={rashi}
      ref={(el) => {
        refs.current[i] = el;
      }}
      className={s.rashi}
      style={style(i, 0) as CSSProperties}
    >
      <Image src={`/zodiac/medallion-${String(i + 1).padStart(2, "0")}.webp`} alt="" width={36} height={36} loading="eager" />
    </span>
  ));
}
