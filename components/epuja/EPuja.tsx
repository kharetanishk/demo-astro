"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import s from "./EPuja.module.css";

// Demo catalogue until pujaSettings and the WhatsApp bot are wired in
const PUJAS = [
  { id: "mangal", name: "Mangal Dosh Nivaran", temple: "Mangalnath Temple", city: "Ujjain", when: "Tue, 3 Nov", price: 1800, intent: "Marriage", forYou: "Your chart has Manglik dosha" },
  { id: "rudra", name: "Rudrabhishek", temple: "Kashi Vishwanath", city: "Varanasi", when: "Mon, 2 Nov", price: 1100, intent: "Health" },
  { id: "lakshmi", name: "Lakshmi Kubera Puja", temple: "Mahalakshmi Temple", city: "Kolhapur", when: "Fri, 30 Oct", price: 1501, intent: "Wealth" },
  { id: "navagraha", name: "Navagraha Shanti", temple: "Navagraha Mandir", city: "Ujjain", when: "Sat, 31 Oct", price: 2100, intent: "Graha shanti" },
  { id: "ganesh", name: "Sankashti Ganesh Puja", temple: "Siddhivinayak", city: "Mumbai", when: "Thu, 5 Nov", price: 751, intent: "Beginnings" },
];
const INTENTS = ["All", ...new Set(PUJAS.map((p) => p.intent))];
const STEPS = ["Choose a puja and a date", "Priests perform it in your name and gotra", "Watch it live; prasad comes home"];

const book = (name: string) => notify(`Booking ${name} goes through WhatsApp in the app; it isn't part of this demo.`);

/* E-Puja: the puja chosen for your chart up top, how it works as three
   lamps, then every puja as a temple doorway card. */
export function EPuja() {
  const [intent, setIntent] = useState("All");
  const [featured, ...rest] = PUJAS;
  // The featured puja joins the list once you filter
  const listed = intent === "All" ? rest : PUJAS.filter((p) => p.intent === intent);

  return (
    <main className="page">
      <ScreenHeader title="E-Puja" eyebrow="Rituals from anywhere" back="/" />

      <section className={`${s.featured} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-labelledby="puja-featured">
        <Image src="/diya.webp" alt="" width={120} height={148} className={s.diya} priority />
        <p className={s.forYou}>
          <Icon name="star" size={14} /> {featured.forYou}
        </p>
        <h2 id="puja-featured" className={s.featuredName}>
          {featured.name}
        </h2>
        <p className={s.featuredWhere}>
          {featured.temple}, {featured.city} · {featured.when}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => book(featured.name)}>
          Book for ₹{featured.price.toLocaleString("en-IN")}
        </button>
      </section>

      <ol className={`${s.steps} rise`} style={{ "--stagger": 2 } as CSSProperties} aria-label="How it works">
        {STEPS.map((step, i) => (
          <li key={step} className={s.step}>
            <span className={s.flame} aria-hidden>
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <section className={s.section} aria-labelledby="puja-all">
        <SectionHeading id="puja-all">Temple pujas</SectionHeading>
        <div className={s.intents} role="group" aria-label="Filter by intent">
          {INTENTS.map((k) => (
            <button key={k} type="button" aria-pressed={intent === k} className={s.intent} onClick={() => setIntent(k)}>
              {k}
            </button>
          ))}
        </div>
        <ul className={s.doors}>
          {listed.map((p) => (
            <li key={p.id} className={s.door}>
              <span className={s.arch} aria-hidden>
                <span className={s.archDate}>{p.when.split(", ")[1]}</span>
                <span className={s.archDay}>{p.when.split(", ")[0]}</span>
              </span>
              <div className={s.doorText}>
                <span className={s.intentTag}>{p.intent}</span>
                <h3 className={s.doorName}>{p.name}</h3>
                <p className={s.doorWhere}>
                  {p.temple}, {p.city}
                </p>
                <div className={s.doorFoot}>
                  <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                  <button type="button" className={s.doorBook} onClick={() => book(p.name)}>
                    Book <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
