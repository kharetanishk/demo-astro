"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { STATUS_LABEL, astrologers, initials } from "./astrologers";
import s from "./Directory.module.css";

const SKILLS = ["All", ...new Set(astrologers.flatMap((a) => a.skills))];

/* Astro Guru: the guru's darshan up top, those online now on a rail of
   arched portraits you can call straight from, then everyone, filtered
   by what you want to ask about. */
export function Directory() {
  const [skill, setSkill] = useState("All");
  const online = astrologers.filter((a) => a.status === "online");
  const listed = astrologers.filter((a) => skill === "All" || a.skills.includes(skill));

  return (
    <main className="page">
      <ScreenHeader title="Astro Guru" eyebrow="Speak with an astrologer" back="/" />

      <section className={`${s.hero} rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <div className={s.heroText}>
          <p className={s.live}>
            <span className={s.pulse} aria-hidden />
            {online.length} online now
          </p>
          <h2 className={s.heroTitle}>Verified Vedic astrologers</h2>
          <p className={s.heroNote}>Call, chat or book a time. Unused minutes are refunded.</p>
        </div>
        <Image src="/astroguru.webp" alt="" width={150} height={225} className={s.heroArt} priority />
      </section>

      <section className={s.section} aria-labelledby="guru-online">
        <SectionHeading id="guru-online">Online now</SectionHeading>
        <ul className={s.rail}>
          {online.map((a, i) => (
            <li key={a.id} className={`${s.portrait} rise`} style={{ "--stagger": i + 2 } as CSSProperties}>
              <Link href={`/astro-guru/${a.id}`} className={s.portraitLink}>
                <span className={s.arch} data-tone={a.tone} aria-hidden>
                  {initials(a.name)}
                </span>
                <span className={s.portraitName}>{a.name}</span>
                <span className={s.portraitTitle}>{a.title}</span>
                <span className={s.portraitRate}>
                  <strong>{a.rate}</strong> credits/min · ★ {a.rating}
                </span>
              </Link>
              <div className={s.portraitActions}>
                <button type="button" className="btn btn-primary" onClick={() => notify("Calls aren't part of this demo yet.")}>
                  <Icon name="phone" size={16} />
                  Call
                </button>
                <button type="button" className={`btn btn-secondary ${s.chatBtn}`} aria-label={`Chat with ${a.name}`} onClick={() => notify("Chats aren't part of this demo yet.")}>
                  <Icon name="chat" size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="guru-all">
        <SectionHeading id="guru-all">All astrologers</SectionHeading>
        <div className={s.skills} role="group" aria-label="Filter by speciality">
          {SKILLS.map((k) => (
            <button key={k} type="button" aria-pressed={skill === k} className={s.skill} onClick={() => setSkill(k)}>
              {k}
            </button>
          ))}
        </div>
        <ul className={s.list}>
          {listed.map((a) => (
            <li key={a.id}>
              <Link href={`/astro-guru/${a.id}`} className={`${s.row} surface pressable`}>
                <span className={s.avatar} data-tone={a.tone} data-status={a.status} aria-hidden>
                  {initials(a.name)}
                </span>
                <span className={s.rowText}>
                  <span className={s.rowName}>{a.name}</span>
                  <span className={s.rowMeta}>
                    {a.title} · {a.years} yrs · {a.languages.join(", ")}
                  </span>
                  <span className={s.rowFoot}>
                    <span className={s.status} data-status={a.status}>
                      {STATUS_LABEL[a.status]}
                    </span>
                    <span>
                      <strong>{a.rate}</strong>/min
                    </span>
                  </span>
                </span>
                <Icon name="chevron" size={18} className={s.chevron} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
