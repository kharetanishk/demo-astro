"use client";

import { useSyncExternalStore } from "react";

/* Daily practice layout exploration: the toran carousel (default) or a
   collage of every card in mixed sizes. The choice lives on <html
   data-practice> (restored before paint by the script in app/layout.tsx)
   and in localStorage, like the UI style (see StyleSwitcher). */
export type PracticeLayout = "carousel" | "collage";

export const PRACTICE_KEY = "practice-layout";

const read = (): PracticeLayout => (document.documentElement.dataset.practice === "collage" ? "collage" : "carousel");

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
