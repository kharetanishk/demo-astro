import type { Astrologer } from "./astrologers";

/* Sort & Filter: one sort, then groups of ticks. A group with everything
   ticked (or nothing) doesn't narrow the list. */
const price = (a: Astrologer) => a.offer ?? a.rate;

export const SORTS = [
  { id: "popularity", label: "Popularity", by: (a: Astrologer, b: Astrologer) => b.orders * b.rating - a.orders * a.rating },
  { id: "exp-high", label: "Experience: High to Low", by: (a: Astrologer, b: Astrologer) => b.years - a.years },
  { id: "exp-low", label: "Experience: Low to High", by: (a: Astrologer, b: Astrologer) => a.years - b.years },
  { id: "orders-high", label: "Orders: High to Low", by: (a: Astrologer, b: Astrologer) => b.orders - a.orders },
  { id: "orders-low", label: "Orders: Low to High", by: (a: Astrologer, b: Astrologer) => a.orders - b.orders },
  { id: "price-high", label: "Price: High to Low", by: (a: Astrologer, b: Astrologer) => price(b) - price(a) },
  { id: "price-low", label: "Price: Low to High", by: (a: Astrologer, b: Astrologer) => price(a) - price(b) },
  { id: "rating-high", label: "Rating: High to Low", by: (a: Astrologer, b: Astrologer) => b.rating - a.rating },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

const LANGUAGES = ["English", "Hindi", "Bengali", "Gujarati", "Kannada", "Malayalam", "Marathi", "Punjabi", "Sanskrit", "Tamil", "Telugu", "Urdu"];
export const SKILLS = ["Face Reading", "KP", "Life Coach", "Nadi", "Numerology", "Palmistry", "Prashna", "Psychic", "Signature Reading", "Tarot", "Vastu", "Vedic"];

const ALL_TIERS = "All";

export const GROUPS = [
  { id: "skill", label: "Skill", options: SKILLS.map((value) => ({ value })), bulk: "both" },
  { id: "language", label: "Language", options: LANGUAGES.map((value) => ({ value })), bulk: "clear" },
  { id: "gender", label: "Gender", options: [{ value: "Male" }, { value: "Female" }] },
  { id: "country", label: "Country", options: [{ value: "India" }, { value: "Outside India" }] },
  { id: "offer", label: "Offer", options: [{ value: "Active" }, { value: "Not Active" }] },
  {
    id: "tier",
    label: "Top Astrologers",
    options: [
      { value: "Celebrity", note: "The most followed voices on Sarvdrishti" },
      { value: "Top Choice", note: "People come back to them again and again" },
      { value: "Rising Star", note: "In high demand, with a loyal following" },
      { value: ALL_TIERS, note: "Every astrologer on the panel" },
    ],
  },
] as const satisfies readonly { id: string; label: string; options: readonly { value: string; note?: string }[]; bulk?: "both" | "clear" }[];

export type GroupId = (typeof GROUPS)[number]["id"];
export type Filters = { sort: SortId; picks: Record<GroupId, string[]> };

const everything = (id: GroupId) => (GROUPS.find((g) => g.id === id)!.options as readonly { value: string }[]).map((o) => o.value);

/* As the onboarding asks: English and Hindi, unless you say otherwise */
export const DEFAULT_FILTERS: Filters = {
  sort: "popularity",
  picks: {
    skill: everything("skill"),
    language: ["English", "Hindi"],
    gender: everything("gender"),
    country: everything("country"),
    offer: everything("offer"),
    tier: everything("tier"),
  },
};

/* Is this group narrowing the list? */
export const narrows = (filters: Filters, id: GroupId) => {
  const n = filters.picks[id].length;
  if (id === "tier" && filters.picks.tier.includes(ALL_TIERS)) return false;
  return n > 0 && n < everything(id).length;
};

/* How many things are set, for the Filter button's badge */
export const activeCount = (filters: Filters) => GROUPS.filter((g) => narrows(filters, g.id)).length + (filters.sort === "popularity" ? 0 : 1);

const passes = (a: Astrologer, filters: Filters) => {
  const pass = (id: GroupId, test: (picked: string[]) => boolean) => !narrows(filters, id) || test(filters.picks[id]);
  return (
    pass("skill", (p) => a.skills.some((x) => p.includes(x))) &&
    pass("language", (p) => a.languages.some((x) => p.includes(x))) &&
    pass("gender", (p) => p.includes(a.gender)) &&
    pass("country", (p) => p.includes(a.country)) &&
    pass("offer", (p) => p.includes(a.offer ? "Active" : "Not Active")) &&
    pass("tier", (p) => !!a.tier && p.includes(a.tier))
  );
};

export function applyFilters(list: Astrologer[], filters: Filters, query = "") {
  const q = query.trim().toLowerCase();
  const by = SORTS.find((s) => s.id === filters.sort)!.by;
  return list
    .filter((a) => passes(a, filters))
    .filter((a) => !q || [a.name, ...a.skills, ...a.languages].some((x) => x.toLowerCase().includes(q)))
    .sort(by);
}
