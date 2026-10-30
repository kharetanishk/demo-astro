"use client";

import type { CSSProperties } from "react";
import s from "./Segmented.module.css";

/* One gold thumb sliding along a porcelain track: the app's one control for
   switching between a few views of the same screen. */
export function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  const index = Math.max(0, options.findIndex((o) => o.id === value));
  return (
    <div role="radiogroup" aria-label={label} className={`${s.track} surface`} style={{ "--i": index, "--n": options.length } as CSSProperties}>
      <span className={s.thumb} aria-hidden />
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} className={s.option} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
