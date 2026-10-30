"use client";

import { useEffect } from "react";

/* A dark top of screen needs light status icons: tells the desktop phone frame,
   or a real phone's browser bar, for as long as the screen shows */
export function useDarkStatusBar(color: string) {
  useEffect(() => {
    const host = self !== top ? parent.document.documentElement : null;
    const bar = document.querySelector('meta[name="theme-color"]');
    const was = bar?.getAttribute("content");
    if (host) host.dataset.statusBar = "light";
    bar?.setAttribute("content", color);
    return () => {
      if (host) delete host.dataset.statusBar;
      if (was) bar?.setAttribute("content", was);
    };
  }, [color]);
}
