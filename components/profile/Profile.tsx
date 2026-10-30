import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { DemoButton } from "@/components/ui/demo";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { BACKDROP_ARTWORK } from "@/components/home/modules";
import { credits } from "@/components/ai/topics";
import { emblemOfName } from "@/components/rashifal/signs";
import { ZodiacWheel } from "@/components/rashifal/ZodiacWheel";
import { SignOut } from "@/components/onboarding/SignOut";
import s from "./Profile.module.css";

export type ProfileUser = {
  name: string;
  rashi: string;
  nakshatra: string;
  lagna: string;
  born: { date: string; time: string; place: string };
  phone: string;
  email: string;
  stats: { label: string; value: number }[];
};

type Row = { icon: GlyphName; art?: string; title: string; note: string; href?: string };

/* Each number's artwork and where it leads, by label */
const STATS: Record<string, { art: string; href: string }> = {
  Points: { art: "/wallet/coin.webp", href: "/wallet" },
  Consultations: { art: "/profile-consult.webp", href: "/history" },
  Bookings: { art: "/profile-booking.webp", href: "/history" },
};

/* The settings the old profile listed, grouped by what they're for */
const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Your activity",
    rows: [
      { icon: "wallet", art: "/wallet/coin.webp", title: "Wallet", note: `${credits.balance} Sarv Coins · Payment history`, href: "/wallet" },
      { icon: "clock", title: "My bookings", note: "Your booked consultations", href: "/history" },
      { icon: "chat", title: "My consultations", note: "Your past chats", href: "/history" },
    ],
  },
  {
    title: "Offers and sharing",
    rows: [
      { icon: "ticket", title: "Promo code", note: "Use a code you have" },
      { icon: "share", title: "Refer the app", note: "Invite friends and family" },
      { icon: "star", title: "Rate the app", note: "Let us know how you feel" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { icon: "globe", title: "Language", note: "Change the app's language" },
      { icon: "bell", title: "Notifications", note: "Alerts and reminders", href: "/notifications" },
    ],
  },
  {
    title: "Support and legal",
    rows: [
      { icon: "chat", title: "Feedback", note: "Share your thoughts" },
      { icon: "info", title: "Disclaimer", note: "Terms and conditions" },
      { icon: "lock", title: "Privacy policy", note: "How we use your data" },
    ],
  },
];

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

/* Profile: the person under a courtyard cover, their numbers, their chart as
   the page's walnut-and-gold centrepiece with the zodiac turning off its edge,
   then everything they can manage, grouped. Actions without a backend give an
   honest demo notice. */
export function Profile({ user }: { user: ProfileUser }) {
  const initial = user.name.trim().charAt(0).toUpperCase() || "A";
  let n = 0;
  const rise = () => ({ "--stagger": n++ }) as CSSProperties;

  return (
    <main className={`page ${s.profile}`}>
      <div className={s.cover} aria-hidden>
        <Image src={BACKDROP_ARTWORK} alt="" fill sizes="(min-width: 500px) 500px, 100vw" className={s.coverImage} />
      </div>

      <header className={`${s.top} screen-bar`}>
        <BackLink fallback="/" className="icon-btn surface">
          <Icon name="arrow" size={20} className={s.backIcon} />
        </BackLink>
        <h1 className={s.screenTitle}>Profile</h1>
        <DemoButton className="icon-btn surface" aria-label="Settings" notice="Settings aren't part of this demo yet.">
          <Icon name="settings" size={20} />
        </DemoButton>
      </header>

      {/* Identity: monogram inside a zodiac ring, name, signs, birth */}
      <section className={`${s.identity} rise`} style={rise()} aria-label="You">
        <div className={s.avatar}>
          <svg className={s.ring} viewBox="-60 -60 120 120" aria-hidden>
            <circle r="56" className={s.ringTrack} />
            {TICKS.map((a) => (
              <path key={a} d="M0 -56V-51" transform={`rotate(${a})`} className={s.ringTick} />
            ))}
            <circle r="56" className={s.ringArc} pathLength="100" />
            <circle cx="0" cy="-56" r="3.5" className={s.ringPlanet} transform="rotate(250)" />
          </svg>
          <span className={s.monogram}>
            <span>{initial}</span>
          </span>
          <DemoButton className={s.edit} aria-label="Change photo" notice="Changing your photo isn't part of this demo yet.">
            <Icon name="pencil" size={15} />
          </DemoButton>
        </div>

        <h2 className={s.name}>{user.name}</h2>
        <p className={`eyebrow ${s.signs}`}>
          {user.rashi} rashi · {user.nakshatra}
        </p>
        <p className={s.born}>
          Born {user.born.date}, {user.born.time} · {user.born.place}
        </p>

        <div className={s.actions}>
          <DemoButton className={`btn btn-secondary ${s.editProfile}`} notice="Editing your profile isn't part of this demo yet.">
            <Icon name="pencil" size={16} />
            Edit profile
          </DemoButton>
          <DemoButton className="icon-btn surface" aria-label="Share profile" notice="Sharing isn't part of this demo yet.">
            <Icon name="share" size={20} />
          </DemoButton>
        </div>
      </section>

      <ul className={`${s.stats} rise`} style={rise()} aria-label="Your numbers">
        {user.stats.map((st) => (
          <li key={st.label}>
            <Link href={STATS[st.label]?.href ?? "/history"} className={`${s.stat} pressable`}>
              {STATS[st.label] && <Image src={STATS[st.label].art} alt="" width={48} height={48} className={s.statArt} />}
              <span className={s.statValue}>{st.value}</span>
              <span className={s.statLabel}>{st.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Centrepiece: the chart */}
      <Link href="/kundli" className={`${s.chart} pressable rise`} style={rise()}>
        <ZodiacWheel className={s.wheel} />
        <span className={`eyebrow ${s.chartEyebrow}`}>Your chart</span>
        <span className={s.chartTitle}>
          {user.rashi} moon, {user.lagna} rising
        </span>
        <dl className={s.chartFacts}>
          <div>
            <Image src={emblemOfName(user.rashi)} alt="" width={52} height={52} className={s.factArt} />
            <dt>Rashi</dt>
            <dd>{user.rashi}</dd>
          </div>
          <div>
            <span className={s.factStar} aria-hidden>
              <Icon name="star" size={30} />
            </span>
            <dt>Nakshatra</dt>
            <dd>{user.nakshatra}</dd>
          </div>
          <div>
            <Image src={emblemOfName(user.lagna)} alt="" width={52} height={52} className={s.factArt} />
            <dt>Lagna</dt>
            <dd>{user.lagna}</dd>
          </div>
        </dl>
        <span className={s.chartLink}>
          Open your Kundli
          <span className={s.chartArrow} aria-hidden>
            <Icon name="arrow" size={16} />
          </span>
        </span>
      </Link>

      <section className={`${s.group} rise`} style={rise()} aria-labelledby="profile-details">
        <h3 id="profile-details" className="eyebrow">
          Contact details
        </h3>
        <dl className={s.card}>
          <div className={s.detail}>
            <span className={s.tile} aria-hidden>
              <Icon name="phone" size={18} />
            </span>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
          </div>
          <div className={s.detail}>
            <span className={s.tile} aria-hidden>
              <Icon name="mail" size={18} />
            </span>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </section>

      {groups.map((g, gi) => (
        <section key={g.title} className={`${s.group} rise`} style={rise()} aria-labelledby={`profile-group-${gi}`}>
          <h3 id={`profile-group-${gi}`} className="eyebrow">
            {g.title}
          </h3>
          <ul className={s.card}>
            {g.rows.map((r) => {
              const inner = (
                <>
                  {r.art ? (
                    <Image src={r.art} alt="" width={40} height={40} className={s.rowArt} />
                  ) : (
                    <span className={s.tile} aria-hidden>
                      <Icon name={r.icon} size={18} />
                    </span>
                  )}
                  <span className={s.rowText}>
                    <span className={s.rowTitle}>{r.title}</span>
                    <span className={s.rowNote}>{r.note}</span>
                  </span>
                  <Icon name="chevron" size={18} className={s.chevron} />
                </>
              );
              return (
                <li key={r.title}>
                  {r.href ? (
                    <Link href={r.href} className={s.row}>
                      {inner}
                    </Link>
                  ) : (
                    <DemoButton className={s.row} notice={`${r.title} isn't part of this demo yet.`}>
                      {inner}
                    </DemoButton>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className={`${s.account} rise`} style={rise()} aria-label="Account">
        <SignOut className={`btn btn-secondary ${s.signOut}`} />
        <DemoButton className={s.delete} notice="Deleting your account isn't part of this demo yet.">
          Delete account
        </DemoButton>
      </section>

      {/* Brand statement */}
      <footer className={s.statement}>
        <Image src="/logo/sarvdrishti-wordmark.webp" alt="Sarvdrishti" width={1135} height={254} unoptimized className={s.statementMark} />
        <p className={s.statementLine}>Rooted in tradition. Guided by the stars.</p>
        <p className={s.version}>Version 1.0</p>
      </footer>
    </main>
  );
}
