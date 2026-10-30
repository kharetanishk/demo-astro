"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import s from "./EPuja.module.css";

type Bundle = {
  id: string;
  name: string;
  intent: string;
  art: string;
  note: string;
  temple: string;
  city: string;
  when: string;
  price: number;
  was?: number;
  booked: string;
  rating: number;
  pujas: string[];
  forYou?: string;
};

// Demo catalogue until pujaSettings and the WhatsApp bot are wired in. All invented.
const BUNDLES: Bundle[] = [
  { id: "mangal", name: "Mangal Dosh Nivaran", intent: "Marriage", art: "/topics/marriage.svg", note: "For harmony and timely marriage", temple: "Mangalnath Temple", city: "Ujjain", when: "Tue, 3 Nov", price: 1800, was: 2400, booked: "3.2k", rating: 4.9, pujas: ["Mangal Shanti Path", "Bhat Puja", "Kumbh Vivah Sankalp"], forYou: "Your chart has Manglik dosha" },
  { id: "navagraha", name: "Navagraha Shanti Bundle", intent: "Graha shanti", art: "/topics/general.svg", note: "Calm all nine planets at once", temple: "Navagraha Mandir", city: "Ujjain", when: "Sat, 7 Nov", price: 2100, was: 2900, booked: "5.8k", rating: 4.8, pujas: ["Navagraha Homa", "Shani Tailabhishek", "Rahu Ketu Shanti"] },
  { id: "rudra", name: "Rudrabhishek for Health", intent: "Health", art: "/topics/health.svg", note: "For recovery and long life", temple: "Kashi Vishwanath", city: "Varanasi", when: "Mon, 2 Nov", price: 1100, booked: "9.4k", rating: 4.9, pujas: ["Rudrabhishek", "Mahamrityunjaya Jaap"] },
  { id: "lakshmi", name: "Lakshmi Kubera Prosperity", intent: "Wealth", art: "/topics/finance.svg", note: "For steady income and savings", temple: "Mahalakshmi Temple", city: "Kolhapur", when: "Fri, 6 Nov", price: 1501, was: 1900, booked: "6.1k", rating: 4.8, pujas: ["Lakshmi Puja", "Kubera Yantra Sthapana", "Shri Sukta Path"] },
  { id: "ganesh", name: "New Beginnings Ganesh Puja", intent: "Beginnings", art: "/topics/spirituality.svg", note: "Before a venture, home or journey", temple: "Siddhivinayak", city: "Mumbai", when: "Thu, 5 Nov", price: 751, booked: "7.7k", rating: 4.9, pujas: ["Sankashti Ganesh Puja", "Atharvashirsha Path"] },
  { id: "santan", name: "Santan Gopal Bundle", intent: "Family", art: "/topics/family.svg", note: "For the blessing of children", temple: "Banke Bihari Temple", city: "Vrindavan", when: "Sun, 8 Nov", price: 2500, was: 3100, booked: "2.4k", rating: 4.7, pujas: ["Santan Gopal Jaap", "Putra Kameshti Homa", "Gau Seva"] },
  { id: "griha", name: "Griha Shanti and Vastu", intent: "Home", art: "/topics/property.svg", note: "For a new home, or peace in yours", temple: "Tirupati Balaji", city: "Tirupati", when: "Wed, 11 Nov", price: 1999, booked: "4.3k", rating: 4.8, pujas: ["Griha Shanti Path", "Vastu Dosh Nivaran", "Sudarshan Homa"] },
  { id: "love", name: "Gauri Shankar Harmony", intent: "Marriage", art: "/topics/love.svg", note: "For closeness between partners", temple: "Trimbakeshwar", city: "Nashik", when: "Mon, 9 Nov", price: 1350, booked: "1.9k", rating: 4.6, pujas: ["Gauri Shankar Puja", "Swayamvara Parvati Jaap"] },
  { id: "career", name: "Career and Success Bundle", intent: "Wealth", art: "/topics/career.svg", note: "For a promotion or a fresh start", temple: "Kalighat Temple", city: "Kolkata", when: "Sat, 14 Nov", price: 1650, was: 2100, booked: "3.6k", rating: 4.7, pujas: ["Surya Arghya Puja", "Baglamukhi Jaap", "Saraswati Vandana"] },
];
const INTENTS = ["All", ...new Set(BUNDLES.map((b) => b.intent))];
const INCLUDED = ["In your name and gotra", "Watch live, or later", "Prasad to your door"];
const STEPS = ["Choose a bundle and share your name and gotra", "Priests perform it on the date, in your name", "Watch it live; prasad reaches you in a week"];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const book = (name: string) => notify(`Booking ${name} goes through WhatsApp in the app; it isn't part of this demo.`);

/* E-Puja: a list of puja bundles, easy to scan. Yours is pinned first, a bar of
   intents stays as you scroll, and every card answers what it's for, where,
   when, how much; what's inside opens in place. */
export function EPuja() {
  const [intent, setIntent] = useState("All");
  const listed = BUNDLES.filter((b) => intent === "All" || b.intent === intent);

  return (
    <main className="page">
      <ScreenHeader title="E-Puja" eyebrow="Rituals from anywhere" back="/" />

      <section className={`${s.intro} rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <div className={s.introText}>
          <h2 className={s.introTitle}>Puja at India&rsquo;s sacred temples, in your name</h2>
          <ul className={s.promises}>
            {INCLUDED.map((x) => (
              <li key={x}>
                <Icon name="check" size={14} />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <Image src="/diya.webp" alt="" width={96} height={118} className={s.diya} priority />
      </section>

      <div className={s.bar}>
        <div className={s.intents} role="group" aria-label="Filter by what it's for">
          {INTENTS.map((k) => (
            <button key={k} type="button" aria-pressed={intent === k} className={s.intent} onClick={() => setIntent(k)}>
              {k}
            </button>
          ))}
        </div>
      </div>

      <p className={s.count} aria-live="polite">
        <strong>
          {listed.length} bundle{listed.length === 1 ? "" : "s"}
        </strong>{" "}
        {intent === "All" ? "· Soonest for your chart first" : `· ${intent}`}
      </p>

      <ul className={s.list}>
        {listed.map((b, i) => (
          <li key={b.id} className="rise" style={{ "--stagger": Math.min(i + 2, 6) } as CSSProperties}>
            <Card b={b} />
          </li>
        ))}
      </ul>

      <section className={s.how} aria-labelledby="puja-how">
        <h2 id="puja-how" className="eyebrow">
          How it works
        </h2>
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step}>
              <span className={s.stepNum} aria-hidden>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function Card({ b }: { b: Bundle }) {
  const off = b.was ? Math.round((1 - b.price / b.was) * 100) : 0;
  return (
    <article className={s.card} data-for-you={b.forYou ? "" : undefined}>
      {b.forYou && (
        <p className={s.forYou}>
          <Icon name="star" size={13} />
          {b.forYou}
        </p>
      )}
      <div className={s.cardTop}>
        <Image src={b.art} alt="" width={68} height={68} className={s.art} />
        <div className={s.cardText}>
          <h3 className={s.name}>{b.name}</h3>
          <p className={s.note}>{b.note}</p>
          <p className={s.rating}>
            ★ {b.rating.toFixed(1)} <span>· {b.booked} booked</span>
          </p>
        </div>
      </div>

      <dl className={s.facts}>
        <div>
          <dt>
            <Icon name="pin" size={14} />
            <span className="sr-only">Where</span>
          </dt>
          <dd>
            {b.temple}, {b.city}
          </dd>
        </div>
        <div>
          <dt>
            <Icon name="calendar" size={14} />
            <span className="sr-only">Next date</span>
          </dt>
          <dd>Next on {b.when}</dd>
        </div>
      </dl>

      <details className={s.inside}>
        <summary>
          {b.pujas.length} rituals in this bundle
          <Icon name="chevron" size={16} className={s.insideIcon} />
        </summary>
        <ul>
          {b.pujas.map((p) => (
            <li key={p}>
              <span className="diamond" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </details>

      <div className={s.foot}>
        <p className={s.price}>
          <strong>{inr(b.price)}</strong>
          {b.was && <s>{inr(b.was)}</s>}
          {off > 0 && <span className={s.off}>{off}% off</span>}
        </p>
        <button type="button" className={`btn btn-primary ${s.book}`} onClick={() => book(b.name)}>
          Book
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </article>
  );
}
