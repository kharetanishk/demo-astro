"use client";

import { useSyncExternalStore } from "react";

/* Daily practice layout exploration: the toran carousel (default) or a
   stack of rows like Seek guidance, the art alternating sides. The choice lives on <html
   data-practice> (restored before paint by the script in app/layout.tsx)
   and in localStorage, like the UI style (see StyleSwitcher). */
export type PracticeLayout = "carousel" | "stack";

export const PRACTICE_KEY = "practice-layout";

const read = (): PracticeLayout => (document.documentElement.dataset.practice === "stack" ? "stack" : "carousel");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-practice"] });
  return () => observer.disconnect();
}

export const usePracticeLayout = () => useSyncExternalStore(subscribe, read, (): PracticeLayout => "carousel");

export function setPracticeLayout(layout: PracticeLayout) {
  document.documentElement.dataset.practice = layout;
  try {
    localStorage.setItem(PRACTICE_KEY, layout);
  } catch {}
}
