"use client";

import { useSyncExternalStore } from "react";
import { setPracticeLayout, usePracticeLayout } from "./practiceLayout";
import s from "./StyleSwitcher.module.css";

/* UI style exploration: the same screens in five visual languages, so one
   can be chosen. The choice lives on <html data-style> (restored before
   paint by the script in app/layout.tsx) and in localStorage. Delete this
   switcher and the unchosen [data-style] blocks once a style is picked. */
const UI_STYLES = [
  { id: "royal", label: "Royal", note: "Current: sacred modern" },
  { id: "glass", label: "Glass", note: "Gilded frosted glass" },
  { id: "brutal", label: "Neubrutal", note: "Bold temple poster" },
  { id: "minimal", label: "Minimal", note: "Quiet ivory" },
  { id: "skeuo", label: "Skeuomorph", note: "Gold, wood and parchment" },
] as const;

const STYLE_KEY = "ui-style";

const read = () => document.documentElement.dataset.style ?? "royal";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-style"] });
  return () => observer.disconnect();
}

export function StyleSwitcher() {
  const current = useSyncExternalStore(subscribe, read, () => "royal");
  const label = UI_STYLES.find((st) => st.id === current)?.label ?? "Royal";
  const carousel = usePracticeLayout() === "carousel";

  function choose(id: string) {
    document.documentElement.dataset.style = id;
    try {
      localStorage.setItem(STYLE_KEY, id);
    } catch {}
    document.getElementById("ui-style-menu")?.hidePopover();
  }

  return (
    <>
      <button type="button" className={s.trigger} popoverTarget="ui-style-menu" aria-label={`UI style: ${label}. Change style`}>
        <span className={s.swatch} aria-hidden />
        {label}
      </button>
      <div id="ui-style-menu" popover="auto" className={s.menu}>
        <p className={s.heading}>UI style</p>
        <ul>
          {UI_STYLES.map((st) => (
            <li key={st.id}>
              <button type="button" className={s.option} aria-pressed={st.id === current} onClick={() => choose(st.id)}>
                <span className={s.optionLabel}>{st.label}</span>
                <span className={s.optionNote}>{st.note}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className={s.heading}>Home layout</p>
        <button type="button" role="switch" aria-checked={carousel} className={s.toggle} onClick={() => setPracticeLayout(carousel ? "stack" : "carousel")}>
          <span className={s.optionText}>
            <span className={s.optionLabel}>Carousel</span>
            <span className={s.optionNote}>{carousel ? "Daily practice on a toran carousel" : "Off: one stack of cards"}</span>
          </span>
          <span className={s.knob} aria-hidden />
        </button>
      </div>
    </>
  );
}
