import Image from "next/image";
import { Greeting } from "./Greeting";
import { OfferCarousel } from "./OfferCarousel";
import { OfferPanel } from "./OfferPanel";
import type { Offer } from "./offer";
import { Sarvadrishti } from "./Sarvadrishti";
import s from "./Sanctum.module.css";

/* The Celestial Courtyard: the backdrop painting sits behind the top of
   Home (see CourtyardBackdrop). In its quiet sky: the greeting, then the
   Sarvadrishti eye with the 12 rashis in orbit around it; the offers stand
   at the balustrade below, as a slideshow. */
export function Sanctum({ name, offers }: { name?: string; offers: Offer[] }) {
  return (
    <section className={`${s.sanctum} rise`} aria-label="Welcome">
      <Greeting name={name} classNames={{ root: s.welcome, date: s.date, line: s.line, part: s.part }} />

      <Sarvadrishti />

      <OfferCarousel labels={offers.map((o) => o.heading)}>
        {offers.map((o) => (
          <OfferPanel key={o.id} offer={o} />
        ))}
      </OfferCarousel>
    </section>
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
