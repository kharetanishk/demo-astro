import type { ReactNode } from "react";
import { BackLink } from "./BackLink";
import { Icon } from "./ornaments";
import s from "./ScreenHeader.module.css";

/* The top of every inner screen: back to where you came from (or to `back`,
   its parent, when opened cold), its title under an eyebrow, and one
   optional action on the right. Tab screens (no `back`) keep the slot
   empty so the title still centres. */
export function ScreenHeader({ title, eyebrow, back, action }: { title: string; eyebrow?: string; back?: string; action?: ReactNode }) {
  return (
    <header className={`${s.header} rise`}>
      {back ? (
        <BackLink fallback={back} className="icon-btn surface">
          <Icon name="arrow" size={20} className={s.backIcon} />
        </BackLink>
      ) : (
        <span className={s.slot} aria-hidden />
      )}
      <div className={s.titles}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={s.title}>{title}</h1>
      </div>
      {action ?? <span className={s.slot} aria-hidden />}
    </header>
  );
}

/* Centred title between two gold rules, like a carved cornice (as on Home) */
export function SectionHeading({ id, children, aside }: { id: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className={s.heading}>
      <span className={s.rule} aria-hidden />
      <h2 id={id}>{children}</h2>
      <span className={s.rule} aria-hidden />
      {aside}
    </div>
  );
}
