import { Greeting } from "./Greeting";
import { OfferCarousel } from "./OfferCarousel";
import { OfferPanel } from "./OfferPanel";
import type { Offer } from "./offer";
import { Sarvadrishti } from "./Sarvadrishti";
import s from "./Sanctum.module.css";

/* The top of Home: the greeting, then the Sarvadrishti eye with the 12
   rashis in orbit around it, then the offers as a slideshow. */
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
