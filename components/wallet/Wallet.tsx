"use client";

import { useState, type CSSProperties } from "react";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { Segmented } from "@/components/ui/Segmented";
import s from "./Wallet.module.css";

// Demo balance, packs and ledger until /payments and /walletLedger are wired in
const BALANCE = { credits: 240, ai: 3 };
const AMOUNTS = [
  { rupees: 100, bonus: 0 },
  { rupees: 250, bonus: 5 },
  { rupees: 500, bonus: 10 },
  { rupees: 1000, bonus: 15 },
];
const GST = 0.18;
const PACKS = [
  { id: "p5", questions: 5, credits: 100 },
  { id: "p15", questions: 15, credits: 270, save: 30 },
  { id: "unl", questions: 0, credits: 499, days: 7 },
];
const LEDGER = [
  { id: "l1", label: "AI question", when: "Today, 9:12 AM", amount: -1, ai: true },
  { id: "l2", label: "Booking held · Meera Joshi", when: "Today, 8:40 AM", amount: -300 },
  { id: "l3", label: "Chat · Raghav Shastri", when: "Yesterday, 8:19 PM", amount: -350 },
  { id: "l4", label: "Top up · ₹500 + 10%", when: "Yesterday, 7:58 PM", amount: 550 },
  { id: "l5", label: "Hold released", when: "26 Oct, 6:43 PM", amount: 80 },
  { id: "l6", label: "Call · Anand Tiwari", when: "26 Oct, 6:42 PM", amount: -770 },
];

/* Wallet: the balance struck as a gold coin, then the two ways to spend on
   it (credits by the rupee, or AI Question packs), then every coin in and
   out. */
export function Wallet() {
  const [tab, setTab] = useState<"credits" | "packs">("credits");
  const [amount, setAmount] = useState(AMOUNTS[2]);
  const gst = Math.round(amount.rupees * GST);
  const credits = Math.round(amount.rupees * (1 + amount.bonus / 100));

  return (
    <main className="page">
      <ScreenHeader title="Wallet" eyebrow="Credits and AI Questions" back="/profile" />

      <section className={`${s.coin} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-label="Balance">
        <div className={s.coinFace}>
          <span className={s.coinLabel}>Balance</span>
          <span className={s.coinValue}>{BALANCE.credits}</span>
          <span className={s.coinUnit}>credits</span>
        </div>
        <div className={s.coinSide}>
          <p>
            <strong>{BALANCE.ai}</strong> AI Questions
          </p>
          <p className={s.coinNote}>1 credit = ₹1 · Unused call minutes are refunded</p>
        </div>
      </section>

      <div className={`${s.tabs} rise`} style={{ "--stagger": 2 } as CSSProperties}>
        <Segmented
          label="Add"
          options={[
            { id: "credits", label: "Add credits" },
            { id: "packs", label: "AI packs" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === "credits" ? (
        <section className={s.panel} aria-label="Add credits">
          <div className={s.amounts} role="radiogroup" aria-label="Amount">
            {AMOUNTS.map((a) => (
              <button key={a.rupees} type="button" role="radio" aria-checked={amount === a} className={`${s.amount} surface`} onClick={() => setAmount(a)}>
                {a.bonus > 0 && <span className={s.bonus}>+{a.bonus}%</span>}
                <span className={s.rupees}>₹{a.rupees.toLocaleString("en-IN")}</span>
                <span className={s.gets}>{Math.round(a.rupees * (1 + a.bonus / 100))} credits</span>
              </button>
            ))}
          </div>
          <p className={s.breakdown}>
            ₹{amount.rupees} + 18% GST ₹{gst} = <strong>₹{amount.rupees + gst}</strong>
          </p>
          <button type="button" className={`btn btn-primary ${s.pay}`} onClick={() => notify("Payments aren't part of this demo yet.")}>
            Pay ₹{amount.rupees + gst} · get {credits} credits
          </button>
        </section>
      ) : (
        <section className={s.panel} aria-label="AI Question packs">
          <p className={s.packNote}>Each AI answer uses 1 AI Question. Packs are paid with your credits.</p>
          <ul className={s.packs}>
            {PACKS.map((p) => (
              <li key={p.id}>
                <button type="button" className={`${s.pack} surface pressable`} data-unlimited={p.days ? "" : undefined} onClick={() => notify("Buying packs isn't part of this demo yet.")}>
                  <span className={s.packCount}>{p.days ? "∞" : p.questions}</span>
                  <span className={s.packText}>
                    <span className={s.packTitle}>{p.days ? `AI Unlimited · ${p.days} days` : `${p.questions} AI Questions`}</span>
                    <span className={s.packSub}>{p.save ? `Save ${p.save} credits` : p.days ? "Ask as much as you like" : "A few questions"}</span>
                  </span>
                  <span className={s.packPrice}>{p.credits}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.section} aria-labelledby="wallet-history">
        <SectionHeading id="wallet-history">History</SectionHeading>
        <ul className={`${s.ledger} surface`}>
          {LEDGER.map((l) => (
            <li key={l.id} className={s.entry}>
              <span className={s.entryIcon} data-in={l.amount > 0 || undefined} aria-hidden>
                <Icon name={l.amount > 0 ? "plus" : l.ai ? "star" : "wallet"} size={16} />
              </span>
              <span className={s.entryText}>
                <span className={s.entryLabel}>{l.label}</span>
                <span className={s.entryWhen}>{l.when}</span>
              </span>
              <span className={s.entryAmount} data-in={l.amount > 0 || undefined}>
                {l.amount > 0 ? "+" : "−"}
                {Math.abs(l.amount)}
                {l.ai && " AI"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
