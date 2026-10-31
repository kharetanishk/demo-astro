"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { moveSheet } from "@/components/ui/sheet";
import { MATCH } from "./topics";
import s from "./MatchForm.module.css";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Jaipur", "Varanasi", "Pune", "Ahmedabad", "Hyderabad"];

type Person = { name: string; date: string; time: string; place: string };

// The groom starts as the demo user; the bride is for you to fill
const START: [Person, Person] = [
  { name: "Tanishk", date: "2001-10-14", time: "06:45", place: "Mumbai" },
  { name: "", date: "", time: "", place: "" },
];
const WHO = ["Groom", "Bride"];

/* Before the match-making chat: both people's birth details, side by side
   as two kundli cards. Native date, time and place fields; nothing is kept. */
export function MatchForm() {
  const router = useRouter();
  const [people, setPeople] = useState(START);
  const set = (i: number, key: keyof Person, value: string) => setPeople((p) => p.map((x, j) => (j === i ? { ...x, [key]: value } : x)) as [Person, Person]);
  const ready = people.every((p) => p.name.trim() && p.date && p.time && p.place.trim());

  function submit(e: FormEvent) {
    e.preventDefault();
    if (ready) moveSheet("up", () => router.push(`/ai-astrology/${MATCH.id}`));
  }

  return (
    <main className={`page ${s.match}`}>
      <Immersive />
      <ScreenHeader title="Match making" eyebrow="Kundli Milan" back="/ai-astrology" sheet />

      <section className={s.intro}>
        <Image src={MATCH.icon} alt="" width={64} height={64} className={s.emblem} />
        <p className={s.lead}>Two birth charts, read together for Ashtakoot Guna Milan.</p>
      </section>

      <form className={s.form} onSubmit={submit}>
        {people.map((p, i) => (
          <fieldset key={WHO[i]} className={`${s.card} surface`}>
            <legend className={`eyebrow ${s.legend}`}>{WHO[i]}&rsquo;s details</legend>
            <label className={s.field}>
              <span>Name</span>
              <input value={p.name} onChange={(e) => set(i, "name", e.target.value)} placeholder="Full name" autoComplete="off" />
            </label>
            <div className={s.pair}>
              <label className={s.field}>
                <span>Birth date</span>
                <input type="date" value={p.date} max="2026-12-31" onChange={(e) => set(i, "date", e.target.value)} />
              </label>
              <label className={s.field}>
                <span>Birth time</span>
                <input type="time" value={p.time} onChange={(e) => set(i, "time", e.target.value)} />
              </label>
            </div>
            <label className={s.field}>
              <span>Birthplace</span>
              <input value={p.place} onChange={(e) => set(i, "place", e.target.value)} placeholder="City or town" list="match-cities" autoComplete="off" />
            </label>
          </fieldset>
        ))}
        <datalist id="match-cities">
          {CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <p className={s.note}>A demo: these details are not saved or sent anywhere.</p>
        <button type="submit" className={`btn btn-primary ${s.go}`} disabled={!ready}>
          Match our kundlis
          <Icon name="arrow" size={18} />
        </button>
      </form>
    </main>
  );
}
