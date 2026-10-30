"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { notify } from "@/components/ui/demo";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import s from "./Wallet.module.css";

// Demo balance, packs and ledger until /payments and /walletLedger are wired in
const BALANCE = { coins: 240, ai: 3 };
/* The more you add, the more gold in the picture */
const AMOUNTS = [
  { rupees: 100, bonus: 0, art: "/wallet/coins-100.webp", w: 90, h: 45 },
  { rupees: 250, bonus: 5, art: "/wallet/coins-250.webp", w: 96, h: 54 },
  { rupees: 500, bonus: 10, art: "/wallet/coins-500.webp", w: 88, h: 47, popular: true },
  { rupees: 1000, bonus: 15, art: "/wallet/coins-1000.webp", w: 112, h: 65 },
];
const GST = 0.18;
const PACKS = [
  { id: "p5", questions: 5, coins: 100, art: "/wallet/coins-100.webp" },
  { id: "p15", questions: 15, coins: 270, save: 30, art: "/wallet/coins-250.webp" },
  { id: "unl", questions: 0, coins: 499, days: 7, art: "/ai-astrology-new.webp" },
];
const LEDGER: { id: string; label: string; when: string; amount: number; icon: GlyphName; ai?: boolean }[] = [
  { id: "l1", label: "AI question", when: "Today, 9:12 AM", amount: -1, icon: "star", ai: true },
  { id: "l2", label: "Booking held · Meera Joshi", when: "Today, 8:40 AM", amount: -300, icon: "calendar" },
  { id: "l3", label: "Chat · Raghav Shastri", when: "Yesterday, 8:19 PM", amount: -350, icon: "chat" },
  { id: "l4", label: "Top up · ₹500 + 10%", when: "Yesterday, 7:58 PM", amount: 550, icon: "plus" },
  { id: "l5", label: "Hold released", when: "26 Oct, 6:43 PM", amount: 80, icon: "refresh" },
  { id: "l6", label: "Call · Anand Tiwari", when: "26 Oct, 6:42 PM", amount: -770, icon: "phone" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const coinsFor = (a: (typeof AMOUNTS)[number]) => Math.round(a.rupees * (1 + a.bonus / 100));

function Coin({ size }: { size: number }) {
  return <Image src="/wallet/coin.webp" alt="" width={size} height={size} className={s.miniCoin} />;
}

/* The balance card's outline: a rounded card with its bottom-right corner
   bitten out for the Add pill (.add sits flush in that corner, its size is
   NOTCH less the gap). `d` insets the whole outline, for the inner frame, so
   its curves stay parallel. */
const NOTCH = { w: 150, h: 58 };
function cardOutline(w: number, h: number, d: number) {
  const r = 32 - d; // the card's outer corners
  const lip = 22 - d; // where the notch meets the card's edges
  const bite = 29 + d; // inside the notch, round the pill
  const right = w - d;
  const bottom = h - d;
  const shelf = h - NOTCH.h - d;
  const wall = w - NOTCH.w - d;
  const arc = (rad: number, x: number, y: number, sweep = 1) => `A${rad} ${rad} 0 0 ${sweep} ${x} ${y}`;
  return [
    `M${d + r} ${d}`,
    `H${right - r}`,
    arc(r, right, d + r),
    `V${shelf - lip}`,
    arc(lip, right - lip, shelf),
    `H${wall + bite}`,
    arc(bite, wall, shelf + bite, 0),
    `V${bottom - lip}`,
    arc(lip, wall - lip, bottom),
    `H${d + r}`,
    arc(r, d, bottom - r),
    `V${d + r}`,
    arc(r, d + r, d),
    "Z",
  ].join("");
}

/* Drawn rather than styled: CSS can't run a border round a bite. It follows
   the card's real size, starting from its usual one so the first paint fits. */
function CardShape() {
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 353, h: 226 });
  const id = useId();

  useLayoutEffect(() => {
    const card = svg.current?.parentElement;
    if (!card) return;
    const measure = () => setSize({ w: card.offsetWidth, h: card.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={svg} className={s.cardShape} aria-hidden>
      <defs>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--rose-surface)" />
          <stop offset="1" stopColor="var(--faded-rose)" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.88" cy="0.3" r="0.6">
          <stop offset="0" stopColor="rgb(255 240 200 / 0.6)" />
          <stop offset="1" stopColor="rgb(255 240 200 / 0)" />
        </radialGradient>
      </defs>
      <path d={cardOutline(size.w, size.h, 0)} fill={`url(#${id}-ground)`} />
      <path d={cardOutline(size.w, size.h, 0)} fill={`url(#${id}-glow)`} />
      <path d={cardOutline(size.w, size.h, 0.75)} fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" />
      <path d={cardOutline(size.w, size.h, 5.5)} fill="none" stroke="color-mix(in srgb, var(--antique-gold) 45%, transparent)" />
    </svg>
  );
}

/* Wallet: the balance on a card from a fanned stack, with a minted Sarv Coin
   standing on it and a + to add more; then the two ways to spend (coins by the rupee, where each
   tier shows that much more gold, or AI Question packs); then every coin in
   and out. */
export function Wallet() {
  const [tab, setTab] = useState<"coins" | "packs">("coins");
  const [amount, setAmount] = useState(AMOUNTS[2]);
  const gst = Math.round(amount.rupees * GST);
  const choices = useRef<HTMLDivElement>(null);

  /* The card's +: bring up the amounts */
  function addCoins() {
    setTab("coins");
    const motion = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    choices.current?.scrollIntoView({ behavior: motion, block: "start" });
  }

  return (
    <main className="page">
      <ScreenHeader title="Wallet" eyebrow="Sarv Coins and AI Questions" back="/profile" />

      <section className={`${s.fan} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-label="Balance">
        <span className={s.backCard} data-card="gold" aria-hidden />
        <span className={s.backCard} data-card="rose" aria-hidden />
        <div className={s.card}>
          <CardShape />
          <p className={`eyebrow ${s.cardLabel}`}>Your balance</p>
          <p className={s.value}>{BALANCE.coins}</p>
          <p className={s.unit}>Sarv Coins</p>
          <button type="button" className={s.aiChip} onClick={() => setTab("packs")}>
            <strong>{BALANCE.ai}</strong> AI Questions
            <Icon name="chevron" size={14} />
          </button>
          <p className={s.note}>
            <Icon name="info" size={14} />1 coin = ₹1 · Unused call minutes are refunded
          </p>
          <Image src="/wallet/balance.webp" alt="" width={172} height={129} priority className={s.cardArt} />
          <button type="button" className={`${s.add} pressable`} onClick={addCoins}>
            <span className={s.addPlus} aria-hidden>
              <Icon name="plus" size={18} />
            </span>
            Add coins
          </button>
        </div>
      </section>

      <div ref={choices} className={`${s.tabs} rise`} style={{ "--stagger": 2 } as CSSProperties}>
        <Segmented
          label="Add"
          options={[
            { id: "coins", label: "Add coins" },
            { id: "packs", label: "AI packs" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === "coins" ? (
        <section className={s.panel} aria-label="Add coins">
          <div className={s.amounts} role="radiogroup" aria-label="Amount">
            {AMOUNTS.map((a) => (
              <button key={a.rupees} type="button" role="radio" aria-checked={amount === a} className={`${s.amount} pressable`} data-popular={a.popular || undefined} onClick={() => setAmount(a)}>
                {a.popular && (
                  <span className={s.ribbon}>
                    <Icon name="star" size={12} />
                    Most popular
                  </span>
                )}
                {a.bonus > 0 && <span className={s.bonus}>+{a.bonus}%</span>}
                <span className={s.rupees}>{inr(a.rupees)}</span>
                <span className={s.gets}>{coinsFor(a).toLocaleString("en-IN")} coins</span>
                <Image src={a.art} alt="" width={a.w} height={a.h} loading="eager" className={s.amountArt} />
              </button>
            ))}
          </div>
          <p className={s.breakdown}>
            <span>
              {inr(amount.rupees)} + 18% GST {inr(gst)}
            </span>
            <strong>{inr(amount.rupees + gst)}</strong>
          </p>
          <button type="button" className={`btn btn-primary ${s.pay}`} onClick={() => notify("Payments aren't part of this demo yet.")}>
            <span>
              Pay {inr(amount.rupees + gst)} · Get {coinsFor(amount).toLocaleString("en-IN")} coins
            </span>
            <span className={s.payArrow} aria-hidden>
              <Icon name="arrow" size={18} />
            </span>
          </button>
        </section>
      ) : (
        <section className={s.panel} aria-label="AI Question packs">
          <p className={s.packNote}>Each AI answer uses 1 AI Question. Packs are paid with your Sarv Coins.</p>
          <ul className={s.packs}>
            {PACKS.map((p) => (
              <li key={p.id}>
                <button type="button" className={`${s.pack} pressable`} data-unlimited={p.days ? "" : undefined} onClick={() => notify("Buying packs isn't part of this demo yet.")}>
                  <Image src={p.art} alt="" width={64} height={64} className={s.packArt} />
                  <span className={s.packText}>
                    <span className={s.packTitle}>{p.days ? `AI Unlimited · ${p.days} days` : `${p.questions} AI Questions`}</span>
                    <span className={s.packSub}>{p.save ? `Save ${p.save} coins` : p.days ? "Ask as much as you like" : "A few questions"}</span>
                  </span>
                  <span className={s.packPrice}>
                    <Coin size={18} />
                    {p.coins}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.section} aria-labelledby="wallet-history">
        <SectionHeading id="wallet-history">Recent activity</SectionHeading>
        <ul className={s.ledger}>
          {LEDGER.map((l) => (
            <li key={l.id} className={s.entry}>
              <span className={s.entryIcon} data-in={l.amount > 0 || undefined} aria-hidden>
                <Icon name={l.icon} size={18} />
              </span>
              <span className={s.entryText}>
                <span className={s.entryLabel}>{l.label}</span>
                <span className={s.entryWhen}>{l.when}</span>
              </span>
              <span className={s.entryAmount} data-in={l.amount > 0 || undefined}>
                {l.amount > 0 ? "+" : "−"}
                {Math.abs(l.amount)}
                {l.ai ? " AI" : <Coin size={16} />}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
