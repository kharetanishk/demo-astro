/* Demo Din Chakra for today, sunrise to sunrise, until the hourly engine is
   wired in. The shape mirrors v2's DayChakra: each hour's score, band,
   choghadiya, hora lord, rising sign, and the factors behind the score. */
import { RASHIS, houseOfSign } from "@/components/kundli/chart";

export type Band = "peak" | "good" | "neutral" | "caution" | "low";
export type Hour = {
  index: number;
  label: string;
  short: string;
  score: number;
  band: Band;
  night: boolean;
  rahu: boolean;
  choghadiya: string;
  chogGood: boolean;
  hora: { lord: string; glyph: string };
  rising: string;
  house: number;
  bestFor: string[];
  goEasyOn: string[];
  factors: { label: string; delta: number }[];
};

export const BANDS: Record<Band, string> = { peak: "Peak", good: "Good", neutral: "Neutral", caution: "Caution", low: "Low" };

const SCORES = [74, 70, 58, 48, 66, 72, 80, 56, 38, 52, 71, 64, 68, 74, 91, 60, 44, 40, 42, 46, 52, 58, 64, 72];
const FIRST_HOUR = 6; // sunrise hour
const SUNSET_INDEX = 12;
const RAHU = new Set([7, 8]); // 1:33–3:00 PM

// Thursday: the first hora is Jupiter's, then the Chaldean order
const HORAS = [
  { lord: "Jupiter", glyph: "♃" },
  { lord: "Mars", glyph: "♂" },
  { lord: "Sun", glyph: "☉" },
  { lord: "Venus", glyph: "♀" },
  { lord: "Mercury", glyph: "☿" },
  { lord: "Moon", glyph: "☽" },
  { lord: "Saturn", glyph: "♄" },
];
const DAY_CHOG = ["Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"];
const NIGHT_CHOG = ["Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"];
const GOOD_CHOG = new Set(["Shubh", "Labh", "Amrit", "Chal"]);
const BEST: Record<string, string[]> = {
  Jupiter: ["Learning", "Finance", "Advice"],
  Mars: ["Exercise", "Property", "Bold moves"],
  Sun: ["Leadership", "Government work", "A pitch"],
  Venus: ["Art", "Romance", "Shopping"],
  Mercury: ["Writing", "Trade", "Calls"],
  Moon: ["Family", "Travel", "Rest"],
  Saturn: ["Deep work", "Service", "Old tasks"],
};
// For a Simha lagna: the Sun, Mars and Jupiter are friends
const HORA_DELTA: Record<string, number> = { Sun: 3, Mars: 2, Jupiter: 3, Moon: 1, Mercury: 0, Venus: -1, Saturn: -2 };

export const nth = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th");

const band = (score: number): Band => (score >= 85 ? "peak" : score >= 68 ? "good" : score >= 52 ? "neutral" : score >= 42 ? "caution" : "low");
const fmt = (h: number) => `${((h + 11) % 12) + 1} ${h % 24 < 12 ? "AM" : "PM"}`;

export const hours: Hour[] = SCORES.map((score, i) => {
  const h = FIRST_HOUR + i;
  const night = i >= SUNSET_INDEX;
  const chog = (night ? NIGHT_CHOG : DAY_CHOG)[Math.floor(((i % 12) * 8) / 12)];
  const hora = HORAS[i % 7];
  const risingSign = ((6 + Math.floor(i / 2)) % 12) + 1; // Tula rises at sunrise
  const rahu = RAHU.has(i);
  const b = band(score);
  return {
    index: i,
    label: `${fmt(h)} – ${fmt(h + 1)}`,
    short: fmt(h).replace(" ", ""),
    score,
    band: b,
    night,
    rahu,
    choghadiya: chog,
    chogGood: GOOD_CHOG.has(chog),
    hora,
    rising: RASHIS[risingSign - 1],
    house: houseOfSign(risingSign),
    bestFor: b === "low" ? [] : BEST[hora.lord],
    goEasyOn: [...(rahu ? ["Beginnings"] : []), ...(b === "caution" || b === "low" ? ["Signing contracts", "Big purchases"] : [])],
    factors: [
      { label: `${hora.lord} hora`, delta: HORA_DELTA[hora.lord] },
      { label: `${chog} choghadiya`, delta: GOOD_CHOG.has(chog) ? (chog === "Amrit" ? 3 : 2) : -2 },
      { label: `${RASHIS[risingSign - 1]} rising, your ${nth(houseOfSign(risingSign))}`, delta: [1, 5, 9, 10, 11].includes(houseOfSign(risingSign)) ? 2 : [6, 8, 12].includes(houseOfSign(risingSign)) ? -2 : 0 },
      ...(rahu ? [{ label: "Rahu Kaal", delta: -3 }] : []),
    ],
  };
});

export const NOW_INDEX = 4; // 10:40 AM
export const golden = hours.reduce((a, b) => (b.score > a.score ? b : a));
export const STREAK = 5;
export const WEEK = [
  { day: "Sun", date: 25, done: true },
  { day: "Mon", date: 26, done: true },
  { day: "Tue", date: 27, done: true },
  { day: "Wed", date: 28, done: true },
  { day: "Thu", date: 29, done: true, today: true },
  { day: "Fri", date: 30 },
  { day: "Sat", date: 31 },
];
