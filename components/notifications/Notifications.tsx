"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import s from "./Notifications.module.css";

// Demo inbox until /notifications is wired in
const INBOX: { id: string; icon: GlyphName; title: string; body: string; when: string; day: string; href: string; unread?: boolean }[] = [
  { id: "n1", icon: "calendar", title: "Booking tomorrow", body: "Video call with Acharya Meera Joshi at 7:30 PM.", when: "8:40 AM", day: "Today", href: "/history", unread: true },
  { id: "n2", icon: "sun", title: "Your golden hour is 8–9 PM", body: "Jupiter hora with Chal choghadiya. Good for learning and money matters.", when: "6:30 AM", day: "Today", href: "/din-chakra", unread: true },
  { id: "n3", icon: "star", title: "Purnima today", body: "Full moon until 7:58 PM. A good day for Satyanarayan katha.", when: "6:00 AM", day: "Today", href: "/panchang" },
  { id: "n4", icon: "wallet", title: "₹500 added", body: "550 Sarv Coins are in your wallet, with a 10% bonus.", when: "7:58 PM", day: "Yesterday", href: "/wallet" },
  { id: "n5", icon: "heart", title: "Keep your streak", body: "12 days of jaap. One mala tonight keeps it going.", when: "8:00 PM", day: "Yesterday", href: "/maala-jaap" },
];

const PREFS = [
  { id: "bookings", title: "Booking reminders", note: "A day before and 15 minutes before your booked call", on: true },
  { id: "daily", title: "Morning day forecast", note: "Your day, hour by hour, in Din Chakra", on: true },
  { id: "japa", title: "Japa reminder", note: "An evening reminder so your streak doesn't break", on: true },
  { id: "chat", title: "Chat messages", note: "New messages from your astrologer", on: true },
  { id: "offers", title: "Offers", note: "Deals and news from Sarvadrishti", on: false },
];

/* Notifications: the inbox grouped by day, each row going where its push
   pointed; then the switches for which ones you get. */
export function Notifications() {
  const [read, setRead] = useState<Set<string>>(new Set());
  const [prefs, setPrefs] = useState(() => Object.fromEntries(PREFS.map((p) => [p.id, p.on])));
  const unread = INBOX.filter((n) => n.unread && !read.has(n.id)).length;
  const days = [...new Set(INBOX.map((n) => n.day))];

  return (
    <main className="page">
      <ScreenHeader
        title="Notifications"
        eyebrow={unread ? `${unread} unread` : "All caught up"}
        back="/"
        action={
          <button type="button" className="icon-btn surface" aria-label="Mark all read" disabled={!unread} onClick={() => setRead(new Set(INBOX.map((n) => n.id)))}>
            <Icon name="check" size={20} />
          </button>
        }
      />

      {days.map((day, di) => (
        <section key={day} className={`${s.day} rise`} style={{ "--stagger": di + 1 } as CSSProperties} aria-label={day}>
          <h2 className={s.dayLabel}>{day}</h2>
          <ul className={`${s.list} surface`}>
            {INBOX.filter((n) => n.day === day).map((n) => (
              <li key={n.id}>
                <Link href={n.href} className={s.item} data-unread={(n.unread && !read.has(n.id)) || undefined} onClick={() => setRead((r) => new Set(r).add(n.id))}>
                  <span className="icon-chip" aria-hidden>
                    <Icon name={n.icon} size={18} />
                  </span>
                  <span className={s.text}>
                    <span className={s.title}>{n.title}</span>
                    <span className={s.body}>{n.body}</span>
                  </span>
                  <span className={s.when}>{n.when}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className={s.section} aria-labelledby="notif-prefs">
        <SectionHeading id="notif-prefs">What you hear about</SectionHeading>
        <ul className={`${s.list} surface`}>
          {PREFS.map((p) => (
            <li key={p.id}>
              <button type="button" role="switch" aria-checked={prefs[p.id]} className={s.pref} onClick={() => setPrefs((x) => ({ ...x, [p.id]: !x[p.id] }))}>
                <span className={s.text}>
                  <span className={s.title}>{p.title}</span>
                  <span className={s.body}>{p.note}</span>
                </span>
                <span className={s.switch} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
