import Link from "next/link";
import { ZodiacWheel } from "@/components/rashifal/ZodiacWheel";
import { MY_RASHI, sign } from "@/components/rashifal/signs";
import { Icon } from "@/components/ui/ornaments";
import s from "./RashiToday.module.css";

/* Home's daily reason to come back: your rashi's line for today, leading to
   Rashifal. The wheel runs off the card's edge. */
export function RashiToday() {
  const mine = sign(MY_RASHI)!;
  return (
    <Link href="/rashifal" className={`${s.card} pressable`}>
      <span className={s.text}>
        <span className={`eyebrow ${s.eyebrow}`}>Today&rsquo;s rashifal</span>
        <span className={s.name}>{mine.name}</span>
        <span className={s.line}>{mine.today}</span>
        <span className={s.more}>
          All twelve rashis <Icon name="arrow" size={16} />
        </span>
      </span>
      <ZodiacWheel center={mine.id} className={s.wheel} />
    </Link>
  );
}
