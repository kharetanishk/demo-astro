"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { notify } from "@/components/ui/demo";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import { astrologer, initials } from "@/components/guru/astrologers";
import { entries, type Entry } from "./entries";
import s from "./History.module.css";

type Filter = "all" | Entry["kind"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "consult", label: "Guru" },
  { id: "booking", label: "Bookings" },
];

const MEDIA: Record<"chat" | "audio" | "video", { label: string; icon: GlyphName }> = {
  chat: { label: "Chat", icon: "chat" },
  audio: { label: "Call", icon: "phone" },
  video: { label: "Video call", icon: "video" },
};

const NODE: Record<Entry["kind"], GlyphName> = { ai: "star", consult: "chat", booking: "calendar" };

/* History: the next booking pinned as a ticket, then everything you've
   asked and booked as one thread through the days, a gold diamond on the
   thread for each. */
export function History() {
  const [filter, setFilter] = useState<Filter>("all");
  const next = entries.find((e) => e.kind === "booking" && e.status === "upcoming");
  const shown = entries.filter((e) => filter === "all" || e.kind === filter);
  const days = [...new Set(shown.map((e) => e.day))];
  const minutes = entries.reduce((m, e) => m + (e.kind === "consult" ? e.minutes : 0), 0);

  return (
    <main className="page">
      <ScreenHeader title="History" eyebrow="Your journey" />

      {next?.kind === "booking" && <NextTicket entry={next} />}

      <dl className={`${s.tally} rise`} style={{ "--stagger": 2 } as CSSProperties}>
        <div>
          <dt>AI answers</dt>
          <dd>{entries.filter((e) => e.kind === "ai").length}</dd>
        </div>
        <div>
          <dt>Consultations</dt>
          <dd>{entries.filter((e) => e.kind === "consult").length}</dd>
        </div>
        <div>
          <dt>Minutes with gurus</dt>
          <dd>{minutes}</dd>
        </div>
      </dl>

      <div className={`${s.filter} rise`} style={{ "--stagger": 3 } as CSSProperties}>
        <Segmented label="Show" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {days.length === 0 ? (
        <p className={s.empty}>Nothing here yet.</p>
      ) : (
        <div className={s.thread}>
          {days.map((day) => (
            <section key={`${filter}-${day}`} className={`${s.day} rise`} aria-label={day}>
              <h2 className={s.dayLabel}>{day}</h2>
              <ol className={s.items}>
                {shown
                  .filter((e) => e.day === day)
                  .map((e) => (
                    <li key={e.id} className={s.item} data-kind={e.kind}>
                      <span className={s.node} aria-hidden>
                        <Icon name={NODE[e.kind]} size={14} />
                      </span>
                      <EntryCard entry={e} />
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function NextTicket({ entry }: { entry: Extract<Entry, { kind: "booking" }> }) {
  const guru = astrologer(entry.guru);
  return (
    <section className={`${s.ticket} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-labelledby="history-next">
      <div className={s.ticketMain}>
        <p id="history-next" className="eyebrow">
          Up next
        </p>
        <p className={s.ticketWhen}>{entry.when}</p>
        <p className={s.ticketWho}>
          {MEDIA[entry.media].label} · {entry.minutes} min with {guru?.name}
        </p>
      </div>
      <div className={s.ticketStub}>
        <span className={s.ticketAvatar} aria-hidden>
          {guru && initials(guru.name)}
        </span>
        <button type="button" className={s.ticketAction} onClick={() => notify("Joining a call isn't part of this demo yet.")}>
          Join
        </button>
      </div>
    </section>
  );
}

function EntryCard({ entry: e }: { entry: Entry }) {
  if (e.kind === "ai") {
    return (
      <details className={`${s.card} surface`}>
        <summary className={s.summary}>
          <span className={s.meta}>
            {e.topic} · {e.time}
          </span>
          <span className={s.question}>{e.question}</span>
          <span className={s.preview}>{e.answer.split("\n")[0]}</span>
          <span className={s.more}>
            <span className={s.moreClosed}>Show full answer</span>
            <span className={s.moreOpen}>Show less</span>
            <Icon name="chevron" size={14} className={s.moreIcon} />
          </span>
        </summary>
        <div className={s.answer}>
          {e.answer
            .split("\n\n")
            .slice(1)
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
          <Link href="/ai-astrology/general" className={s.followUp}>
            Ask a follow-up
            <Icon name="arrow" size={14} />
          </Link>
        </div>
      </details>
    );
  }

  const guru = astrologer(e.guru);
  const media = MEDIA[e.media];
  return (
    <div className={`${s.card} ${s.guruCard} surface`}>
      <span className={s.avatar} data-tone={guru?.tone} aria-hidden>
        {guru && initials(guru.name)}
      </span>
      <div className={s.guruText}>
        <span className={s.meta}>
          {e.kind === "consult" ? `${media.label} · ${e.time}` : `Booking · ${e.when}`}
        </span>
        <span className={s.guruName}>{guru?.name}</span>
        <span className={s.facts}>
          <Icon name={media.icon} size={14} />
          {e.minutes} min
          {e.kind === "consult" && <> · {e.credits} credits</>}
          {e.kind === "booking" && <span className={s.status} data-status={e.status}>{e.status === "upcoming" ? "Upcoming" : e.status === "done" ? "Completed" : "Cancelled"}</span>}
        </span>
      </div>
      {e.kind === "consult" ? (
        <button type="button" className={s.open} onClick={() => notify(`Past ${media.label.toLowerCase()}s aren't part of this demo yet.`)} aria-label={`Open ${media.label.toLowerCase()} with ${guru?.name}`}>
          <Icon name="chevron" size={18} />
        </button>
      ) : (
        <Link href={`/astro-guru/${e.guru}`} className={s.open} aria-label={`Book ${guru?.name} again`}>
          <Icon name="refresh" size={18} />
        </Link>
      )}
    </div>
  );
}
