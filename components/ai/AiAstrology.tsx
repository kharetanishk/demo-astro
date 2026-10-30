import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import { SheetLink } from "@/components/ui/sheet";
import { credits, MATCH, PROMPTS, topics } from "./topics";
import { TypedQuestions } from "./TypedQuestions";
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
        <SheetLink href="/ai-astrology/general" className={s.prompt} aria-label={`Ask a question, such as: ${PROMPTS[0]}`}>
          <Icon name="star" size={18} className={s.promptStar} />
          <TypedQuestions />
          <span className={s.promptSend} aria-hidden>
            <Icon name="send" size={16} />
          </span>
        </SheetLink>
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
              <SheetLink href={`/ai-astrology/${t.id}`} className={`${s.tile} pressable`} data-tall={i % 4 === 0 || i % 4 === 3 || undefined}>
                <Image src={t.icon} alt="" width={60} height={60} className={s.emblem} />
                <span className={s.tileTitle}>{t.label}</span>
                <span className={s.tileNote}>{t.blurb}</span>
              </SheetLink>
            </li>
          ))}
        </ul>
      </section>

      <SheetLink href="/ai-astrology/matchmaking" className={`${s.match} pressable rise`}>
        <Image src={MATCH.icon} alt="" width={60} height={60} className={s.matchEmblem} />
        <span className={s.matchText}>
          <span className="eyebrow">Two charts</span>
          <span className={s.matchTitle}>Match making</span>
          <span className={s.tileNote}>Ashtakoot Guna Milan, then ask about the match</span>
        </span>
        <Icon name="arrow" size={18} />
      </SheetLink>
    </main>
  );
}
