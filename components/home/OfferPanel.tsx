import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/ornaments";
import { ClaimButton } from "./ClaimButton";
import type { Offer } from "./offer";
import s from "./OfferPanel.module.css";

/* Compact editorial panel for the configured offer. Renders only the fields
   the offer has; the emphasis (if any) is set in display type in place. */
export function OfferPanel({ offer }: { offer: Offer }) {
  const at = offer.emphasis ? offer.heading.indexOf(offer.emphasis) : -1;
  const heading =
    at < 0 ? (
      offer.heading
    ) : (
      <>
        {offer.heading.slice(0, at)}
        <em className={s.emphasis}>{offer.emphasis}</em>
        {offer.heading.slice(at + (offer.emphasis?.length ?? 0))}
      </>
    );
  const ctaClass = `btn btn-primary ${s.cta}`;
  const notice = offer.cta.notice ?? "This offer isn't part of this demo yet.";

  if (offer.poster) {
    const { src, width, height } = offer.poster;
    const art = <Image src={src} alt="" width={width} height={height} sizes="(min-width: 500px) 460px, 100vw" loading="eager" className={s.posterImage} />;
    return (
      <aside className={s.poster} aria-labelledby={`offer-${offer.id}`} data-sweep-target>
        <h2 id={`offer-${offer.id}`} className="sr-only">
          {offer.heading}
        </h2>
        {offer.cta.href ? (
          <Link href={offer.cta.href} className={`${s.posterTarget} pressable`} aria-label={offer.cta.label}>
            {art}
          </Link>
        ) : (
          <ClaimButton label={offer.cta.label} notice={notice} className={`${s.posterTarget} pressable`}>
            {art}
          </ClaimButton>
        )}
        <span className={s.sweep} aria-hidden />
      </aside>
    );
  }

  return (
    <aside className={s.panel} aria-labelledby={`offer-${offer.id}`} data-sweep-target>
      <div className={s.copy}>
        {offer.eyebrow && <p className={`eyebrow ${s.eyebrow}`}>{offer.eyebrow}</p>}
        <h2 id={`offer-${offer.id}`} className={s.heading}>
          {heading}
        </h2>
        {offer.description && <p className={s.description}>{offer.description}</p>}
        {offer.cta.href ? (
          <Link href={offer.cta.href} className={ctaClass}>
            {offer.cta.label}
            <Icon name="arrow" size={16} />
          </Link>
        ) : (
          <ClaimButton label={offer.cta.label} notice={notice} className={ctaClass} />
        )}
      </div>
      {offer.image && <Image src={offer.image} alt="" width={88} height={88} className={s.image} />}
      <span className={s.sweep} aria-hidden />
    </aside>
  );
}
