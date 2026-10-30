import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { credits, topics } from "./topics";
import s from "./AiAstrology.module.css";

/* AI Astrology: an oracle's altar up top (the art over a question you can
   just start typing), what you have left to ask, then the topics as a
   two-column mosaic of medallions, tall and short in turn. */
export function AiAstrology() {
  return (
    <main className="page">
      <ScreenHeader title="AI Astrology" eyebrow="AI Jyotishi" back="/" />

      <section className={`${s.altar} rise`} style={{ "--stagger": 1 } as CSSProperties} aria-labelledby="ai-ask">
        <Image src="/ai-astrology-new.webp" alt="" width={180} height={189} className={s.art} priority />
        <h2 id="ai-ask" className={s.altarTitle}>
          Ask your chart anything
        </h2>
        <p className={s.altarNote}>Answers read from your planets, houses and dashas.</p>
        <Link href="/ai-astrology/general" className={s.prompt}>
          <Icon name="star" size={18} className={s.promptStar} />
          <span>What does this year hold for me?</span>
          <span className={s.promptSend} aria-hidden>
            <Icon name="send" size={16} />
          </span>
        </Link>
      </section>

      <Link href="/wallet" className={`${s.balance} surface rise`} style={{ "--stagger": 2 } as CSSProperties}>
        <span className={s.balanceItem}>
          <strong>{credits.aiQuestions}</strong> AI Questions
        </span>
        <span className={s.balanceDot} aria-hidden />
        <span className={s.balanceItem}>
          <strong>{credits.balance}</strong> credits
        </span>
        <span className={s.balanceLink}>
          Buy more <Icon name="chevron" size={14} />
        </span>
      </Link>

      <section className={s.section} aria-labelledby="ai-topics">
        <SectionHeading id="ai-topics">Choose a topic</SectionHeading>
        <ul className={s.mosaic}>
          {topics.map((t, i) => (
            <li key={t.id} className="rise" style={{ "--stagger": i + 3 } as CSSProperties}>
              <Link href={`/ai-astrology/${t.id}`} className={`${s.tile} pressable`} data-tall={i % 4 === 0 || i % 4 === 3 || undefined}>
                <span className={s.glyph} aria-hidden>
                  {t.glyph}
                </span>
                <span className={s.tileTitle}>{t.label}</span>
                <span className={s.tileNote}>{t.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/ai-astrology/matchmaking" className={`${s.match} pressable rise`}>
        <span className={s.matchRings} aria-hidden>
          <span />
          <span />
        </span>
        <span className={s.matchText}>
          <span className="eyebrow">Two charts</span>
          <span className={s.matchTitle}>Match making</span>
          <span className={s.tileNote}>Ashtakoot Guna Milan, then ask about the match</span>
        </span>
        <Icon name="arrow" size={18} />
      </Link>
    </main>
  );
}
