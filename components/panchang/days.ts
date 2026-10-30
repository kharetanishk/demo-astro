/* Demo Panchang for three days around today, Mumbai, until the
   /panchang API is wired in. Times are minutes after midnight. */
export type Window = { name: string; from: number; to: number; good: boolean; note: string };
export type Day = {
  id: string;
  label: string;
  date: string;
  vara: { name: string; ruler: string };
  sunrise: number;
  sunset: number;
  moonrise: string;
  paksha: "Shukla" | "Krishna";
  moonLit: number; // 0..1 of the disc lit
  angas: { label: string; value: string; ends: string; note: string }[];
  windows: Window[];
};

const w = (name: string, from: number, to: number, good: boolean, note: string): Window => ({ name, from, to, good, note });

export const days: Day[] = [
  {
    id: "yesterday",
    label: "Yesterday",
    date: "Wed, 28 Oct 2026",
    vara: { name: "Budhavara", ruler: "Mercury" },
    sunrise: 6 * 60 + 33,
    sunset: 18 * 60 + 8,
    moonrise: "5:12 PM",
    paksha: "Shukla",
    moonLit: 0.94,
    angas: [
      { label: "Tithi", value: "Chaturdashi", ends: "Ends 9:41 PM", note: "Shukla Paksha" },
      { label: "Nakshatra", value: "Revati", ends: "Ends 3:06 PM", note: "Ruler · Mercury" },
      { label: "Yoga", value: "Vyaghata", ends: "Ends 11:58 AM", note: "Mixed" },
      { label: "Karana", value: "Garaja", ends: "Ends 9:20 AM", note: "Then Vanija" },
    ],
    windows: [w("Abhijit", 707, 754, true, "No Abhijit on Wednesdays by tradition"), w("Rahu Kaal", 727, 814, false, "Avoid new ventures"), w("Gulika", 640, 727, false, "Avoid auspicious work"), w("Yamaganda", 466, 553, false, "Avoid travel")],
  },
  {
    id: "today",
    label: "Today",
    date: "Thu, 29 Oct 2026",
    vara: { name: "Guruvara", ruler: "Jupiter" },
    sunrise: 6 * 60 + 33,
    sunset: 18 * 60 + 7,
    moonrise: "5:51 PM",
    paksha: "Shukla",
    moonLit: 1,
    angas: [
      { label: "Tithi", value: "Purnima", ends: "Ends 7:58 PM", note: "Full moon · Shukla" },
      { label: "Nakshatra", value: "Ashwini", ends: "Ends 1:47 PM", note: "Ruler · Ketu" },
      { label: "Yoga", value: "Harshana", ends: "Ends 9:12 AM", note: "Auspicious" },
      { label: "Karana", value: "Vishti", ends: "Ends 8:44 AM", note: "Then Bava" },
    ],
    windows: [w("Abhijit", 707, 754, true, "The best window for beginnings"), w("Rahu Kaal", 813, 900, false, "Avoid new ventures"), w("Gulika", 553, 640, false, "Avoid auspicious work"), w("Yamaganda", 379, 466, false, "Avoid travel")],
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    date: "Fri, 30 Oct 2026",
    vara: { name: "Shukravara", ruler: "Venus" },
    sunrise: 6 * 60 + 34,
    sunset: 18 * 60 + 6,
    moonrise: "6:30 PM",
    paksha: "Krishna",
    moonLit: 0.97,
    angas: [
      { label: "Tithi", value: "Pratipada", ends: "Ends 6:02 PM", note: "Krishna Paksha" },
      { label: "Nakshatra", value: "Bharani", ends: "Ends 12:21 PM", note: "Ruler · Venus" },
      { label: "Yoga", value: "Vajra", ends: "Ends 6:25 AM", note: "Then Siddhi" },
      { label: "Karana", value: "Kaulava", ends: "Ends 7:10 AM", note: "Then Taitila" },
    ],
    windows: [w("Abhijit", 706, 753, true, "The best window for beginnings"), w("Rahu Kaal", 640, 727, false, "Avoid new ventures"), w("Gulika", 466, 553, false, "Avoid auspicious work"), w("Yamaganda", 900, 987, false, "Avoid travel")],
  },
];

export const NOW = 10 * 60 + 40; // the demo's "now" on Today

export const clock = (min: number) => {
  const h = Math.floor(min / 60);
  const m = String(min % 60).padStart(2, "0");
  return `${((h + 11) % 12) + 1}:${m} ${h < 12 ? "AM" : "PM"}`;
};
