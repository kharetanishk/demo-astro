import Image from "next/image";
import { Greeting } from "./Greeting";
import { OfferCarousel } from "./OfferCarousel";
import { OfferPanel } from "./OfferPanel";
import type { Offer } from "./offer";
import s from "./Sanctum.module.css";

/* The Celestial Courtyard: the backdrop painting sits behind the top of
   Home (see CourtyardBackdrop). In its quiet sky: the greeting, then the
   relic suspended over the rising sun inside an armillary of orbits; the
   offers stand at the balustrade below, as a slideshow. */
export function Sanctum({ name, relic, offers }: { name?: string; relic: string; offers: Offer[] }) {
  return (
    <section className={`${s.sanctum} rise`} aria-label="Welcome">
      <Greeting name={name} classNames={{ root: s.welcome, date: s.date, line: s.line, part: s.part }} />

      <div className={s.instrument} aria-hidden>
        <span className={s.glow} />
        <Orbits />
        <Image src={relic} alt="" width={96} height={144} loading="eager" fetchPriority="high" className={s.relic} />
      </div>

      <OfferCarousel labels={offers.map((o) => o.heading)}>
        {offers.map((o) => (
          <OfferPanel key={o.id} offer={o} />
        ))}
      </OfferCarousel>
    </section>
  );
}

const TICKS = Array.from({ length: 36 }, (_, i) => i * 10);

/* Armillary orbits: two tilted rings and a faint meridian with degree marks */
function Orbits() {
  return (
    <svg className={s.orbits} viewBox="-100 -100 200 200" fill="none">
      <circle r="78" className={s.meridian} />
      {TICKS.map((a) => (
        <path key={a} d={a % 30 ? "M0 -78V-75" : "M0 -78V-72"} transform={`rotate(${a})`} className={s.tick} />
      ))}
      <g transform="rotate(-16)">
        <ellipse rx="94" ry="26" />
        <circle cx="94" r="2.6" className={s.planet} />
      </g>
      <g transform="rotate(22)">
        <ellipse rx="88" ry="20" />
        <circle cx="-88" r="2" className={s.planet} />
      </g>
    </svg>
  );
}

/* The courtyard painting behind the top of Home. Full-bleed, kept at its
   own 2:3 proportion (pillars at the edges, quiet sky in the middle), fading
   into the page below the offer and tinted softly by the screen's mood. */
export function CourtyardBackdrop({ src }: { src: string }) {
  return (
    <div className={s.backdrop} aria-hidden>
      <Image src={src} alt="" fill sizes="(min-width: 500px) 500px, 100vw" loading="eager" fetchPriority="high" className={s.backdropImage} />
    </div>
  );
}
