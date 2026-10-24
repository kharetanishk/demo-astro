/** Artwork background tone (see [data-tone] in globals.css). */
export type Tone = "gold" | "rose" | "sand";

/* Home module catalogue. Ids are stable; add `href` when a module's route
   exists. `artwork` is a transparent PNG in /public plus how it sits in its
   frame (see ModuleVisual).

   Artwork slots:
   - "guidance" rows: 132px wide, rising above the card; any proportion.
   - "practice" gallery cards: square plate.
   - "soon" chips: 44px circle.
   - Home hero: BACKDROP_ARTWORK (2:3 painting behind the top of Home). */
export type ModuleId =
  | "ai-astrology"
  | "astro-guru"
  | "panchang"
  | "din-chakra"
  | "maala-jaap"
  | "e-puja"
  | "vastu-ai"
  | "tarot";

/* How artwork sits in its frame:
   object → whole object centred with breathing room (emblems, props)
   figure → fills the frame, anchored to its base (portraits)
   scene  → crops to fill, edges fade into the surface (landscapes) */
export type ArtworkFit = "object" | "figure" | "scene";

export const BACKDROP_ARTWORK = "/hero-bg.webp";

export type HomeModule = {
  id: ModuleId;
  title: string;
  description: string;
  tone: Tone;
  group: "guidance" | "practice";
  status: "available" | "soon";
  href?: string;
  artwork: { src: string; fit: ArtworkFit };
  /** Atmosphere, built from palette tokens:
      card  → the card's own background (also the header of its sheet)
      ink   → its title colour (contrast-checked against card)
      stage → the mood the screen takes on while it's in the frame or open */
  theme?: { card: string; ink: string; stage: string };
};

/* Shades used by the atmospheres below */
const plum = (rose: number) => `color-mix(in srgb, var(--faded-rose) ${rose}%, var(--walnut))`;
const saffron = "color-mix(in srgb, var(--antique-gold) 55%, var(--terracotta))";

export const homeModules: HomeModule[] = [
  { id: "ai-astrology", title: "AI Astrology", description: "Ask your chart anything", tone: "gold", group: "guidance", status: "available", artwork: { src: "/ai-astrology-new.webp", fit: "object" },
    // Gold leaf
    theme: { card: "radial-gradient(90% 70% at 50% 35%, color-mix(in srgb, var(--antique-gold) 40%, var(--porcelain)), var(--antique-gold))", ink: "var(--walnut)", stage: "var(--antique-gold)" } },
  { id: "astro-guru", title: "Astro Guru", description: "Speak with an astrologer", tone: "rose", group: "guidance", status: "available", artwork: { src: "/astroguru.webp", fit: "figure" },
    // Rose sandstone
    theme: { card: "linear-gradient(180deg, var(--rose-surface), var(--faded-rose))", ink: "var(--walnut)", stage: "var(--faded-rose)" } },
  { id: "panchang", title: "Panchang", description: "Tithi, nakshatra and muhurat for today", tone: "sand", group: "practice", status: "available", artwork: { src: "/panchang-manuscript.webp", fit: "object" },
    // Parchment: the bright counterpart to Tarot's night, its ring neighbour
    theme: { card: "linear-gradient(180deg, var(--porcelain), color-mix(in srgb, var(--pale-sand) 80%, var(--antique-gold)))", ink: "var(--walnut)", stage: "color-mix(in srgb, var(--pale-sand) 65%, var(--antique-gold))" } },
  { id: "din-chakra", title: "Din Chakra", description: "How the hours of your day unfold", tone: "sand", group: "practice", status: "available", artwork: { src: "/sacred-mountain-alpha.webp", fit: "scene" },
    // Dawn over the peaks
    theme: { card: "linear-gradient(180deg, var(--rose-surface), color-mix(in srgb, var(--antique-gold) 70%, var(--rose-surface)))", ink: "var(--walnut)", stage: "color-mix(in srgb, var(--antique-gold) 60%, var(--rose-surface))" } },
  { id: "maala-jaap", title: "Maala Jaap", description: "Count your chants, bead by bead", tone: "sand", group: "practice", status: "available", artwork: { src: "/mala.webp", fit: "object" },
    // Kumkum
    theme: { card: "radial-gradient(120% 90% at 50% 25%, var(--terracotta), var(--terracotta-deep))", ink: "var(--porcelain)", stage: "var(--terracotta)" } },
  { id: "e-puja", title: "E-Puja", description: "Offer rituals from anywhere", tone: "sand", group: "practice", status: "available", artwork: { src: "/diya.webp", fit: "object" },
    // Aarti glow
    theme: { card: `radial-gradient(90% 70% at 50% 35%, color-mix(in srgb, var(--antique-gold) 55%, var(--porcelain)), ${saffron})`, ink: "var(--walnut)", stage: saffron } },
  { id: "vastu-ai", title: "Vastu AI", description: "Harmony for your home", tone: "sand", group: "practice", status: "available", artwork: { src: "/celestial-palace.webp", fit: "object" },
    // Pink City
    theme: { card: "linear-gradient(180deg, color-mix(in srgb, var(--faded-rose) 45%, var(--rose-surface)), var(--faded-rose))", ink: "var(--walnut)", stage: "var(--faded-rose)" } },
  { id: "tarot", title: "Tarot", description: "Draw your cards", tone: "sand", group: "practice", status: "available", artwork: { src: "/tarot-alpha.webp", fit: "object" },
    // Celestial night
    theme: { card: `radial-gradient(110% 80% at 50% 15%, ${plum(40)}, ${plum(18)})`, ink: "var(--antique-gold)", stage: plum(45) } },
];

/* Each service's own page: the sheet that opens from its card. Copy is
   ordered as it reads: chips (at a glance), about (what it is), features
   (what you'll find), then the one action. */
export type ModuleDetail = {
  meta: string[];
  about: string;
  features: { title: string; note: string }[];
  cta: string;
};

export const moduleDetails: Record<ModuleId, ModuleDetail> = {
  "ai-astrology": {
    meta: ["Any hour", "Instant", "Hindi · English"],
    about: "Ask about love, career, health or timing, and get an answer read from your own birth chart, the moment you need it.",
    features: [
      { title: "Answers from your chart", note: "Every reply is grounded in your planets, houses and dashas." },
      { title: "Ask in your words", note: "Type or speak, in Hindi or English." },
      { title: "Private by design", note: "Your questions stay between you and the stars." },
    ],
    cta: "Ask your first question",
  },
  "astro-guru": {
    meta: ["Live now", "Call · Chat", "Verified"],
    about: "Talk one-to-one with Vedic astrologers on a call or in chat, matched to the question you bring.",
    features: [
      { title: "Verified astrologers", note: "Every guru is vetted for experience and tradition." },
      { title: "Call or chat", note: "A voice call, or a quiet chat thread at your pace." },
      { title: "Remedies that fit", note: "Mantras, gemstones and rituals suited to your chart." },
    ],
    cta: "Find an astrologer",
  },
  panchang: {
    meta: ["Daily", "Your city", "Sunrise-timed"],
    about: "The Hindu almanac for your city each day: the lunar day, the star of the moment, and the hours that favour new beginnings.",
    features: [
      { title: "Tithi and nakshatra", note: "Today's lunar day and constellation, and when each changes." },
      { title: "Muhurat", note: "Auspicious windows for travel, puja and beginnings." },
      { title: "Rahu kaal", note: "The hours to avoid, timed to your sunrise." },
    ],
    cta: "Open today's Panchang",
  },
  "din-chakra": {
    meta: ["Hourly", "Personal", "Reminders"],
    about: "Your day as a wheel of hours, each ruled by a planet. See which hours lift your work, your conversations and your rest.",
    features: [
      { title: "Planetary hours", note: "Each hour's ruling planet, from sunrise to sunrise." },
      { title: "The right hour for it", note: "The best hour for meetings, study or travel." },
      { title: "Gentle reminders", note: "A nudge before your strongest hours begin." },
    ],
    cta: "See today's wheel",
  },
  "maala-jaap": {
    meta: ["108 beads", "Haptic", "Streaks"],
    about: "A quiet counter for your mantra: a soft tap for every bead, a chime at every round, and a streak that grows with your practice.",
    features: [
      { title: "A full mala", note: "One tap per bead, a chime at each round of 108." },
      { title: "Your mantras", note: "Choose from the classics or add your own." },
      { title: "A steady practice", note: "Track your rounds and keep your streak alive." },
    ],
    cta: "Begin chanting",
  },
  "e-puja": {
    meta: ["Live", "In your name", "Prasad"],
    about: "Book a puja at a sacred temple, performed by its priests in your name and gotra, and join the rituals live from wherever you are.",
    features: [
      { title: "Temple pujas", note: "Rituals at renowned temples across India." },
      { title: "Watch it live", note: "Join the aarti as it happens, or watch it later." },
      { title: "Prasad at home", note: "Blessed prasad delivered to your door." },
    ],
    cta: "Choose a puja",
  },
  "vastu-ai": {
    meta: ["Floor-plan scan", "Room by room", "No demolition"],
    about: "Share your home's floor plan and get Vastu guidance room by room: what is in balance, and simple fixes for what isn't.",
    features: [
      { title: "Plan scan", note: "Upload a plan or a photo and we map the directions." },
      { title: "Room by room", note: "Entrance, kitchen, bedroom and puja space, each checked." },
      { title: "Simple remedies", note: "Fixes that don't mean breaking walls." },
    ],
    cta: "Scan my home",
  },
  tarot: {
    meta: ["1 or 3 cards", "Daily card", "Guided"],
    about: "Draw from a hand-painted deck and receive a reading for your question, each card's meaning read in its place.",
    features: [
      { title: "Three-card spread", note: "What has passed, what is, and what is coming." },
      { title: "Card by card", note: "Each card's meaning, read in its position." },
      { title: "A card a day", note: "One card each morning to set your intention." },
    ],
    cta: "Draw your cards",
  },
};
