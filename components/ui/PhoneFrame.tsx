"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { DESKTOP } from "./desktop";
import s from "./PhoneFrame.module.css";

/* iPhone 15 Pro: a 393 × 852 screen in a 12px bezel */
const PHONE = { w: 417, h: 876 };
const MARGIN = 48; // kept clear round the phone

/* On a desktop the page is an iPhone running the app: the app itself, in an
   iframe of the same page at phone size, so every phone layout, sheet and
   popover behaves as on a device. The host page hides its own copy (see
   [data-frame] in globals.css, set before paint by app/layout.tsx); this
   keeps that in step when the window crosses the desktop breakpoint. */
const isHost = () => document.documentElement.dataset.frame === "host";

function subscribe(onChange: () => void) {
  if (self !== top) return () => {};
  const mq = matchMedia(DESKTOP);
  const sync = () => {
    if (mq.matches) document.documentElement.dataset.frame = "host";
    else delete document.documentElement.dataset.frame;
    onChange();
  };
  mq.addEventListener("change", sync);
  return () => mq.removeEventListener("change", sync);
}

export function PhoneFrame() {
  return useSyncExternalStore(subscribe, isHost, () => false) ? <Phone /> : null;
}

function Phone() {
  // ponytail: the outer URL stays where the page was opened; sync it from the iframe if links need sharing
  const [src] = useState(() => location.pathname + location.search);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => setScale(Math.min(1, (innerHeight - MARGIN) / PHONE.h, (innerWidth - MARGIN) / PHONE.w));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  return (
    <div id="phone-frame" className={s.desk}>
      <div className={s.phone} style={{ "--s": scale } as CSSProperties}>
        <span className={`${s.button} ${s.action}`} aria-hidden />
        <span className={`${s.button} ${s.volumeUp}`} aria-hidden />
        <span className={`${s.button} ${s.volumeDown}`} aria-hidden />
        <span className={`${s.button} ${s.power}`} aria-hidden />
        <div className={s.screen}>
          <iframe src={src} title="Astro" className={s.app} />
          <div className={s.statusBar} aria-hidden>
            <span className={s.time}>9:41</span>
            <span className={s.island} />
            <span className={s.icons}>
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12">
                <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.3-1.4A10.4 10.4 0 0 0 8 .6 10.4 10.4 0 0 0 .7 3.6L2 5c1.6-1.5 3.7-2.4 6-2.4Z" />
                <path d="M8 6.2c1.3 0 2.5.5 3.4 1.3l1.4-1.4A6.8 6.8 0 0 0 8 4.2c-1.8 0-3.5.7-4.8 1.9l1.4 1.4c.9-.8 2.1-1.3 3.4-1.3Z" />
                <path d="M8 9.6a1.6 1.6 0 0 1 1.1.5L8 11.4l-1.1-1.3A1.6 1.6 0 0 1 8 9.6Z" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13">
                <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
                <rect x="2" y="2" width="20" height="9" rx="2.5" />
                <path d="M25 4.5v4a2.2 2.2 0 0 0 0-4Z" fillOpacity="0.4" />
              </svg>
            </span>
          </div>
          <span className={s.homeIndicator} aria-hidden />
        </div>
      </div>
    </div>
  );
}
