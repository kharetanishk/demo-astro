"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./BottomNavigation.module.css";

type Destination = { label: string; icon: string; href: string };

// Icons are enamel-and-gold PNGs in /public, shown at ICON_SIZE.
const ICON_SIZE = 30;

const destinations: Destination[] = [
  { label: "History", icon: "/history-icon.webp", href: "/history" },
  { label: "Home", icon: "/home-icon.webp", href: "/" },
  { label: "Kundli", icon: "/kundali-icon.webp", href: "/kundli" },
  { label: "Profile", icon: "/profile-icon.webp", href: "/profile" },
];

/* Lamp navigation: a lamp on the bar's top edge shines a beam down onto the
   active tab, and only that icon is lit. Switching tabs fades the old lamp
   out and the new one in while the beam sweeps across, leaning toward where
   it's going. The beam is one persistent element positioned by the active
   index, so it always starts from where it is and ends on the active tab. */
export function BottomNavigation() {
  const pathname = usePathname();
  const activeIndex = destinations.findIndex((d) => d.href === pathname);

  // Direction of the last switch (-1 left, 1 right; 0 on first render, so
  // nothing sweeps on page load). Derived during render from the change.
  const [last, setLast] = useState(activeIndex);
  const [direction, setDirection] = useState(0);
  if (last !== activeIndex) {
    setLast(activeIndex);
    setDirection(Math.sign(activeIndex - last));
  }

  return (
    <nav aria-label="Primary" className={styles.nav}>
      <div className={styles.bar} style={{ "--active": activeIndex, "--count": destinations.length, "--dir": direction } as CSSProperties}>
        {activeIndex >= 0 && (
          <span className={styles.beamClip} aria-hidden>
            <span className={styles.beam}>
              {/* Remounts on each switch so the sweep (lean + stretch) replays */}
              <span key={activeIndex} className={`${styles.light} ${direction ? styles.sweep : ""}`} />
            </span>
          </span>
        )}
        <ul className={styles.list}>
          {destinations.map((d, i) => {
            const active = i === activeIndex;
            return (
              <li key={d.label} className={styles.slot}>
                <Link href={d.href} className={`${styles.item} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}>
                  <span className={styles.lamp} aria-hidden />
                  {/* Decorative: the label names the tab */}
                  <Image src={d.icon} alt="" width={ICON_SIZE} height={ICON_SIZE} loading="eager" className={styles.icon} />
                  <span>{d.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
