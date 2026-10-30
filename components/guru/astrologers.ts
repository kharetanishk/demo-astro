/* Demo astrologer directory until /astrologers is wired in. */
export type Astrologer = {
  id: string;
  name: string;
  title: string;
  skills: string[];
  languages: string[];
  years: number;
  rate: number; // credits a minute
  rating: number;
  sessions: string;
  status: "online" | "busy" | "offline";
  about: string;
  tone: "gold" | "rose" | "sand";
};

export const astrologers: Astrologer[] = [
  {
    id: "raghav-shastri",
    name: "Pt. Raghav Shastri",
    title: "Vedic · Prashna",
    skills: ["Vedic", "Prashna", "Career"],
    languages: ["Hindi", "Sanskrit", "English"],
    years: 18,
    rate: 25,
    rating: 4.9,
    sessions: "12.4k",
    status: "online",
    about: "Trained in the Kashi tradition, Panditji reads the chart with the question you bring, and answers plainly with remedies you can keep.",
    tone: "gold",
  },
  {
    id: "meera-joshi",
    name: "Acharya Meera Joshi",
    title: "KP · Marriage",
    skills: ["KP", "Marriage", "Matchmaking"],
    languages: ["Hindi", "Marathi"],
    years: 12,
    rate: 20,
    rating: 4.8,
    sessions: "8.1k",
    status: "online",
    about: "A KP specialist for love, marriage and family. Gentle, precise, and known for timing events to the month.",
    tone: "rose",
  },
  {
    id: "anand-tiwari",
    name: "Dr. Anand Tiwari",
    title: "Nadi · Finance",
    skills: ["Nadi", "Finance", "Career"],
    languages: ["Hindi", "English"],
    years: 22,
    rate: 35,
    rating: 4.9,
    sessions: "15.2k",
    status: "busy",
    about: "Two decades of Nadi readings for business owners and professionals: wealth, ventures and the right hour to begin.",
    tone: "sand",
  },
  {
    id: "kavya-iyer",
    name: "Kavya Iyer",
    title: "Tarot · Numerology",
    skills: ["Tarot", "Numerology", "Love"],
    languages: ["Tamil", "English"],
    years: 8,
    rate: 15,
    rating: 4.7,
    sessions: "4.6k",
    status: "online",
    about: "Reads the cards alongside your numbers for clear, kind guidance on relationships and the choices in front of you.",
    tone: "rose",
  },
  {
    id: "devdutt",
    name: "Swami Devdutt",
    title: "Vastu · Remedies",
    skills: ["Vastu", "Remedies", "Health"],
    languages: ["Hindi", "Gujarati"],
    years: 15,
    rate: 18,
    rating: 4.8,
    sessions: "6.9k",
    status: "offline",
    about: "Vastu for homes and shops, and remedies drawn from the shastras: mantras, gemstones and simple daily acts.",
    tone: "gold",
  },
];

export const astrologer = (id: string) => astrologers.find((a) => a.id === id);

export const initials = (name: string) =>
  name
    .replace(/^(Pt\.|Dr\.|Acharya|Swami)\s+/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export const STATUS_LABEL = { online: "Online", busy: "In a session", offline: "Offline" } as const;
