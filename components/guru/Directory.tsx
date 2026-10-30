"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { credits } from "@/components/ai/topics";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { STATUS_LABEL, astrologers, initials, type Astrologer } from "./astrologers";
import { DEFAULT_FILTERS, SKILLS, SORTS, activeCount, applyFilters, type Filters } from "./filters";
import { FilterSheet } from "./FilterSheet";
import s from "./Directory.module.css";

const QUICK = ["Vedic", "Tarot", "Numerology", "KP", "Palmistry", "Vastu", "Nadi"];

const online = astrologers.filter((a) => a.status === "online").sort((a, b) => b.orders * b.rating - a.orders * a.rating);
const AVERAGE_RATING = (astrologers.reduce((sum, a) => sum + a.rating, 0) / astrologers.length).toFixed(1);
const TOTAL_SESSIONS = `${Math.round(astrologers.reduce((sum, a) => sum + a.orders, 0) / 1000)}k+`;

/* Astro Guru: the guru's darshan under the app's rose, who's live right now, then everyone, under a
   bar that stays as you scroll: search, Sort & Filter, and quick skills. */
export function Directory() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [sheet, setSheet] = useState(false);

  const listed = applyFilters(astrologers, filters, query);
  const active = activeCount(filters);
  const skills = filters.picks.skill;
  const sortLabel = SORTS.find((o) => o.id === filters.sort)!.label;
  const setSkills = (picks: string[]) => setFilters({ ...filters, picks: { ...filters.picks, skill: picks } });

  function reset() {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setSearching(false);
  }

  return (
    <main className="page">
      <ScreenHeader
        title="Astro Guru"
        eyebrow="Speak with an astrologer"
        back="/"
        action={
          <Link href="/wallet" className="icon-btn surface" aria-label={`Wallet, ${credits.balance} Sarv Coins`}>
            <Image src="/wallet/coin.webp" alt="" width={30} height={30} />
          </Link>
        }
      />

      {/* The crown: rose sandstone from the top of the screen, the guru on a lit plinth */}
      <section className={s.crown}>
        <div className={s.crownBody}>
          <div className={`${s.crownText} rise`} style={{ "--stagger": 1 } as CSSProperties}>
            <p className={s.live}>
              <span className={s.pulse} aria-hidden />
              {online.length} online now
            </p>
            <h2 className={s.crownTitle}>Guidance from verified Vedic astrologers</h2>
            <p className={s.crownNote}>Call or chat, one to one. Unused minutes are refunded.</p>
          </div>
          <div className={s.darshan} aria-hidden>
            <span className={s.rays} />
            <span className={s.plinth} />
            <Image src="/astroguru.webp" alt="" width={190} height={285} priority className={s.guru} />
          </div>
        </div>

        <dl className={`${s.trust} rise`} style={{ "--stagger": 2 } as CSSProperties}>
          <div>
            <dd>{astrologers.length}</dd>
            <dt>Astrologers</dt>
          </div>
          <div>
            <dd>★ {AVERAGE_RATING}</dd>
            <dt>Average rating</dt>
          </div>
          <div>
            <dd>{TOTAL_SESSIONS}</dd>
            <dt>Consultations</dt>
          </div>
        </dl>
      </section>

      <section className={`${s.section} rise`} style={{ "--stagger": 3 } as CSSProperties} aria-labelledby="guru-live">
        <SectionHeading id="guru-live">Live now</SectionHeading>
        <ul className={s.rail}>
          {online.map((a) => (
            <li key={a.id}>
              <Link href={`/astro-guru/${a.id}`} className={s.liveLink}>
                <span className={s.liveRing}>
                  <span className={s.monogram} data-tone={a.tone}>
                    {initials(a.name)}
                  </span>
                  <span className={s.liveDot} aria-hidden />
                </span>
                <span className={s.liveName}>{a.name.replace(/^(Pt\.|Dr\.|Acharya|Swami)\s+/, "").split(" ")[0]}</span>
                <span className={s.liveRate}>
                  <Image src="/wallet/coin.webp" alt="" width={12} height={12} />
                  {a.offer ?? a.rate}/min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className={s.tools}>
        {searching ? (
          <label className={s.search}>
            <Icon name="search" size={18} />
            <span className="sr-only">Search astrologers</span>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, skill or language" />
            <button
              type="button"
              className={s.searchClose}
              aria-label="Close search"
              onClick={() => {
                setQuery("");
                setSearching(false);
              }}
            >
              <Icon name="close" size={16} />
            </button>
          </label>
        ) : (
          <>
            <button type="button" className={s.toolIcon} aria-label="Search astrologers" onClick={() => setSearching(true)}>
              <Icon name="search" size={18} />
            </button>
            <button type="button" className={s.filter} onClick={() => setSheet(true)}>
              <FilterGlyph />
              Filter
              {active > 0 && <span className={s.filterCount}>{active}</span>}
            </button>
            <span className={s.toolRule} aria-hidden />
            <div className={s.chips} role="group" aria-label="Quick skills">
              <button type="button" aria-pressed={skills.length === SKILLS.length} className={s.chip} onClick={() => setSkills(SKILLS)}>
                All
              </button>
              {QUICK.map((k) => (
                <button key={k} type="button" aria-pressed={skills.length === 1 && skills[0] === k} className={s.chip} onClick={() => setSkills([k])}>
                  {k}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <section aria-label="Astrologers">
        <p className={s.summary} aria-live="polite">
          <strong>
            {listed.length} astrologer{listed.length === 1 ? "" : "s"}
          </strong>{" "}
          · {sortLabel}
        </p>

        {listed.length === 0 ? (
          <div className={s.empty}>
            <p className={s.emptyTitle}>No astrologers match</p>
            <p>Try fewer filters, or search for something else.</p>
            <button type="button" className="btn btn-secondary" onClick={reset}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul className={s.list}>
            {listed.map((a) => (
              <li key={a.id}>
                <Card a={a} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {sheet && (
        <FilterSheet
          filters={filters}
          query={query}
          onClose={() => setSheet(false)}
          onApply={(next) => {
            setFilters(next);
            setSheet(false);
          }}
        />
      )}
    </main>
  );
}

function Card({ a }: { a: Astrologer }) {
  return (
    <article className={`${s.card} pressable`}>
      <div className={s.cardTop}>
        <div className={s.portrait}>
          <span className={s.arch} data-tone={a.tone}>
            {initials(a.name)}
          </span>
          <span className={s.rating}>★ {a.rating.toFixed(1)}</span>
          <span className={s.orders}>{a.sessions} orders</span>
        </div>
        <div className={s.info}>
          {a.tier && <p className={`eyebrow ${s.tier}`}>{a.tier}</p>}
          <h3 className={s.name}>
            {/* The name's link covers the card; the buttons sit above it */}
            <Link href={`/astro-guru/${a.id}`}>{a.name}</Link>
            <span className={s.seal} aria-label="Verified">
              <Icon name="check" size={11} />
            </span>
          </h3>
          <p className={s.skills}>{a.skills.slice(0, 3).join(", ")}</p>
          <p className={s.meta}>{a.languages.join(", ")}</p>
          <p className={s.meta}>{a.years} years of experience</p>
          <p className={s.status} data-status={a.status}>
            {STATUS_LABEL[a.status]}
          </p>
        </div>
      </div>

      <div className={s.cardFoot}>
        <p className={s.price}>
          <Image src="/wallet/coin.webp" alt="" width={18} height={18} />
          {a.offer && <s className={s.was}>{a.rate}</s>}
          <strong>{a.offer ?? a.rate}</strong>
          <span>/min</span>
        </p>
        {a.status === "offline" ? (
          <button type="button" className={`btn btn-secondary ${s.action}`} onClick={() => notify("Reminders aren't part of this demo yet.")}>
            <Icon name="bell" size={16} />
            Notify me
          </button>
        ) : (
          <div className={s.actions}>
            <button type="button" className={`btn btn-secondary ${s.action} ${s.round}`} aria-label={`Call ${a.name}`} onClick={() => notify("Calls aren't part of this demo yet.")}>
              <Icon name="phone" size={16} />
            </button>
            <button type="button" className={`btn btn-primary ${s.action}`} onClick={() => notify("Chats aren't part of this demo yet.")}>
              <Icon name="chat" size={16} />
              Chat
            </button>
          </div>
        )}
      </div>

      {a.offer && (
        <p className={s.offer}>
          <Icon name="ticket" size={14} />
          Special offer for new users
        </p>
      )}
    </article>
  );
}

function FilterGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <path d="M4 7h9M19 7h1M4 17h1M11 17h9" />
      <circle cx="16" cy="7" r="2.600" />
      <circle cx="8" cy="17" r="2.600" />
    </svg>
  );
}
