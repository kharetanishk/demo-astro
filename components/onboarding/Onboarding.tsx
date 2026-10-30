"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { Segmented } from "@/components/ui/Segmented";
import s from "./Onboarding.module.css";

const INTRO = [
  { title: "Your Kundli, instantly", body: "A full Vedic birth chart in seconds, read for your modern life.", art: "/logo/sarvdrishti-eye.webp" },
  { title: "Daily cosmic guidance", body: "Panchang, muhurat and your best hours, every morning.", art: "/panchang-manuscript.webp" },
  { title: "Consult real Jyotishis", body: "Chat or call certified Vedic astrologers, any time.", art: "/astroguru.webp" },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CITIES = ["Mumbai, Maharashtra", "Delhi", "Bengaluru, Karnataka", "Kolkata, West Bengal", "Chennai, Tamil Nadu", "Jaipur, Rajasthan", "Varanasi, Uttar Pradesh", "Pune, Maharashtra", "Ahmedabad, Gujarat", "Hyderabad, Telangana"];
const STEPS = ["name", "gender", "date", "time", "place"] as const;
type Step = "intro" | (typeof STEPS)[number] | "ready";

/* Onboarding: three cards to welcome, then one question a screen, each
   answered step lighting a star in the constellation at the top. It ends
   with the chart's three seals revealed. Nothing is saved in this demo. */
export function Onboarding() {
  const [step, setStep] = useState<Step>("intro");
  const [card, setCard] = useState(0);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [date, setDate] = useState({ d: 14, m: 9, y: 2001 });
  const [time, setTime] = useState({ h: 6, min: 45, pm: false, unknown: false });
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("");

  const index = STEPS.indexOf(step as (typeof STEPS)[number]);
  const next = () => setStep(index < STEPS.length - 1 ? STEPS[index + 1] : "ready");
  const back = () => setStep(index > 0 ? STEPS[index - 1] : "intro");
  const canGo = step === "name" ? name.trim().length > 0 : step === "place" ? place !== "" : true;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (canGo) next();
  }

  if (step === "intro") {
    const c = INTRO[card];
    return (
      <main className={`page ${s.screen}`}>
        <Immersive />
        <Link href="/" className={s.skip}>
          Skip
        </Link>
        <div key={card} className={s.intro}>
          <div className={s.introArt}>
            <Image src={c.art} alt="" width={240} height={240} priority />
          </div>
          <h1 className={s.introTitle}>{c.title}</h1>
          <p className={s.introBody}>{c.body}</p>
        </div>
        <div className={s.dots} role="tablist" aria-label="Welcome cards">
          {INTRO.map((x, i) => (
            <button key={x.title} type="button" role="tab" aria-selected={i === card} aria-label={x.title} className={s.dot} onClick={() => setCard(i)} />
          ))}
        </div>
        <div className={s.footer}>
          <button type="button" className="btn btn-primary" onClick={() => (card < INTRO.length - 1 ? setCard(card + 1) : setStep("name"))}>
            {card < INTRO.length - 1 ? "Next" : "Get my free Kundli"}
          </button>
          <p className={s.terms}>By continuing you agree to our Terms and Privacy Policy</p>
        </div>
      </main>
    );
  }

  if (step === "ready") {
    return (
      <main className={`page ${s.screen}`}>
        <Immersive />
        <div className={s.ready}>
          <div className={s.readyWheel} aria-hidden>
            <Image src="/logo/sarvdrishti-eye.webp" alt="" width={164} height={313} priority />
          </div>
          <p className="eyebrow">Your chart is ready</p>
          <h1 className={s.readyTitle}>Namaste, {name.trim().split(" ")[0] || "friend"}</h1>
          <ul className={s.seals}>
            {[
              { label: "Lagna", value: "Simha", glyph: "♌" },
              { label: "Rashi", value: "Tula", glyph: "♎" },
              { label: "Nakshatra", value: "Swati", glyph: "✦" },
            ].map((x, i) => (
              <li key={x.label} className={s.seal} style={{ "--n": i } as CSSProperties}>
                <span className={s.sealCoin} aria-hidden>
                  {x.glyph}
                </span>
                <span className={s.sealLabel}>{x.label}</span>
                <strong>{x.value}</strong>
              </li>
            ))}
          </ul>
          <p className={s.readyNote}>
            Born {date.d} {MONTHS[date.m]} {date.y}
            {time.unknown ? ", time unknown" : `, ${time.h}:${String(time.min).padStart(2, "0")} ${time.pm ? "PM" : "AM"}`} · {place.split(",")[0]}
            <br />
            <small>A sample chart: nothing you entered is saved in this demo.</small>
          </p>
        </div>
        <div className={s.footer}>
          <Link href="/" className="btn btn-primary">
            Start my journey
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`page ${s.screen}`}>
      <Immersive />
      <header className={`${s.top} screen-bar`}>
        <button type="button" className="icon-btn surface" aria-label="Back" onClick={back}>
          <Icon name="arrow" size={20} className={s.flip} />
        </button>
        {/* The constellation: a star per step, lit as you go */}
        <ol className={s.stars} aria-label={`Step ${index + 1} of ${STEPS.length}`}>
          {STEPS.map((st, i) => (
            <li key={st} className={s.star} data-lit={i <= index || undefined} />
          ))}
        </ol>
        <span className={s.stepCount}>
          {index + 1}/{STEPS.length}
        </span>
      </header>

      <form key={step} className={s.form} onSubmit={submit}>
        {step === "name" && (
          <>
            <h1 className={s.question}>What should we call you?</h1>
            <p className={s.hint}>Your name personalises your cosmic journey.</p>
            <label className={s.field}>
              <span className="sr-only">Your name</span>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" autoComplete="given-name" />
            </label>
            <p className={s.quote}>&ldquo;A name is the first gift from the universe; it carries its own vibration.&rdquo;</p>
          </>
        )}

        {step === "gender" && (
          <>
            <h1 className={s.question}>How do you identify?</h1>
            <p className={s.hint}>Some readings differ for each.</p>
            <div className={s.genders} role="radiogroup" aria-label="Gender">
              {(
                [
                  { id: "male", label: "Male", glyph: "♂" },
                  { id: "female", label: "Female", glyph: "♀" },
                  { id: "other", label: "Other", glyph: "✧" },
                ] as const
              ).map((g) => (
                <button key={g.id} type="button" role="radio" aria-checked={gender === g.id} className={`${s.gender} surface`} onClick={() => setGender(g.id)}>
                  <span className={s.genderGlyph} aria-hidden>
                    {g.glyph}
                  </span>
                  {g.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === "date" && (
          <>
            <h1 className={s.question}>When were you born?</h1>
            <p className={s.hint}>Your birth date is the key to your chart.</p>
            <div className={s.wheels}>
              <Wheel label="Day" value={date.d} options={Array.from({ length: 31 }, (_, i) => [i + 1, String(i + 1)])} onChange={(d) => setDate({ ...date, d })} />
              <Wheel label="Month" value={date.m} options={MONTHS.map((m, i) => [i, m])} onChange={(m) => setDate({ ...date, m })} />
              <Wheel label="Year" value={date.y} options={Array.from({ length: 90 }, (_, i) => [2026 - i, String(2026 - i)])} onChange={(y) => setDate({ ...date, y })} />
            </div>
          </>
        )}

        {step === "time" && (
          <>
            <h1 className={s.question}>At what time?</h1>
            <p className={s.hint}>Even an approximate time sharpens your Lagna.</p>
            <fieldset className={s.wheels} disabled={time.unknown}>
              <legend className="sr-only">Birth time</legend>
              <Wheel label="Hour" value={time.h} options={Array.from({ length: 12 }, (_, i) => [i + 1, String(i + 1)])} onChange={(h) => setTime({ ...time, h })} />
              <Wheel label="Minute" value={time.min} options={Array.from({ length: 60 }, (_, i) => [i, String(i).padStart(2, "0")])} onChange={(min) => setTime({ ...time, min })} />
              <div className={s.ampm}>
                <Segmented
                  label="AM or PM"
                  options={[
                    { id: "am", label: "AM" },
                    { id: "pm", label: "PM" },
                  ]}
                  value={time.pm ? "pm" : "am"}
                  onChange={(v) => setTime({ ...time, pm: v === "pm" })}
                />
              </div>
            </fieldset>
            <button type="button" role="switch" aria-checked={time.unknown} className={`${s.unknown} surface`} onClick={() => setTime({ ...time, unknown: !time.unknown })}>
              <span>
                <strong>I don&rsquo;t know my birth time</strong>
                <small>We&rsquo;ll use sunrise instead</small>
              </span>
              <span className={s.check} aria-hidden>
                <Icon name="check" size={16} />
              </span>
            </button>
          </>
        )}

        {step === "place" && (
          <>
            <h1 className={s.question}>Where were you born?</h1>
            <p className={s.hint}>Your birthplace sets the cosmic coordinates.</p>
            <label className={`${s.field} ${s.search}`}>
              <Icon name="search" size={20} />
              <span className="sr-only">City or town</span>
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city or town" />
            </label>
            <ul className={s.cities} role="radiogroup" aria-label="Places">
              {CITIES.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase())).map((c) => (
                <li key={c}>
                  <button type="button" role="radio" aria-checked={place === c} className={s.city} onClick={() => setPlace(c)}>
                    <span>{c.split(",")[0]}</span>
                    <small>{c.split(", ")[1] ?? "India"}</small>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className={s.footer}>
          <button type="submit" className="btn btn-primary" disabled={!canGo}>
            {step === "place" ? "Cast my chart" : "Continue"}
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </form>
    </main>
  );
}

/* One part of a date or time: a tall tile over a native select, so the
   phone's own wheel picker opens on tap */
function Wheel({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (v: number) => void }) {
  return (
    <label className={s.wheel}>
      <span className={s.wheelLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
