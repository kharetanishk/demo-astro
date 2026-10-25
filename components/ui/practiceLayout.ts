"use client";

import { useSyncExternalStore } from "react";

/* Home layout exploration: one stack of rows, the art alternating sides
   (default), or the sections with the toran carousel. The choice lives on
   <html data-practice> (restored before paint by the script in
   app/layout.tsx) and in localStorage, like the UI style (see StyleSwitcher). */
export type PracticeLayout = "carousel" | "stack";

export const PRACTICE_KEY = "home-layout";

const read = (): PracticeLayout => (document.documentElement.dataset.practice === "carousel" ? "carousel" : "stack");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-practice"] });
  return () => observer.disconnect();
}

export const usePracticeLayout = () => useSyncExternalStore(subscribe, read, (): PracticeLayout => "stack");

export function setPracticeLayout(layout: PracticeLayout) {
  document.documentElement.dataset.practice = layout;
  try {
    localStorage.setItem(PRACTICE_KEY, layout);
  } catch {}
}
