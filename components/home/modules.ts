/** Artwork background tone (see [data-tone] in globals.css). */
export type Tone = "gold" | "rose" | "sand";

/* Home module catalogue. Ids are stable; add `href` when a module's route
   exists. `artwork` is a transparent PNG in /public plus how it sits in its
   frame (see ModuleVisual).

   Artwork slots:
   - "guidance" rows: 132px wide, rising above the card; any proportion.
   - "practice" gallery cards: square plate.
   - "soon" chips: 44px circle.
   - Profile cover: BACKDROP_ARTWORK (2:3 courtyard painting). */
export type ModuleId =
  | "ai-astrology"
  | "astro-guru"
  | "panchang"
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
  /** inCard: in rows, sits inside its card instead of rising out of it
      (squat art too wide to rise without crowding the text)
      float: wide art sits high in its box, its top rising out of the card
      sink: fraction of the art's height to drop below the card's bottom edge,
      where it's cut (feet or a base that would otherwise look like floating) */
  artwork: { src: string; fit: ArtworkFit; inCard?: boolean; float?: boolean; sink?: number };
  /** Atmosphere, built from palette tokens:
      card  → the card's own background (also the header of its sheet)
      ink   → its title colour (contrast-checked against card) */
  theme?: { card: string; ink: string };
};

/* Shades used by the atmospheres below */
const plum = (rose: number) => `color-mix(in srgb, var(--faded-rose) ${rose}%, var(--walnut))`;
const saffron = "color-mix(in srgb, var(--antique-gold) 55%, var(--terracotta))";

export const homeModules: HomeModule[] = [
  { id: "ai-astrology", title: "AI Astrology", description: "Ask your chart anything", tone: "gold", group: "guidance", status: "available", href: "/ai-astrology", artwork: { src: "/ai-astrology-new.webp", fit: "object" },
    // Gold leaf
    theme: { card: "radial-gradient(90% 70% at 50% 35%, color-mix(in srgb, var(--antique-gold) 40%, var(--porcelain)), var(--antique-gold))", ink: "var(--walnut)" } },
  { id: "astro-guru", title: "Astro Guru", description: "Speak with an astrologer", tone: "rose", group: "guidance", status: "available", href: "/astro-guru", artwork: { src: "/astro-guru.webp", fit: "figure" },
    // Rose sandstone
    theme: { card: "linear-gradient(180deg, var(--rose-surface), var(--faded-rose))", ink: "var(--walnut)" } },
  { id: "panchang", title: "Panchang", description: "Tithi, muhurat and your day hour by hour", tone: "sand", group: "practice", status: "available", href: "/panchang", artwork: { src: "/panchang-book.webp", fit: "object", float: true },
    // Parchment: the bright counterpart to Tarot's night, its ring neighbour
    theme: { card: "linear-gradient(180deg, var(--porcelain), color-mix(in srgb, var(--pale-sand) 80%, var(--antique-gold)))", ink: "var(--walnut)" } },
  { id: "maala-jaap", title: "Maala Jaap", description: "Count your chants, bead by bead", tone: "sand", group: "practice", status: "available", href: "/maala-jaap", artwork: { src: "/mala-jaap.webp", fit: "figure" },
    // Kumkum
    theme: { card: "radial-gradient(120% 90% at 50% 25%, var(--terracotta), var(--terracotta-deep))", ink: "var(--porcelain)" } },
  { id: "e-puja", title: "E-Puja", description: "Offer rituals from anywhere", tone: "sand", group: "practice", status: "available", href: "/e-puja", artwork: { src: "/e-puja.webp", fit: "object", sink: 0.035 },
    // Aarti glow
    theme: { card: `radial-gradient(90% 70% at 50% 35%, color-mix(in srgb, var(--antique-gold) 55%, var(--porcelain)), ${saffron})`, ink: "var(--walnut)" } },
  { id: "vastu-ai", title: "Vastu AI", description: "Harmony for your home", tone: "sand", group: "practice", status: "available", href: "/vastu-ai", artwork: { src: "/celestial-palace.webp", fit: "object" },
    // Pink City
    theme: { card: "linear-gradient(180deg, color-mix(in srgb, var(--faded-rose) 45%, var(--rose-surface)), var(--faded-rose))", ink: "var(--walnut)" } },
  { id: "tarot", title: "Tarot", description: "Draw your cards", tone: "sand", group: "practice", status: "available", href: "/tarot", artwork: { src: "/tarot-alpha.webp", fit: "object" },
    // Celestial night
    theme: { card: `radial-gradient(110% 80% at 50% 15%, ${plum(40)}, ${plum(18)})`, ink: "var(--antique-gold)" } },
];

/* Each service's own page: the sheet that opens from its card. Copy is
   ordered as it reads: chips (at a glance), about (what it is), features
   (what you'll find), then the one action. A module with no entry here has
   no sheet: its card goes straight to its screen. */
export type ModuleDetail = {
  meta: string[];
  about: string;
  features: { title: string; note: string }[];
  cta: string;
};

export const moduleDetails: Partial<Record<ModuleId, ModuleDetail>> = {
  panchang: {
    meta: ["Daily", "Your city", "Hour by hour"],
    about: "The Hindu almanac for your city each day, with Din Chakra: the lunar day, the star of the moment, and which hours lift your work, your conversations and your rest.",
    features: [
      { title: "Tithi and nakshatra", note: "Today's lunar day and constellation, and when each changes." },
      { title: "Muhurat and Rahu kaal", note: "Auspicious windows for beginnings, and the hours to avoid." },
      { title: "Din Chakra", note: "Each hour's ruling planet, and your golden hour of the day." },
    ],
    cta: "Open today's Panchang",
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
