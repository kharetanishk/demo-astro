"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Immersive } from "@/components/ui/Immersive";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { credits, topic as findTopic } from "./topics";
import s from "./AiChat.module.css";

type Message = { id: number; from: "you" | "ai"; text: string };

/* Until the chatbot API is wired in, every reply is the same honest sample,
   read from the demo chart, and says so. */
const sample = (topic: string) =>
  `This is a sample reading: the AI Jyotishi isn't connected in this demo.\n\nFor ${topic.toLowerCase()}, your chart's present story is your Rahu–Saturn period, running to February 2027: patient effort now, rewards that arrive late but stay. Your Simha lagna gives you presence; Saturn in your 10th asks for discipline before recognition.`;

/* The chat: the topic's starter questions stand as numbered cards until
   you ask, then the conversation takes over the screen, the composer
   docked at the bottom where the nav would be. */
export function AiChat({ topicId }: { topicId: string }) {
  const t = findTopic(topicId)!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [writing, setWriting] = useState(false);
  const [left, setLeft] = useState(credits.aiQuestions);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, writing]);

  function ask(text: string) {
    const q = text.trim();
    if (!q || writing || left === 0) return;
    setDraft("");
    setLeft((n) => n - 1);
    setMessages((m) => [...m, { id: m.length, from: "you", text: q }]);
    setWriting(true);
    timer.current = setTimeout(() => {
      setWriting(false);
      setMessages((m) => [...m, { id: m.length, from: "ai", text: sample(t.label) }]);
    }, 1600);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <main className={`page ${s.chat}`}>
      <Immersive />
      <ScreenHeader
        title={t.label}
        eyebrow="AI Jyotishi"
        back="/ai-astrology"
        action={
          <span className={s.left} aria-label={`${left} AI Questions left`}>
            {left}
            <Icon name="star" size={12} />
          </span>
        }
      />

      <section className={`${s.intro} rise`} style={{ "--stagger": 1 } as CSSProperties}>
        <span className={s.glyph} aria-hidden>
          {t.glyph}
        </span>
        <h2 className={s.introTitle}>{t.id === "general" ? "Your chart, any question" : `${t.label} insights`}</h2>
        <p className={s.introNote}>Pick a question, or write your own. Each answer uses one AI Question.</p>
      </section>

      {messages.length === 0 && (
        <ol className={s.starters} aria-label="Suggested questions">
          {t.questions.map((q, i) => (
            <li key={q} className="rise" style={{ "--stagger": i + 2 } as CSSProperties}>
              <button type="button" className={`${s.starter} surface pressable`} onClick={() => ask(q)}>
                <span className={s.starterNum} aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {q}
                <Icon name="arrow" size={16} className={s.starterArrow} />
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className={s.thread} aria-live="polite">
        {messages.map((m) =>
          m.from === "you" ? (
            <p key={m.id} className={s.you}>
              {m.text}
            </p>
          ) : (
            <div key={m.id} className={`${s.ai} surface`}>
              <p className="eyebrow">Sarvadrishti</p>
              {m.text.split("\n\n").map((p, i) => (
                <p key={i} className={i === 0 ? s.sampleNote : undefined}>
                  {p}
                </p>
              ))}
            </div>
          ),
        )}
        {writing && (
          <div className={`${s.ai} ${s.writing} surface`} aria-label="Writing">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={end} />
      </div>

      <form className={`${s.composer} surface`} onSubmit={submit}>
        <label htmlFor="ai-question" className="sr-only">
          Your question
        </label>
        <input
          id="ai-question"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={left === 0 ? "No AI Questions left" : t.id === "general" ? "Ask your question…" : `Ask about ${t.label.toLowerCase()}…`}
          disabled={left === 0}
          autoComplete="off"
        />
        <button type="submit" className={s.send} aria-label="Ask" disabled={!draft.trim() || writing || left === 0}>
          <Icon name="send" size={18} />
        </button>
      </form>
    </main>
  );
}
