import Image from "next/image";
import type { CSSProperties } from "react";
import { emblem, signs } from "./signs";
import s from "./Rashifal.module.css";

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);

/* The twelve signs on a slowly turning crimson and gold medallion (`bare`: lines
   alone, for a quiet backdrop); each counter-turns, so they stay upright. Only transforms animate, so it costs the main thread nothing. */
export function ZodiacWheel({ center, bare, className }: { center?: string; bare?: boolean; className?: string }) {
  return (
    <div className={`${s.wheel} ${className ?? ""}`} data-bare={bare || undefined} aria-hidden>
      <svg className={s.wheelLines} viewBox="-100 -100 200 200">
        <circle r="98" />
        <circle r="94" />
        <circle r="56" />
        <circle r="52" />
        {TICKS.map((a) => (
          <path key={a} d={a % 30 === 15 ? "M0 -94V-98" : "M0 -96V-98"} transform={`rotate(${a})`} />
        ))}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
          <path key={a} d="M0 -56V-94" transform={`rotate(${a + 15})`} />
        ))}
      </svg>
      <div className={s.wheelTurn}>
        {signs.map((sign, i) => (
          <span key={sign.id} className={s.wheelSlot} style={{ "--a": `${i * 30}deg` } as CSSProperties}>
            <Image src={emblem(sign.id)} alt="" width={44} height={44} loading="eager" className={s.wheelEmblem} />
          </span>
        ))}
      </div>
      {center && <Image src={emblem(center)} alt="" width={96} height={96} loading="eager" className={s.wheelCenter} />}
    </div>
  );
}
