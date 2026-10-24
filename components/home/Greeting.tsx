"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

// One string, so the snapshot is stable between renders ("part|day").
function greet(now: Date) {
  const h = now.getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const day = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  return `${part}|${day}`;
}

type Props = { name?: string; classNames: { root: string; date: string; line: string; part: string } };

/* The welcome as one sentence: "Good morning, Tanishk", with the date above.
   Server renders "Namaste" and no date; the client fills in its local time
   after hydration, so there's no mismatch (the date line keeps its height). */
export function Greeting({ name, classNames: c }: Props) {
  const [part, day] = useSyncExternalStore(noSubscribe, () => greet(new Date()), () => "Namaste|").split("|");
  return (
    <div className={c.root}>
      <p className={`eyebrow ${c.date}`}>{day || " "}</p>
      <h1 className={c.line}>
        <span className={c.part}>{part},</span> {name || "friend"}
      </h1>
    </div>
  );
}
