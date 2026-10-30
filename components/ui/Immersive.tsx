"use client";

import { useLayoutEffect } from "react";

/* Full-screen flows (a chat, a jaap session, onboarding) bring their own
   controls where the bottom nav would be, so they hide it while they show.
   An effect rather than a CSS :has() on the page: Next keeps visited pages
   alive but hidden, and a hidden chat would keep the nav hidden everywhere.
   React runs this cleanup when the page is hidden or left. */
export function Immersive() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.immersive = "";
    return () => {
      delete root.dataset.immersive;
    };
  }, []);
  return null;
}
