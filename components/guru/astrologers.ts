/* Demo astrologer directory until /astrologers is wired in. All invented. */
type Seed = {
  id: string;
  name: string;
  skills: string[];
  languages: string[];
  years: number;
  rate: number; // coins a minute
  offer?: number; // the rate for new users, when there's an offer on
  rating: number;
  orders: number;
  status: "online" | "busy" | "offline";
  gender: "Male" | "Female";
  country: "India" | "Outside India";
  tier?: "Celebrity" | "Top Choice" | "Rising Star";
  about: string;
};

export type Astrologer = Seed & { title: string; sessions: string; tone: "gold" | "rose" | "sand" };

const seeds: Seed[] = [
  { id: "raghav-shastri", name: "Pt. Raghav Shastri", skills: ["Vedic", "Prashna", "Career"], languages: ["Hindi", "Sanskrit", "English"], years: 18, rate: 25, rating: 4.9, orders: 12400, status: "online", gender: "Male", country: "India", tier: "Celebrity",
    about: "Trained in the Kashi tradition, Panditji reads the chart with the question you bring, and answers plainly with remedies you can keep." },
  { id: "meera-joshi", name: "Acharya Meera Joshi", skills: ["KP", "Marriage", "Matchmaking"], languages: ["Hindi", "Marathi"], years: 12, rate: 20, offer: 10, rating: 4.8, orders: 8100, status: "online", gender: "Female", country: "India", tier: "Top Choice",
    about: "A KP specialist for love, marriage and family. Gentle, precise, and known for timing events to the month." },
  { id: "anand-tiwari", name: "Dr. Anand Tiwari", skills: ["Nadi", "Finance", "Career"], languages: ["Hindi", "English"], years: 22, rate: 35, rating: 4.9, orders: 15200, status: "busy", gender: "Male", country: "India", tier: "Celebrity",
    about: "Two decades of Nadi readings for business owners and professionals: wealth, ventures and the right hour to begin." },
  { id: "kavya-iyer", name: "Kavya Iyer", skills: ["Tarot", "Numerology", "Love"], languages: ["Tamil", "English"], years: 8, rate: 15, offer: 5, rating: 4.7, orders: 4600, status: "online", gender: "Female", country: "India", tier: "Rising Star",
    about: "Reads the cards alongside your numbers for clear, kind guidance on relationships and the choices in front of you." },
  { id: "devdutt", name: "Swami Devdutt", skills: ["Vastu", "Remedies", "Health"], languages: ["Hindi", "Gujarati"], years: 15, rate: 18, rating: 4.8, orders: 6900, status: "offline", gender: "Male", country: "India", tier: "Top Choice",
    about: "Vastu for homes and shops, and remedies drawn from the shastras: mantras, gemstones and simple daily acts." },
  { id: "siddhi-kulkarni", name: "Siddhi Kulkarni", skills: ["Vedic", "Numerology", "Career"], languages: ["Marathi", "Hindi", "English"], years: 9, rate: 21, offer: 5, rating: 4.9, orders: 10300, status: "online", gender: "Female", country: "India", tier: "Top Choice",
    about: "Pairs your chart with your numbers to plan careers and big moves. Practical, warm, and very direct about timing." },
  { id: "harish-menon", name: "Harish Menon", skills: ["Vedic", "Prashna", "Health"], languages: ["Malayalam", "English"], years: 26, rate: 40, rating: 4.9, orders: 18700, status: "online", gender: "Male", country: "India", tier: "Celebrity",
    about: "A Kerala-school astrologer of long standing, sought out for health questions and the answers a single moment can hold." },
  { id: "tanvi-bose", name: "Tanvi Bose", skills: ["Tarot", "Psychic", "Love"], languages: ["Bengali", "Hindi", "English"], years: 6, rate: 16, offer: 5, rating: 4.6, orders: 3200, status: "online", gender: "Female", country: "India", tier: "Rising Star",
    about: "An intuitive reader with a light touch, at her best on matters of the heart and the decisions that follow them." },
  { id: "gurpreet-sandhu", name: "Gurpreet Sandhu", skills: ["Palmistry", "Face Reading", "Career"], languages: ["Punjabi", "Hindi"], years: 14, rate: 22, rating: 4.7, orders: 7400, status: "busy", gender: "Male", country: "India",
    about: "Reads palms and faces on video, in a family tradition three generations old. Especially good on work and business partners." },
  { id: "lakshmi-rao", name: "Lakshmi Rao", skills: ["Vedic", "KP", "Marriage"], languages: ["Telugu", "Kannada", "English"], years: 17, rate: 28, offer: 12, rating: 4.8, orders: 9800, status: "online", gender: "Female", country: "India", tier: "Top Choice",
    about: "Combines Parashari and KP methods for marriage timing and family questions, with remedies that fit daily life." },
  { id: "imran-qureshi", name: "Imran Qureshi", skills: ["Numerology", "Signature Reading", "Finance"], languages: ["Urdu", "Hindi", "English"], years: 11, rate: 19, rating: 4.6, orders: 4100, status: "offline", gender: "Male", country: "India",
    about: "Studies names, numbers and signatures for entrepreneurs, with small changes that are simple to make and easy to keep." },
  { id: "nisha-patel", name: "Nisha Patel", skills: ["Vastu", "Numerology", "Remedies"], languages: ["Gujarati", "Hindi", "English"], years: 10, rate: 17, offer: 5, rating: 4.7, orders: 5300, status: "online", gender: "Female", country: "Outside India", tier: "Rising Star",
    about: "Based in London, she brings Vastu to apartments and small homes where nothing can be rebuilt, and reads for families abroad." },
  { id: "omkar-deshpande", name: "Omkar Deshpande", skills: ["Vedic", "Life Coach", "Career"], languages: ["Marathi", "English"], years: 13, rate: 24, rating: 4.8, orders: 6200, status: "online", gender: "Male", country: "India",
    about: "An astrologer and certified coach who turns what the chart says into a plan you can start on this week." },
  { id: "padma-krishnan", name: "Padma Krishnan", skills: ["Nadi", "Vedic", "Health"], languages: ["Tamil", "English"], years: 28, rate: 45, rating: 5.0, orders: 21500, status: "busy", gender: "Female", country: "India", tier: "Celebrity",
    about: "One of the most sought-after Nadi readers in the south, known for her patience and for detail that surprises people." },
  { id: "arjun-sengupta", name: "Arjun Sengupta", skills: ["KP", "Prashna", "Finance"], languages: ["Bengali", "English"], years: 7, rate: 14, offer: 5, rating: 4.5, orders: 1900, status: "online", gender: "Male", country: "India", tier: "Rising Star",
    about: "A young KP analyst who is exact about money questions: when to invest, when to wait, and why." },
  { id: "rukmini-hegde", name: "Rukmini Hegde", skills: ["Palmistry", "Tarot", "Love"], languages: ["Kannada", "English"], years: 12, rate: 20, rating: 4.7, orders: 5800, status: "offline", gender: "Female", country: "India",
    about: "Blends palmistry with the cards for a gentle, thorough reading of where a relationship stands." },
  { id: "vikram-rathore", name: "Vikram Rathore", skills: ["Vedic", "Vastu", "Finance"], languages: ["Hindi", "English"], years: 20, rate: 32, rating: 4.8, orders: 11200, status: "online", gender: "Male", country: "India", tier: "Top Choice",
    about: "Advises business families on muhurat, property and Vastu, with a calm manner and a long memory for what works." },
  { id: "sana-merchant", name: "Sana Merchant", skills: ["Psychic", "Life Coach", "Love"], languages: ["Hindi", "Urdu", "English"], years: 5, rate: 13, offer: 5, rating: 4.5, orders: 1400, status: "online", gender: "Female", country: "Outside India", tier: "Rising Star",
    about: "Reads from Dubai for people far from home, on love, belonging and the pull of the place you left." },
  { id: "bhaskar-reddy", name: "Bhaskar Reddy", skills: ["Vedic", "Prashna", "Remedies"], languages: ["Telugu", "Hindi"], years: 24, rate: 30, rating: 4.9, orders: 13600, status: "offline", gender: "Male", country: "India", tier: "Top Choice",
    about: "A traditional Telugu astrologer, known for precise Prashna readings and remedies that ask little and give much." },
  { id: "isha-chawla", name: "Isha Chawla", skills: ["Tarot", "Signature Reading", "Career"], languages: ["Punjabi", "Hindi", "English"], years: 8, rate: 18, offer: 8, rating: 4.6, orders: 3700, status: "online", gender: "Female", country: "India",
    about: "Uses the cards and your handwriting to read where your work is heading and what is holding it back." },
  { id: "madhav-nair", name: "Madhav Nair", skills: ["Face Reading", "Vedic", "Health"], languages: ["Malayalam", "Tamil"], years: 19, rate: 26, rating: 4.7, orders: 6600, status: "busy", gender: "Male", country: "India",
    about: "Reads the face alongside the chart in the Kerala manner, with a particular eye for health and rest." },
  { id: "aditi-shukla", name: "Aditi Shukla", skills: ["Numerology", "Vastu", "Marriage"], languages: ["Hindi", "English"], years: 9, rate: 16, offer: 5, rating: 4.8, orders: 7900, status: "online", gender: "Female", country: "India", tier: "Top Choice",
    about: "A favourite for naming babies and choosing wedding dates, with quick, clear answers and plenty of warmth." },
  { id: "rohan-vaidya", name: "Rohan Vaidya", skills: ["KP", "Life Coach", "Career"], languages: ["Gujarati", "English"], years: 6, rate: 15, rating: 4.4, orders: 1100, status: "offline", gender: "Male", country: "Outside India",
    about: "Reads from Toronto for students and young professionals abroad, on visas, moves and first jobs." },
  { id: "gayatri-mishra", name: "Gayatri Mishra", skills: ["Vedic", "Palmistry", "Remedies"], languages: ["Hindi", "Sanskrit"], years: 31, rate: 50, rating: 5.0, orders: 26300, status: "online", gender: "Female", country: "India", tier: "Celebrity",
    about: "A Sanskrit scholar and the most senior voice on the panel. People come back to her for decades, and bring their children." },
];

const compact = (n: number) => (n < 1000 ? String(n) : `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`);
const TONES = ["gold", "rose", "sand"] as const;

export const astrologers: Astrologer[] = seeds.map((a, i) => ({
  ...a,
  title: a.skills.slice(0, 2).join(" · "),
  sessions: compact(a.orders),
  tone: TONES[i % TONES.length],
}));

export const astrologer = (id: string) => astrologers.find((a) => a.id === id);

export const initials = (name: string) =>
  name
    .replace(/^(Pt\.|Dr\.|Acharya|Swami)\s+/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export const STATUS_LABEL = { online: "Online", busy: "In a session", offline: "Offline" } as const;
