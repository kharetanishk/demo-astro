"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SarvEye } from "@/components/home/Sarvadrishti";
import { emblem } from "@/components/rashifal/signs";
import { ZodiacWheel } from "@/components/rashifal/ZodiacWheel";
import { Immersive } from "@/components/ui/Immersive";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { fadeScreens, moveSheet } from "@/components/ui/sheet";
import { Universe } from "./Universe";
import s from "./Onboarding.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CITIES = ["Mumbai, Maharashtra", "Delhi", "Bengaluru, Karnataka", "Kolkata, West Bengal", "Chennai, Tamil Nadu", "Jaipur, Rajasthan", "Varanasi, Uttar Pradesh", "Pune, Maharashtra", "Ahmedabad, Gujarat", "Hyderabad, Telangana"];
const LANGUAGES = ["English", "Hindi", "Bengali", "Gujarati", "Kannada", "Malayalam", "Marathi", "Punjabi", "Tamil", "Telugu", "Urdu"];
const CODE_LENGTH = 6;

type Step = "welcome" | "phone" | "code" | "name" | "gender" | "date" | "knownTime" | "time" | "place" | "languages" | "ready";

/* The medallions along the top: one per subject, so both birth-time screens
   sit under the clock */
const MEDALLIONS: { icon: GlyphName; label: string; steps: Step[] }[] = [
  { icon: "user", label: "Your name", steps: ["name"] },
  { icon: "star", label: "About you", steps: ["gender"] },
  { icon: "calendar", label: "Birth date", steps: ["date"] },
  { icon: "clock", label: "Birth time", steps: ["knownTime", "time"] },
  { icon: "pin", label: "Birthplace", steps: ["place"] },
  { icon: "chat", label: "Languages", steps: ["languages"] },
];

/* The name, in the languages of the app (Marathi shares Hindi's script). The
   scripts are pre-drawn in the wordmark's crimson and gold, so no script fonts
   load; each sits centred in the same box. Timed by .name in the CSS. */
const NAMES = ["/logo/sarvdrishti-wordmark.webp", ...["hi", "bn", "ta", "te", "kn", "ml", "gu", "pa", "ur"].map((id) => `/logo/names/${id}.webp`)];

const GENDERS = [
  { id: "male", label: "Male", note: "Venus read as your marriage karaka" },
  { id: "female", label: "Female", note: "Jupiter read as your marriage karaka" },
  { id: "other", label: "Other", note: "Or prefer not to say: a unisex reading" },
] as const;

/* Onboarding: the welcome, the signs drifting out of the night behind the eye; sign in by
   mobile number or Google; one question a screen under a row of gold
   medallions; then the chart revealed, and the app opening like an eye. The
   way back retraces the way you came. Nothing you enter is kept. */
export function Onboarding() {
  const router = useRouter();
  const [trail, setTrail] = useState<Step[]>(["welcome"]);
  const [forward, setForward] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [date, setDate] = useState({ d: 14, m: 9, y: 2001 });
  const [time, setTime] = useState({ h: 6, min: 45, pm: false, unknown: false });
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("");
  const [languages, setLanguages] = useState(["English", "Hindi"]);

  const vanish = useRef<HTMLSpanElement>(null);

  const step = trail[trail.length - 1];
  // Into or out of the night sky, the whole screen changes: dissolve between them
  const move = (to: Step[], ahead: boolean) => {
    const change = () => {
      setForward(ahead);
      setTrail(to);
    };
    if (step === "welcome" || to[to.length - 1] === "welcome") fadeScreens(change);
    else change();
  };
  const go = (to: Step) => move([...trail, to], true);
  const back = () => move(trail.slice(0, -1), false);

  function enter() {
    moveSheet("enter", () => router.replace("/"));
  }

  if (step === "welcome") {
    return (
      <main className={`page ${s.welcome}`}>
        <Immersive />
        <Universe vanish={vanish} />
        <div className={s.brand}>
          <div className={s.mark}>
            <span ref={vanish} className={s.vanish} aria-hidden />
            <span className={s.halo} aria-hidden />
            <span className={s.ripple} aria-hidden />
            <span className={s.eye}>
              <SarvEye />
            </span>
          </div>
        </div>
        {/* The sky above, and the brand on the app's own light ground, where its crimson belongs */}
        <div className={s.sheet}>
          <div className={s.names} role="img" aria-label="Sarvdrishti">
            {NAMES.map((src, i) => (
              <Image key={src} src={src} alt="" width={472} height={128} unoptimized loading="eager" className={s.name} style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
          <h1 className={s.tagline}>Your stars, decoded for you</h1>
          <p className={s.promise}>Your Kundli, daily guidance and live Jyotishis, in one place.</p>
          <div className={s.signIn}>
            <button type="button" className={`btn btn-primary ${s.wide}`} onClick={() => go("phone")}>
              <Icon name="phone" size={18} />
              Continue with mobile number
            </button>
            <button type="button" className={`btn btn-secondary ${s.wide}`} onClick={() => go("name")}>
              <GoogleMark />
              Continue with Google
            </button>
          </div>
          <p className={s.terms}>By continuing you agree to our Terms and Privacy Policy</p>
        </div>
      </main>
    );
  }

  if (step === "ready") {
    return (
      <main className={`page ${s.screen} ${s.readyScreen}`}>
        <Immersive />
        <ZodiacWheel center="tula" className={s.readyWheel} />
        <p className={`eyebrow ${s.readyEyebrow}`}>Your chart is ready</p>
        <h1 className={s.readyTitle}>Namaste, {name.trim().split(" ")[0] || "friend"}</h1>
        <p className={s.readyLine}>The stars have been waiting for you.</p>
        <ul className={s.seals}>
          {[
            { label: "Lagna", value: "Simha", sign: "simha" },
            { label: "Rashi", value: "Tula", sign: "tula" },
            { label: "Nakshatra", value: "Swati" },
          ].map((x, i) => (
            <li key={x.label} className={s.seal} style={{ "--n": i } as CSSProperties}>
              {x.sign ? (
                <Image src={emblem(x.sign)} alt="" width={64} height={64} loading="eager" />
              ) : (
                <span className={s.sealStar} aria-hidden>
                  <Icon name="star" size={30} />
                </span>
              )}
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
        <button type="button" className={`btn btn-primary ${s.wide} ${s.enter}`} onClick={enter}>
          Enter the world of Sarvdrishti
          <Icon name="arrow" size={18} />
        </button>
      </main>
    );
  }

  const medal = MEDALLIONS.findIndex((m) => m.steps.includes(step));
  const answered: Partial<Record<Step, { ok: boolean; to: Step }>> = {
    phone: { ok: phone.length === 10, to: "code" },
    name: { ok: name.trim().length > 0, to: "gender" },
    gender: { ok: true, to: "date" },
    date: { ok: true, to: "knownTime" },
    time: { ok: true, to: "place" },
    place: { ok: place !== "", to: "languages" },
    languages: { ok: languages.length > 0, to: "ready" },
  };
  const here = answered[step];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (here?.ok) go(here.to);
  }

  return (
    <main className={`page ${s.screen}`}>
      <Immersive />
      <ZodiacWheel bare className={s.backdropWheel} />

      <header className={`${s.top} screen-bar`}>
        <button type="button" className="icon-btn surface" aria-label="Back" onClick={back}>
          <Icon name="arrow" size={20} className={s.flip} />
        </button>
        {medal >= 0 ? (
          /* A mala: gold beads on a thread that fills as you go, the step you're on its medallion */
          <ol className={s.mala} style={{ "--done": medal / (MEDALLIONS.length - 1) } as CSSProperties} aria-label={`Step ${medal + 1} of ${MEDALLIONS.length}`}>
            {MEDALLIONS.map((m, i) => (
              <li key={m.icon} className={s.bead} data-state={i === medal ? "now" : i < medal ? "done" : undefined}>
                {i === medal && (
                  <span className={s.medallion}>
                    <Icon name={m.icon} size={18} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className={s.topTitle}>Sign in</p>
        )}
      </header>

      <form key={step} className={s.form} data-forward={forward || undefined} onSubmit={submit}>
        {medal >= 0 && (
          <p className={`eyebrow ${s.stepLabel}`}>
            Step {medal + 1} of {MEDALLIONS.length} · {MEDALLIONS[medal].label}
          </p>
        )}
        {step === "phone" && (
          <>
            <h1 className={s.question}>Your mobile number</h1>
            <p className={s.hint}>For sign-in and consultation reminders.</p>
            <label className={s.phone}>
              <span className={s.country}>+91</span>
              <span className="sr-only">Mobile number</span>
              <input autoFocus inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" />
            </label>
          </>
        )}

        {step === "code" && (
          <>
            <h1 className={s.question}>Enter your code</h1>
            <p className={s.hint}>
              Sent to +91 {phone}.{" "}
              <button type="button" className={s.textLink} onClick={back}>
                Change
              </button>
            </p>
            <CodeField
              value={code}
              onChange={(v) => {
                setCode(v);
                if (v.length === CODE_LENGTH) go("name");
              }}
            />
            <p className={s.demoNote}>This demo sends no message: any {CODE_LENGTH} digits will do.</p>
          </>
        )}

        {step === "name" && (
          <>
            <h1 className={s.question}>What should we call you?</h1>
            <p className={s.hint}>Your name personalises your cosmic journey.</p>
            <label className={s.card}>
              <span className="sr-only">Your name</span>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" autoComplete="given-name" />
            </label>
            <p className={s.quote}>&ldquo;A name is the first gift from the universe; it carries its own vibration.&rdquo;</p>
          </>
        )}

        {step === "gender" && (
          <>
            <h1 className={s.question}>I identify as</h1>
            <p className={s.hint}>It tunes marriage and partnership readings. You can change it later.</p>
            <div className={s.genders} role="radiogroup" aria-label="Gender">
              {GENDERS.map((g) => (
                <button key={g.id} type="button" role="radio" aria-checked={gender === g.id} className={`${s.gender} pressable`} onClick={() => setGender(g.id)}>
                  <Image src={`/onboarding/${g.id}.webp`} alt="" width={64} height={64} loading="eager" className={s.genderArt} />
                  <span className={s.genderText}>
                    <strong>{g.label}</strong>
                    <small>{g.note}</small>
                  </span>
                  <span className={s.genderMark} aria-hidden>
                    <Icon name="check" size={14} />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "date" && (
          <>
            <h1 className={s.question}>When were you born?</h1>
            <p className={s.hint}>Your birth date is the key to your chart.</p>
            <DatePicker date={date} onChange={setDate} />
          </>
        )}

        {step === "knownTime" && (
          <>
            <h1 className={s.question}>Do you know your time of birth?</h1>
            <p className={s.hint}>Your birth time sets your Lagna, which shapes your personality reading.</p>
            <div className={s.choices}>
              <button
                type="button"
                className={`${s.choice} pressable`}
                onClick={() => {
                  setTime({ ...time, unknown: false });
                  go("time");
                }}
              >
                <span className={s.choiceMark} data-yes aria-hidden>
                  <Icon name="check" size={18} />
                </span>
                Yes, I know it
                <Icon name="chevron" size={18} className={s.choiceArrow} />
              </button>
              <button
                type="button"
                className={`${s.choice} pressable`}
                onClick={() => {
                  setTime({ ...time, unknown: true });
                  go("place");
                }}
              >
                <span className={s.choiceMark} aria-hidden>
                  <Icon name="close" size={18} />
                </span>
                No, I don&rsquo;t
                <Icon name="chevron" size={18} className={s.choiceArrow} />
              </button>
            </div>
            <p className={s.quote}>Without it we use sunrise, so your Lagna is approximate. You can add it later.</p>
          </>
        )}

        {step === "time" && (
          <>
            <h1 className={s.question}>At what time?</h1>
            <p className={s.hint}>Even an approximate time sharpens your Lagna.</p>
            <div className={s.pickers}>
              <Picker label="Hour" value={time.h} options={Array.from({ length: 12 }, (_, i) => [i + 1, String(i + 1)])} onChange={(h) => setTime((t) => ({ ...t, h }))} />
              <span className={s.colon} aria-hidden>
                :
              </span>
              <Picker label="Minute" value={time.min} options={Array.from({ length: 60 }, (_, i) => [i, String(i).padStart(2, "0")])} onChange={(min) => setTime((t) => ({ ...t, min }))} />
              <Picker
                label="AM or PM"
                value={time.pm ? 1 : 0}
                options={[
                  [0, "AM"],
                  [1, "PM"],
                ]}
                onChange={(v) => setTime((t) => ({ ...t, pm: v === 1 }))}
              />
            </div>
          </>
        )}

        {step === "place" && (
          <>
            <h1 className={s.question}>Where were you born?</h1>
            <p className={s.hint}>Your birthplace sets the cosmic coordinates.</p>
            <label className={`${s.card} ${s.search}`}>
              <Icon name="search" size={20} />
              <span className="sr-only">City or town</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city or town" />
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

        {step === "languages" && (
          <>
            <h1 className={s.question}>Which languages should your astrologer speak?</h1>
            <p className={s.hint}>Choose as many as you like.</p>
            <ul className={s.languages}>
              {LANGUAGES.map((l) => {
                const on = languages.includes(l);
                return (
                  <li key={l}>
                    <button type="button" role="checkbox" aria-checked={on} className={s.language} onClick={() => setLanguages(on ? languages.filter((x) => x !== l) : [...languages, l])}>
                      {l}
                      <Icon name={on ? "check" : "plus"} size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {here && (
          <button type="submit" className={`btn btn-primary ${s.wide} ${s.next}`} disabled={!here.ok}>
            {step === "languages" ? "Reveal my stars" : step === "phone" ? "Send code" : "Next"}
            <Icon name="arrow" size={18} />
          </button>
        )}
      </form>
    </main>
  );
}

/* Six boxes over one real field, so paste and the phone's autofill just work */
function CodeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className={s.code}>
      <span className="sr-only">Verification code</span>
      <input autoFocus inputMode="numeric" autoComplete="one-time-code" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))} />
      <span className={s.codeBoxes} aria-hidden>
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <span key={i} className={s.codeBox} data-now={i === value.length || undefined}>
            {value[i]}
          </span>
        ))}
      </span>
    </label>
  );
}

type BirthDate = { d: number; m: number; y: number };

function DatePicker({ date, onChange }: { date: BirthDate; onChange: (update: (d: BirthDate) => BirthDate) => void }) {
  const days = new Date(date.y, date.m + 1, 0).getDate();
  // A shorter month pulls the day back into range
  useEffect(() => {
    if (date.d > days) onChange((x) => ({ ...x, d: days }));
  }, [date.d, days, onChange]);
  return (
    <div className={s.pickers}>
      <Picker label="Month" value={date.m} options={MONTHS.map((m, i) => [i, m])} onChange={(m) => onChange((x) => ({ ...x, m }))} />
      <Picker label="Day" value={Math.min(date.d, days)} options={Array.from({ length: days }, (_, i) => [i + 1, String(i + 1)])} onChange={(d) => onChange((x) => ({ ...x, d }))} />
      <Picker label="Year" value={date.y} options={Array.from({ length: 90 }, (_, i) => [2026 - i, String(2026 - i)])} onChange={(y) => onChange((x) => ({ ...x, y }))} />
    </div>
  );
}

const ROW = 48; // one row of a picker, matching .option in the CSS

/* A scroll wheel with no library: CSS snaps the rows and whichever sits in the
   middle is the value. Tap a row or use the arrow keys to move it too. */
function Picker({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (v: number) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const index = Math.max(0, options.findIndex(([v]) => v === value));
  const moveTo = (i: number) => list.current?.scrollTo({ top: i * ROW, behavior: "smooth" });

  // Start on the value, and follow it when it changes from outside (a shorter month)
  useLayoutEffect(() => {
    const el = list.current;
    if (el && Math.round(el.scrollTop / ROW) !== index) el.scrollTop = index * ROW;
  }, [index]);

  return (
    <div
      ref={list}
      className={s.picker}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuetext={options[index]?.[1]}
      onScroll={(e) => {
        const option = options[Math.round(e.currentTarget.scrollTop / ROW)];
        if (option && option[0] !== value) onChange(option[0]);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          moveTo(Math.min(options.length - 1, Math.max(0, index + (e.key === "ArrowDown" ? 1 : -1))));
        }
      }}
    >
      {options.map(([v, text], i) => (
        <button key={v} type="button" tabIndex={-1} className={s.option} data-on={i === index || undefined} onClick={() => moveTo(i)}>
          {text}
        </button>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.640 9.200c0-.640-.060-1.250-.160-1.840H9v3.480h4.840a4.140 4.140 0 0 1-1.800 2.720v2.260h2.920c1.700-1.570 2.680-3.880 2.680-6.620z" />
      <path fill="#34A853" d="M9 18c2.430 0 4.470-.800 5.960-2.180l-2.920-2.260c-.800.540-1.830.860-3.040.860-2.340 0-4.320-1.580-5.030-3.700H.960v2.330A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.970 10.720a5.400 5.400 0 0 1 0-3.440V4.950H.960a9 9 0 0 0 0 8.100z" />
      <path fill="#EA4335" d="M9 3.580c1.320 0 2.510.450 3.440 1.350l2.580-2.580A9 9 0 0 0 .960 4.950l3.010 2.330C4.680 5.160 6.660 3.580 9 3.580z" />
    </svg>
  );
}
