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

/* The rashi orbit round the Sarvadrishti eye: tilted (default) or a flat
   circle, on <html data-orbit> and in localStorage like the rest */
function setOrbit(orbit: "tilted" | "circle") {
  document.documentElement.dataset.orbit = orbit;
  try {
    localStorage.setItem("zodiac-orbit", orbit);
  } catch {}
}

const read = () => document.documentElement.dataset.style ?? "royal";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-style", "data-orbit"] });
  return () => observer.disconnect();
}

export function StyleSwitcher() {
  const current = useSyncExternalStore(subscribe, read, () => "royal");
  const label = UI_STYLES.find((st) => st.id === current)?.label ?? "Royal";
  const stack = usePracticeLayout() === "stack";
  const circle = useSyncExternalStore(subscribe, () => document.documentElement.dataset.orbit === "circle", () => false);

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
        <p className={s.heading}>Daily practice</p>
        <button type="button" role="switch" aria-checked={stack} className={s.toggle} onClick={() => setPracticeLayout(stack ? "carousel" : "stack")}>
          <span className={s.optionText}>
            <span className={s.optionLabel}>Stack</span>
            <span className={s.optionNote}>{stack ? "Every card in a row, art alternating" : "Off: toran carousel"}</span>
          </span>
          <span className={s.knob} aria-hidden />
        </button>
        <p className={s.heading}>Zodiac orbit</p>
        <button type="button" role="switch" aria-checked={circle} className={s.toggle} onClick={() => setOrbit(circle ? "tilted" : "circle")}>
          <span className={s.optionText}>
            <span className={s.optionLabel}>Circle</span>
            <span className={s.optionNote}>{circle ? "A flat ring round the eye" : "Off: tilted orbit"}</span>
          </span>
          <span className={s.knob} aria-hidden />
        </button>
      </div>
    </>
  );
}
