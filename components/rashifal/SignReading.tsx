"use client";

import { useState } from "react";
import Image from "next/image";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import { SheetLink } from "@/components/ui/sheet";
import { MY_RASHI, emblem, emblemLarge, sign, type Sign } from "./signs";
import s from "./Rashifal.module.css";

const SPANS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
] as const;

/* A sign's reading: its emblem large over its own constellation, the facts,
   then the reading for the span you choose. */
export function SignReading({ sign: x }: { sign: Sign }) {
  const [span, setSpan] = useState<(typeof SPANS)[number]["id"]>("today");
  const stars = x.stars.map(([a, b]) => `${a},${b}`).join(" ");

  return (
    <main className={`page ${s.reading}`}>
      <Immersive />
      <ScreenHeader title={x.name} eyebrow={x.id === MY_RASHI ? "Your rashi" : "Rashifal"} back="/rashifal" sheet />

      <section className={s.hero}>
        <span className={s.heroDisc} aria-hidden />
        <svg className={s.chart} viewBox="-100 -100 200 200" aria-hidden>
          <circle r="96" />
          <circle r="72" strokeDasharray="1 5" />
          <circle r="44" />
          <path d="M-96 0H96M0 -96V96M-68 -68L68 68M68 -68L-68 68" />
          <g transform="translate(-100 -100) scale(2)">
            <polyline points={stars} />
            {x.stars.map(([a, b], i) => (
              <circle key={i} cx={a} cy={b} r="1.300" className={s.chartStar} />
            ))}
          </g>
        </svg>
        <Image src={emblemLarge(x.id)} alt="" width={188} height={188} priority className={s.heroArt} />
        <h2 className={s.heroName}>{x.name}</h2>
        <p className={s.heroMeta}>
          {x.western} · {x.dates}
        </p>
        <dl className={s.facts}>
          <div>
            <dt>Lord</dt>
            <dd>{x.lord}</dd>
          </div>
          <div>
            <dt>Element</dt>
            <dd>{x.element}</dd>
          </div>
        </dl>
      </section>

      <div className={s.spans}>
        <Segmented label="Reading for" options={[...SPANS]} value={span} onChange={setSpan} />
      </div>

      <article key={span} className={s.text}>
        <p className="eyebrow">{SPANS.find((o) => o.id === span)!.label}</p>
        <p className={s.textBody}>{x[span]}</p>
        <p className={s.sample}>A sample reading: live rashifal isn&rsquo;t connected in this demo.</p>
      </article>

      <section className={s.friendsBlock} aria-labelledby="sign-friends">
        <h3 id="sign-friends" className="eyebrow">
          In harmony with
        </h3>
        <ul className={s.friends}>
          {x.friends.map((id) => {
            const f = sign(id)!;
            return (
              <li key={id}>
                <SheetLink href={`/rashifal/${id}`} className={`${s.friend} surface pressable`}>
                  <Image src={emblem(id)} alt="" width={44} height={44} />
                  <span>
                    <strong>{f.name}</strong>
                    <small>{f.western}</small>
                  </span>
                </SheetLink>
              </li>
            );
          })}
        </ul>
      </section>

      <SheetLink href="/ai-astrology/general" className={`btn btn-primary ${s.ask}`}>
        Ask AI about {x.name}
        <Icon name="arrow" size={18} />
      </SheetLink>
    </main>
  );
}
