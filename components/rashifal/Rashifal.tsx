import type { CSSProperties } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { SheetLink } from "@/components/ui/sheet";
import { MY_RASHI, emblem, sign, signs } from "./signs";
import { ZodiacWheel } from "./ZodiacWheel";
import s from "./Rashifal.module.css";

/* Rashifal: your own sign up top, on a wheel running off the card's edge, then
   all twelve as enamel tiles. Any tile rises as its own reading. */
export function Rashifal() {
  const mine = sign(MY_RASHI)!;
  return (
    <main className="page">
      <ScreenHeader title="Rashifal" eyebrow="What the stars say" back="/" />

      <SheetLink href={`/rashifal/${mine.id}`} className={`${s.mine} pressable rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <span className={s.mineText}>
          <span className={`eyebrow ${s.mineEyebrow}`}>Your rashi today</span>
          <span className={s.mineName}>{mine.name}</span>
          <span className={s.mineLine}>{mine.today}</span>
          <span className={s.mineMore}>
            Read more <Icon name="arrow" size={16} />
          </span>
        </span>
        <ZodiacWheel center={mine.id} className={s.mineWheel} />
      </SheetLink>

      <section className={s.section} aria-labelledby="rashifal-all">
        <SectionHeading id="rashifal-all">All twelve rashis</SectionHeading>
        <ul className={s.grid}>
          {signs.map((x, i) => (
            <li key={x.id} className="rise" style={{ "--stagger": Math.min(i + 2, 8) } as CSSProperties}>
              <SheetLink href={`/rashifal/${x.id}`} className={`${s.tile} pressable`} data-mine={x.id === MY_RASHI || undefined}>
                {x.id === MY_RASHI && <span className={s.tileMine}>You</span>}
                <Image src={emblem(x.id)} alt="" width={68} height={68} loading="eager" className={s.tileArt} />
                <span className={s.tileName}>{x.name}</span>
                <span className={s.tileWestern}>{x.western}</span>
              </SheetLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
