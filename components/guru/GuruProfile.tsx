"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { notify } from "@/components/ui/demo";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import { STATUS_LABEL, astrologer, initials } from "./astrologers";
import s from "./GuruProfile.module.css";

type Media = "audio" | "video" | "chat";
const MEDIA: { id: Media; label: string; icon: GlyphName }[] = [
  { id: "audio", label: "Call", icon: "phone" },
  { id: "video", label: "Video", icon: "video" },
  { id: "chat", label: "Chat", icon: "chat" },
];

// Demo availability until /availability is wired in
const DAYS = [
  { id: "thu", week: "Thu", date: 29, label: "Today" },
  { id: "fri", week: "Fri", date: 30 },
  { id: "sat", week: "Sat", date: 31 },
  { id: "sun", week: "Sun", date: 1 },
  { id: "mon", week: "Mon", date: 2 },
  { id: "tue", week: "Tue", date: 3 },
  { id: "wed", week: "Wed", date: 4 },
];
const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "4:00 PM", "6:30 PM", "7:30 PM", "8:30 PM", "9:30 PM"];
const TAKEN = new Set(["thu-10:00 AM", "thu-11:30 AM", "thu-1:00 PM", "fri-6:30 PM", "sat-10:00 AM"]);
const DURATIONS = [10, 15, 20, 30];
const BALANCE = 240;

/* An astrologer's page: their portrait in an arch, the numbers that earn
   trust, and below, the booking itself built up line by line (session,
   day, time, length), totalled in a bar that stays at the bottom. */
export function GuruProfile({ id }: { id: string }) {
  const a = astrologer(id)!;
  const [media, setMedia] = useState<Media>("audio");
  const [day, setDay] = useState(DAYS[1].id);
  const [slot, setSlot] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(15);
  const total = a.rate * minutes;
  const short = total > BALANCE;
  const dayLabel = DAYS.find((d) => d.id === day)!;

  return (
    <main className={`page ${s.profile}`}>
      <ScreenHeader
        title={a.name}
        eyebrow="Astro Guru"
        back="/astro-guru"
        action={
          <button type="button" className="icon-btn surface" aria-label={`Save ${a.name}`} onClick={() => notify("Saving isn't part of this demo yet.")}>
            <Icon name="heart" size={20} />
          </button>
        }
      />

      <section className={`${s.hero} rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <span className={s.arch} data-tone={a.tone} aria-hidden>
          {initials(a.name)}
        </span>
        <span className={s.status} data-status={a.status}>
          {STATUS_LABEL[a.status]}
        </span>
        <h2 className={s.name}>{a.name}</h2>
        <p className={s.title}>{a.title}</p>
        <dl className={s.stats}>
          <div>
            <dt>Rating</dt>
            <dd>★ {a.rating}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{a.years} yrs</dd>
          </div>
          <div>
            <dt>Sessions</dt>
            <dd>{a.sessions}</dd>
          </div>
        </dl>
      </section>

      {a.status === "online" && (
        <div className={`${s.now} rise`} style={{ "--stagger": 2 } as CSSProperties}>
          {MEDIA.map((m) => (
            <button key={m.id} type="button" className={`${s.nowBtn} surface pressable`} onClick={() => notify(`${m.label}s aren't part of this demo yet.`)}>
              <Icon name={m.icon} size={22} />
              {m.label} now
            </button>
          ))}
        </div>
      )}

      <section className={`${s.section} rise`} style={{ "--stagger": 3 } as CSSProperties} aria-labelledby="guru-about">
        <SectionHeading id="guru-about">About</SectionHeading>
        <p className={s.about}>{a.about}</p>
        <ul className={s.tags} aria-label="Specialities and languages">
          {[...a.skills, ...a.languages].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="guru-book">
        <SectionHeading id="guru-book">Book for later</SectionHeading>

        <ol className={s.steps}>
          <li className={s.step}>
            <h3 className={s.stepTitle}>Session</h3>
            <Segmented label="Session type" options={MEDIA} value={media} onChange={setMedia} />
          </li>

          <li className={s.step}>
            <h3 className={s.stepTitle}>Day</h3>
            <div className={s.days} role="radiogroup" aria-label="Day">
              {DAYS.map((d) => (
                <button key={d.id} type="button" role="radio" aria-checked={day === d.id} className={s.day} onClick={() => (setDay(d.id), setSlot(null))}>
                  <span className={s.dayWeek}>{d.label ?? d.week}</span>
                  <span className={s.dayDate}>{d.date}</span>
                </button>
              ))}
            </div>
          </li>

          <li className={s.step}>
            <h3 className={s.stepTitle}>Time</h3>
            <div className={s.slots} role="radiogroup" aria-label="Start time">
              {SLOTS.map((t) => {
                const taken = TAKEN.has(`${day}-${t}`);
                return (
                  <button key={t} type="button" role="radio" aria-checked={slot === t} disabled={taken} className={s.slot} onClick={() => setSlot(t)}>
                    {t}
                  </button>
                );
              })}
            </div>
          </li>

          <li className={s.step}>
            <h3 className={s.stepTitle}>Length</h3>
            <div className={s.durations} role="radiogroup" aria-label="Duration">
              {DURATIONS.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={minutes === m} className={s.duration} onClick={() => setMinutes(m)}>
                  <strong>{m}</strong> min
                </button>
              ))}
            </div>
          </li>
        </ol>
      </section>

      <div className={`${s.bar} surface`}>
        <div className={s.barText}>
          <span className={s.barTotal}>{total} credits</span>
          <span className={s.barNote} data-short={short || undefined}>
            {short ? (
              <>
                Wallet {BALANCE} · <Link href="/wallet">Top up</Link>
              </>
            ) : slot ? (
              `${dayLabel.week} ${dayLabel.date}, ${slot}`
            ) : (
              "Pick a time"
            )}
          </span>
        </div>
        <button type="button" className="btn btn-primary" disabled={!slot || short} onClick={() => notify("Booking isn't part of this demo yet.")}>
          Book
        </button>
      </div>
    </main>
  );
}
