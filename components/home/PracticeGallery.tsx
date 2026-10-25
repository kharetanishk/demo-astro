"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/ui/ornaments";
import { usePracticeLayout } from "@/components/ui/practiceLayout";
import { playSound } from "@/components/ui/sound";
import { openModule } from "./ModuleSheet";
import { ModuleVisual } from "./ModuleVisual";
import type { HomeModule } from "./modules";
import s from "./PracticeGallery.module.css";

/* Toran gallery: cards hang from a golden string and swing on their own
   pivot as they scroll, passing through a fixed frame at the centre. The
   card in the frame is "selected" and sets the screen's mood.
   Tapping a neighbour brings it to the frame; tapping the selected card, or
   the Open button below, opens the module.

   Scroll position is published once per frame as --p (in card steps); CSS
   derives each card's offset, swing and scale from it. When a new card
   lands, its glow becomes --mood on the document and the registered
   property eases the whole screen's light over to it. (Mood changes per
   card, not per frame: every full-screen gradient repaints when it moves.)

   The ring: cards are rendered three times and the gallery lives in the
   middle copy. When scrolling comes to rest in an outer copy, it jumps one
   full set back to the identical spot in the middle, so it never runs out
   in either direction and native swipe momentum and snapping are kept. */
/* Gallery geometry, shared with the CSS through custom properties so the
   string's curve and the cards' lift can't drift apart. */
const CARD_W = 184;
const CARD_GAP = 8;
const STEP = CARD_W + CARD_GAP;
const SAG = 18; // how far a card one step from centre rises, in px

/* Toran string: a parabola y = SAG·(x/STEP)², so the pivot of a card at
   offset o (in steps) sits exactly SAG·o² above the centre pivot.
   Drawn wider than any phone and clipped by its wrapper. */
const HALF = 640;
const CURVE = SAG / (STEP * STEP);
const RISE = CURVE * HALF * HALF;
const STRING_PATH = `M${-HALF} 0Q0 ${2 * RISE} ${HALF} 0`;
/* Points every `step` px along the string, with the string's angle there
   (from its slope, -2·CURVE·x), for things threaded on or hung from it. */
const along = (step: number) =>
  Array.from({ length: (2 * HALF) / step + 1 }, (_, i) => {
    const x = i * step - HALF;
    return { x, y: Number((RISE - CURVE * x * x).toFixed(2)), a: Number(((Math.atan(-2 * CURVE * x) * 180) / Math.PI).toFixed(2)) };
  });
/* Only where the string can be seen (the app column plus its gutters), so
   the rope stays a few dozen nodes, not hundreds */
const VISIBLE = 290;
const shown = (step: number) => along(step).filter((pt) => Math.abs(pt.x) <= VISIBLE);
const BEADS = shown(16);
const LINKS = shown(6);
const DROPS = shown(32);

const geometry = {
  "--card-w": `${CARD_W}px`,
  "--card-gap": `${CARD_GAP}px`,
  "--sag": `${SAG}px`,
} as CSSProperties;

const COPIES = 3;
const SETTLE_MS = 160; // fallback idle time where the scrollend event isn't supported

const setMood = (m: HomeModule) => document.documentElement.style.setProperty("--mood", m.theme?.stage ?? "var(--antique-gold)");

/* Home's modules as one stack of rows (default), or (the Carousel switch
   in the StyleSwitcher menu) as sections with this carousel; both rendered
   by ModuleSection */
export function PracticeLayout({ carousel, stack }: { carousel: ReactNode; stack: ReactNode }) {
  return usePracticeLayout() === "stack" ? stack : carousel;
}

export function PracticeGallery({ modules }: { modules: HomeModule[] }) {
  const n = modules.length;
  const slots = Array.from({ length: COPIES * n }, (_, k) => modules[k % n]);

  // k: which rendered slot is in the frame (0 … 3n-1). Starts at 0 for the
  // server render, then moves to the middle copy before first paint.
  const [k, setK] = useState(0);
  const [sheen, setSheen] = useState(false);
  const current = useRef(0);
  const track = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const step = useRef(STEP); // measured on mount and resize, never per frame
  const selected = modules[k % n];

  const measure = (el: HTMLElement) => {
    step.current = (el.firstElementChild as HTMLElement).offsetWidth + parseFloat(getComputedStyle(el).columnGap);
  };

  // A light sweeps a card when a different module lands in the frame, but
  // not when the ring silently wraps to an identical copy.
  function land(next: number) {
    if (next === current.current) return;
    const moved = next % n !== current.current % n;
    setSheen(moved);
    // Each card clinks on its chain as it swings into the frame
    if (moved) {
      playSound("chain");
      setMood(modules[next % n]);
    }
    current.current = next;
    setK(next);
  }


  function syncToScroll() {
    if (!("onscrollend" in window)) {
      clearTimeout(settle.current);
      settle.current = setTimeout(wrapToMiddle, SETTLE_MS);
    }
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = track.current;
      if (!el) return;
      const p = el.scrollLeft / step.current;
      el.style.setProperty("--p", p.toFixed(3));
      land(Math.min(COPIES * n - 1, Math.max(0, Math.round(p))));
    });
  }

  function wrapToMiddle() {
    const el = track.current;
    if (!el) return;
    const p = el.scrollLeft / step.current;
    const at = Math.round(p);
    const shift = at < n ? n : at >= 2 * n ? -n : 0;
    // Only from rest, exactly on a card: jumping mid-motion would let the
    // remaining scroll carry on from the new spot and land a card off.
    if (!shift || Math.abs(p - at) > 0.02) return;
    current.current = at + shift; // same module: no sheen
    setK(at + shift);
    el.scrollLeft += shift * step.current; // identical cards, so nothing visibly moves
  }

  // Start in the middle copy before first paint.
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    measure(el);
    el.scrollLeft = n * step.current;
    el.style.setProperty("--p", String(n));
    setMood(modules[0]);
    current.current = n;
    setK(n);
    const onResize = () => measure(el);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []); // once, on mount

  // Hand the screen's mood back when leaving Home.
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      clearTimeout(settle.current);
      document.documentElement.style.removeProperty("--mood");
    },
    [],
  );

  function select(next: number) {
    land(next);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.children[next]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }

  function open(m: HomeModule, card: Element | null | undefined) {
    if (card instanceof HTMLElement) openModule(m, card);
  }

  return (
    <div className={s.gallery} style={geometry}>
      <span className={s.stringClip} aria-hidden>
        {/* Every style's rope is drawn; CSS shows the current style's parts.
            Two layers: what hangs from the string sways, so it gets its own
            layer of plain shapes; the string, its beads and their glows stay
            still and are painted once. */}
        <svg className={s.string} width={2 * HALF} height={RISE + 6} viewBox={`${-HALF} -3 ${2 * HALF} ${RISE + 6}`} style={{ "--rise": `${RISE}px` } as CSSProperties}>
          <g className={s.drops}>
            {DROPS.map((d) => (
              <g key={d.x} className={s.drop} transform={`translate(${d.x} ${d.y}) rotate(${d.a})`}>
                {/* inner group so the sway pivots on the hook, not the svg origin */}
                <g className={s.swing}>
                  <path className={s.pennant} d="M-9 0H9L0 15Z" />
                  <path className={s.dropThread} d="M0 0V6" />
                  <circle className={s.marigold} cy="10" r="4.2" />
                  <circle className={s.marigoldHeart} cy="10" r="1.6" />
                  <path className={s.crystal} d="M0 5L3.2 11L0 19L-3.2 11Z" />
                  <path className={s.bell} d="M-3.6 13Q-3.6 6 0 5.5Q3.6 6 3.6 13Z" />
                  <circle className={s.bell} cy="14" r="1.1" />
                </g>
              </g>
            ))}
          </g>
        </svg>
        <svg className={s.string} width={2 * HALF} height={RISE + 6} viewBox={`${-HALF} -3 ${2 * HALF} ${RISE + 6}`} style={{ "--rise": `${RISE}px` } as CSSProperties}>
          <defs>
            <linearGradient id="rope-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff3cf" />
              <stop offset="0.45" stopColor="#d9b66e" />
              <stop offset="1" stopColor="#7d5c2e" />
            </linearGradient>
          </defs>
          <path className={s.cordShadow} d={STRING_PATH} />
          <path className={s.cord} d={STRING_PATH} />
          <path className={s.twist} d={STRING_PATH} />
          <g className={s.chain}>
            {LINKS.map((l, i) => (
              <ellipse key={l.x} transform={`translate(${l.x} ${l.y}) rotate(${l.a})`} rx="3.8" ry={i % 2 ? 0.9 : 2} />
            ))}
          </g>
          <g className={s.beads}>
            {BEADS.map((b) => (
              <circle key={b.x} cx={b.x} cy={b.y} r="1.8" />
            ))}
          </g>
        </svg>
      </span>
      <span className={s.frame} aria-hidden />
      <ul ref={track} className={s.track} onScroll={syncToScroll} onScrollEnd={wrapToMiddle}>
        {slots.map((m, i) => {
          const isSelected = i === k;
          // Only the middle copy is exposed to assistive tech and Tab; the
          // outer copies are visual wrap-around (still tappable).
          const isCopy = Math.floor(i / n) !== 1;
          return (
            <li
              key={`${m.id}-${Math.floor(i / n)}`}
              className={s.slot}
              aria-hidden={isCopy || undefined}
              style={{ "--i": i, "--card-bg": m.theme?.card, "--card-ink": m.theme?.ink, "--card-stage": m.theme?.stage } as CSSProperties}
            >
              <span className={s.hang}>
                <button
                  type="button"
                  className={s.card}
                  tabIndex={isCopy ? -1 : undefined}
                  data-selected={isSelected}
                  aria-current={isSelected ? "true" : undefined}
                  aria-describedby={isSelected ? "practice-detail" : undefined}
                  onClick={(e) => (isSelected ? open(m, e.currentTarget) : select(i))}
                  // Keyboard focus selects; pointer focus is left to onClick.
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && !isSelected && select(i)}
                >
                  <span className={s.plate} aria-hidden>
                    <ModuleVisual module={m} slot="plate" />
                  </span>
                  <span className={s.title}>{m.title}</span>
                  {isSelected && sheen && <span key={m.id} className={s.sheen} aria-hidden />}
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      <div className={s.detail}>
        <div className={s.dots} aria-hidden>
          {modules.map((m, i) => (
            <span key={m.id} data-active={i === k % n} />
          ))}
        </div>
        <div aria-live="polite">
          {/* key remounts the copy so it fades in on each change */}
          <p key={selected.id} id="practice-detail" className={s.description}>
            {selected.description}
          </p>
        </div>
        <button type="button" className={`btn btn-primary ${s.open}`} onClick={() => open(selected, track.current?.children[k]?.querySelector("button"))}>
          Open {selected.title}
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </div>
  );
}
