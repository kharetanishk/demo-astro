import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { DemoButton } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { MALA, mantra, mantras, today } from "./mantras";
import s from "./MaalaJaap.module.css";

/* Maala Jaap: today's sankalp as a ring of three malas around the mala
   itself, the mantra you were on, then every mantra as a card led by its
   Devanagari. */
export function MaalaJaap() {
  const last = mantra(today.last)!;
  const malas = Math.floor(today.done / MALA);

  return (
    <main className="page">
      <ScreenHeader title="Maala Jaap" eyebrow="Sit. Breathe. Count." back="/" />

      <section className={`${s.sankalp} rise`} style={{ "--stagger": 1, "--p": today.done / today.sankalp } as CSSProperties} aria-labelledby="jaap-sankalp">
        <div className={s.ring}>
          <Image src="/mala.webp" alt="" width={150} height={150} className={s.malaArt} priority />
        </div>
        <div className={s.sankalpText}>
          <h2 id="jaap-sankalp" className="eyebrow">
            Today&rsquo;s sankalp
          </h2>
          <p className={s.count}>
            {today.done}
            <span> / {today.sankalp}</span>
          </p>
          <p className={s.malas}>
            {malas} of {today.sankalp / MALA} malas
          </p>
          <p className={s.streak}>
            <Icon name="star" size={14} /> {today.streak}-day streak
          </p>
        </div>
      </section>

      <Link href={`/maala-jaap/${last.id}`} className={`${s.resume} pressable rise`} style={{ "--stagger": 2 } as CSSProperties}>
        <span className={s.resumeGlyph} aria-hidden>
          {last.glyph}
        </span>
        <span className={s.resumeText}>
          <span className="eyebrow">Continue</span>
          <span className={s.resumeDev} lang="sa">
            {last.dev}
          </span>
          <span className={s.resumeNote}>You&rsquo;ve chanted this {last.chanted.toLocaleString("en-IN")} times</span>
        </span>
        <span className={s.play} aria-hidden>
          <Icon name="arrow" size={18} />
        </span>
      </Link>

      <section className={s.section} aria-labelledby="jaap-mantras">
        <SectionHeading id="jaap-mantras">Popular mantras</SectionHeading>
        <ul className={s.mantras}>
          {mantras.map((m, i) => (
            <li key={m.id} className="rise" style={{ "--stagger": i + 3 } as CSSProperties}>
              <Link href={`/maala-jaap/${m.id}`} className={`${s.mantra} surface pressable`}>
                <span className={s.mantraHead}>
                  <span className={s.mantraGlyph} aria-hidden>
                    {m.glyph}
                  </span>
                  <span className={s.mantraName}>
                    {m.name}
                    <small>{m.deity}</small>
                  </span>
                  <span className={s.mantraCount}>{m.chanted.toLocaleString("en-IN")}</span>
                </span>
                <span className={s.mantraDev} lang="sa">
                  {m.dev.split("\n")[0]}
                </span>
                <span className={s.mantraMeaning}>{m.meaning}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="jaap-own">
        <SectionHeading id="jaap-own">Your jaap</SectionHeading>
        <div className={s.own}>
          <DemoButton className={`${s.add} surface`} notice="Adding your own naam isn't part of this demo yet.">
            <Icon name="plus" size={20} />
            <span>Naam Jaap</span>
            <small>Chant a name of your own</small>
          </DemoButton>
          <DemoButton className={`${s.add} surface`} notice="Adding your own mantra isn't part of this demo yet.">
            <Icon name="plus" size={20} />
            <span>Mantra Jaap</span>
            <small>Add your guru&rsquo;s mantra</small>
          </DemoButton>
        </div>
      </section>
    </main>
  );
}
