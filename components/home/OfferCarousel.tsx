"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import s from "./OfferCarousel.module.css";

const INTERVAL = 4500; // ms each offer stays before the next one arrives
const SWIPE = 40; // px of horizontal drag that counts as a swipe

/* Offer slideshow. Slides are stacked in one place and crossfade: the
   leaving offer fades back, the arriving one settles forward. Only opacity
   and transform animate, so it stays smooth, and it loops without ever
   rewinding. Swipe left/right (or the indicators) to change by hand.
   Autoplay pauses while hovered or focused, restarts its count after every
   change, and is off for reduced motion; a ring traces around the active
   indicator over the interval to show time to the next. */
export function OfferCarousel({ labels, children }: { labels: string[]; children: ReactNode }) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoplay || paused || n < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [autoplay, paused, index, n]);

  if (n < 2) return <>{slides}</>;

  const step = (by: number) => setIndex((i) => (i + by + n) % n);

  return (
    <section
      className={s.carousel}
      aria-roledescription="carousel"
      aria-label="Offers"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      style={{ "--interval": `${INTERVAL}ms` } as CSSProperties}
    >
      <div
        className={s.stage}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          const start = drag.current;
          drag.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
            swiped.current = true;
            step(dx < 0 ? 1 : -1);
          }
        }}
        onPointerCancel={() => (drag.current = null)}
        // A swipe that ends on a poster mustn't also count as a tap on it
        onClickCapture={(e) => {
          if (!swiped.current) return;
          swiped.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={s.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${labels[i]}`}
            data-active={i === index}
            inert={i !== index}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className={s.dots}>
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            className={s.dot}
            aria-label={`Show offer ${i + 1} of ${n}: ${label}`}
            aria-current={i === index ? "true" : undefined}
            data-running={i === index && autoplay && !paused}
            onClick={() => setIndex(i)}
          >
            {/* key restarts the ring whenever this offer comes round again */}
            <svg key={i === index ? `on-${index}` : "off"} className={s.ring} viewBox="0 0 20 20" aria-hidden>
              <circle cx="10" cy="10" r="8" pathLength="1" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}
