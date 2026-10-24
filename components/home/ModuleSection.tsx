import type { CSSProperties, ReactNode } from "react";
import { DemoButton } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ModuleOpener } from "./ModuleSheet";
import { ModuleVisual } from "./ModuleVisual";
import type { HomeModule } from "./modules";
import { PracticeGallery } from "./PracticeGallery";
import s from "./ModuleSection.module.css";

/* Three tiers, three forms:
   guidance → editorial rows, artwork rising out of each card (primary)
   practice → centred gallery with a focused detail (secondary, tactile)
   soon     → quiet chips (honest about availability) */
export function ModuleSection({ modules }: { modules: HomeModule[] }) {
  const guidance = modules.filter((m) => m.status === "available" && m.group === "guidance");
  const practice = modules.filter((m) => m.status === "available" && m.group === "practice");
  const soon = modules.filter((m) => m.status === "soon");

  return (
    <>
      <section className={s.section} aria-labelledby="guidance-heading">
        <SectionHeading id="guidance-heading">Seek guidance</SectionHeading>
        <ul className={s.guides}>
          {guidance.map((m, i) => (
            <li key={m.id} className="rise" style={{ "--stagger": i + 3 } as CSSProperties}>
              <ModuleTarget module={m} className={`${s.guide} pressable`}>
                <span className={s.guideText}>
                  <span className={s.guideTitle}>{m.title}</span>
                  <span className={s.guideNote}>{m.description}</span>
                  <Icon name="arrow" size={18} className={s.guideArrow} />
                </span>
                <span className={s.guideArt} aria-hidden>
                  <ModuleVisual module={m} slot="guide" />
                </span>
              </ModuleTarget>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="practice-heading">
        <SectionHeading id="practice-heading">Daily practice</SectionHeading>
        <PracticeGallery modules={practice} />
      </section>

      {soon.length > 0 && (
        <section className={s.section} aria-labelledby="soon-heading">
          <SectionHeading id="soon-heading">Arriving soon</SectionHeading>
          <ul className={s.chips}>
            {soon.map((m) => (
              <li key={m.id}>
                <ModuleTarget module={m} className={`${s.chip} surface`}>
                  <span className={s.chipArt} data-tone={m.tone} aria-hidden>
                    <ModuleVisual module={m} slot="chip" />
                  </span>
                  <span className={s.chipText}>
                    <span className={s.chipTitle}>{m.title}</span>
                    <span className={s.chipStatus}>Soon</span>
                  </span>
                </ModuleTarget>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/* Centred title between two gold rules, like a carved cornice. */
function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <div className={s.heading}>
      <span className={s.rule} aria-hidden />
      <h2 id={id}>{children}</h2>
      <span className={s.rule} aria-hidden />
    </div>
  );
}

/* Available modules open their sheet; the rest give an honest notice. */
function ModuleTarget({ module: m, className, children }: { module: HomeModule; className: string; children: ReactNode }) {
  if (m.status === "available") {
    return (
      <ModuleOpener module={m} className={className}>
        {children}
      </ModuleOpener>
    );
  }
  return (
    <DemoButton className={className} notice={`${m.title} is coming soon.`}>
      {children}
    </DemoButton>
  );
}
