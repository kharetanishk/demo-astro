"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { ScreenHeader, SectionHeading } from "@/components/ui/ScreenHeader";
import s from "./Vastu.module.css";

/* The Vastu Purusha mandala, read row by row from the north-west */
const ZONES = [
  { id: "NW", name: "Vayavya", element: "Air", ruler: "Moon · Vayu", best: "Guest room, garage, storage of finished goods", keep: "Light and airy; nothing heavy." },
  { id: "N", name: "Uttara", element: "Water", ruler: "Mercury · Kubera", best: "Living room, office, cash locker", keep: "Clutter-free; this is the zone of wealth." },
  { id: "NE", name: "Ishanya", element: "Water", ruler: "Jupiter · Shiva", best: "Puja room, meditation, water tank below ground", keep: "Open, low and clean. Never a toilet." },
  { id: "W", name: "Paschima", element: "Space", ruler: "Saturn · Varuna", best: "Dining room, children's study", keep: "Solid walls, steady routines." },
  { id: "C", name: "Brahmasthan", element: "Space", ruler: "Brahma", best: "Open courtyard or empty floor", keep: "Keep the centre free of pillars and weight." },
  { id: "E", name: "Purva", element: "Air", ruler: "Sun · Indra", best: "Main entrance, living room, windows", keep: "Let the morning sun in." },
  { id: "SW", name: "Nairutya", element: "Earth", ruler: "Rahu · Pitru", best: "Master bedroom, heavy storage", keep: "The heaviest, highest part of the home." },
  { id: "S", name: "Dakshina", element: "Fire", ruler: "Mars · Yama", best: "Bedrooms, staircase", keep: "Thick walls, fewer openings." },
  { id: "SE", name: "Agneya", element: "Fire", ruler: "Venus · Agni", best: "Kitchen, electricals", keep: "Cook facing east." },
];

const ROOMS = [
  { room: "Entrance", ideal: "N · E · NE" },
  { room: "Kitchen", ideal: "SE" },
  { room: "Master bedroom", ideal: "SW" },
  { room: "Puja space", ideal: "NE" },
];

/* Vastu AI: the home as its compass mandala. Tap a zone to learn what
   belongs there; upload a plan to have yours read room by room. */
export function Vastu() {
  const [zone, setZone] = useState("NE");
  const z = ZONES.find((x) => x.id === zone)!;

  return (
    <main className={`page ${s.vastu}`}>
      <ScreenHeader title="Vastu AI" eyebrow="Harmony for your home" back="/" />

      <button type="button" className={`${s.upload} pressable rise`} style={{ "--stagger": 1 } as CSSProperties} onClick={() => notify("Scanning a plan isn't part of this demo yet.")}>
        <Image src="/celestial-palace.webp" alt="" width={110} height={137} className={s.uploadArt} priority />
        <span className={s.uploadText}>
          <span className="eyebrow">Scan my home</span>
          <span className={s.uploadTitle}>Upload a floor plan or a photo</span>
          <span className={s.uploadNote}>We map the directions and read each room.</span>
        </span>
        <span className={s.uploadIcon} aria-hidden>
          <Icon name="upload" size={20} />
        </span>
      </button>

      <section className={s.section} aria-labelledby="vastu-mandala">
        <SectionHeading id="vastu-mandala">The nine zones</SectionHeading>
        <div className={`${s.compass} rise`} style={{ "--stagger": 2 } as CSSProperties}>
          <span className={`${s.dir} ${s.dirN}`}>N</span>
          <span className={`${s.dir} ${s.dirE}`}>E</span>
          <span className={`${s.dir} ${s.dirS}`}>S</span>
          <span className={`${s.dir} ${s.dirW}`}>W</span>
          <div className={s.mandala} role="radiogroup" aria-label="Zone">
            {ZONES.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={zone === x.id} className={s.zone} data-element={x.element} data-centre={x.id === "C" || undefined} onClick={() => setZone(x.id)}>
                <span className={s.zoneId}>{x.id === "C" ? "✦" : x.id}</span>
                <span className={s.zoneName}>{x.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div key={zone} className={`${s.detail} surface`} aria-live="polite">
          <div className={s.detailHead}>
            <h3 className={s.detailName}>{z.name}</h3>
            <span className={s.element} data-element={z.element}>
              {z.element}
            </span>
          </div>
          <p className={s.ruler}>{z.ruler}</p>
          <dl className={s.detailList}>
            <div>
              <dt>Best for</dt>
              <dd>{z.best}</dd>
            </div>
            <div>
              <dt>Keep it</dt>
              <dd>{z.keep}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={s.section} aria-labelledby="vastu-rooms">
        <SectionHeading id="vastu-rooms">Where rooms belong</SectionHeading>
        <ul className={`${s.rooms} surface`}>
          {ROOMS.map((r) => (
            <li key={r.room} className={s.room}>
              <span>{r.room}</span>
              <strong>{r.ideal}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
