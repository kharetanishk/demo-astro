import type { ReactNode } from "react";

const star = (x: number, y: number, r: number) => {
  const k = r * 0.2;
  return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
};
const spokes = (n: number, r0: number, r1: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `M${(50 + Math.cos(a) * r0).toFixed(1)} ${(50 + Math.sin(a) * r0).toFixed(1)}L${(50 + Math.cos(a) * r1).toFixed(1)} ${(50 + Math.sin(a) * r1).toFixed(1)}`;
  }).join("");

/* One engraved emblem per card, drawn rather than typed: symbol fonts turn
   some of these into coloured emoji on phones. */
export const SYMBOLS: Record<string, ReactNode> = {
  fool: (
    <>
      <path d={star(50, 36, 22)} fill="currentColor" stroke="none" />
      <path d="M18 74c10-13 22-20 32-20s22 7 32 20M30 84h40" />
    </>
  ),
  magician: (
    <>
      <path d="M50 58c-7-9-13-13-19-13a13 13 0 0 0 0 26c6 0 12-4 19-13s13-13 19-13a13 13 0 0 1 0 26c-6 0-12-4-19-13z" />
      <path d="M50 42V16" />
      <path d={star(50, 14, 8)} fill="currentColor" stroke="none" />
    </>
  ),
  priestess: (
    <>
      <circle cx="50" cy="50" r="14" />
      <path d="M31 30a23 23 0 0 0 0 40 21 21 0 0 1 0-40zM69 30a23 23 0 0 1 0 40 21 21 0 0 0 0-40z" fill="currentColor" stroke="none" />
    </>
  ),
  empress: (
    <>
      <circle cx="50" cy="38" r="17" />
      <path d="M50 55v30M37 72h26" />
      <path d={star(50, 38, 7)} fill="currentColor" stroke="none" />
    </>
  ),
  emperor: (
    <>
      <path d="M22 68 17 32l18 14 15-24 15 24 18-14-5 36z" />
      <path d="M22 78h56" />
      <path d={star(50, 54, 7)} fill="currentColor" stroke="none" />
    </>
  ),
  lovers: (
    <>
      <path d="M40 72C24 60 18 51 18 42a12 12 0 0 1 22-7 12 12 0 0 1 22 7c0 9-6 18-22 30z" />
      <path d="M62 80C50 71 45 64 45 57a10 10 0 0 1 17-6 10 10 0 0 1 17 6c0 7-5 14-17 23z" fill="currentColor" stroke="none" opacity="0.85" />
    </>
  ),
  chariot: (
    <>
      <circle cx="30" cy="70" r="11" />
      <circle cx="70" cy="70" r="11" />
      <path d="M41 70h18M22 54h56L68 30H32zM50 30V14" />
      <path d={star(50, 13, 7)} fill="currentColor" stroke="none" />
    </>
  ),
  strength: (
    <path d="M50 14c5 13 19 21 19 39a19 19 0 0 1-38 0c0-9 5-14 9-19 1 6 3 9 6 10 0-11 0-20 4-30zM50 58c3 4 7 6 7 12a7 7 0 0 1-14 0c0-6 4-8 7-12zM28 86h44" />
  ),
  hermit: (
    <>
      <path d="M38 34h24l5 34a5 5 0 0 1-5 6H38a5 5 0 0 1-5-6zM42 34c0-14 16-14 16 0M50 74v12" />
      <path d={star(50, 54, 10)} fill="currentColor" stroke="none" />
    </>
  ),
  wheel: (
    <>
      <circle cx="50" cy="50" r="33" />
      <circle cx="50" cy="50" r="9" />
      <path d={spokes(8, 9, 33)} />
      <path d={spokes(8, 33, 40)} />
    </>
  ),
  star: (
    <>
      <path d={star(50, 46, 32)} fill="currentColor" stroke="none" />
      <path d={star(21, 20, 7)} fill="currentColor" stroke="none" />
      <path d={star(79, 20, 7)} fill="currentColor" stroke="none" />
      <path d={star(24, 78, 6)} fill="currentColor" stroke="none" />
      <path d={star(76, 78, 6)} fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="50" cy="50" r="17" fill="currentColor" stroke="none" />
      <path d={spokes(16, 23, 38)} />
    </>
  ),
};

export function Symbol({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {SYMBOLS[name]}
    </svg>
  );
}
