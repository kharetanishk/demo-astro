/* Demo birth chart until the app's /kundli API is wired in. One native,
   kept consistent with Profile (Simha lagna, Tula rashi, Swati nakshatra):
   the houses' signs follow from the lagna, and every planet's house from
   its sign. */

export const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"] as const;

export const BHAVAS: Record<number, { name: string; what: string }> = {
  1: { name: "Tanu Bhava", what: "Self, body, personality, vitality, first impressions" },
  2: { name: "Dhana Bhava", what: "Wealth, family, speech, food, accumulated resources" },
  3: { name: "Sahaja Bhava", what: "Siblings, courage, communication, hobbies, short trips" },
  4: { name: "Sukha Bhava", what: "Mother, home, emotional roots, education, vehicles" },
  5: { name: "Putra Bhava", what: "Children, creativity, romance, intellect, past-life merit" },
  6: { name: "Ari Bhava", what: "Enemies, debts, health, service, daily routine" },
  7: { name: "Yuvati Bhava", what: "Spouse, partnerships, marriage, business alliances" },
  8: { name: "Ayur Bhava", what: "Longevity, transformation, occult, inheritance, hidden things" },
  9: { name: "Bhagya Bhava", what: "Father, dharma, fortune, higher learning, gurus, pilgrimages" },
  10: { name: "Karma Bhava", what: "Career, status, authority, public image, life's mission" },
  11: { name: "Labha Bhava", what: "Gains, income, friends, elder siblings, wishes fulfilled" },
  12: { name: "Vyaya Bhava", what: "Losses, expenses, foreign lands, solitude, liberation" },
};

export type Planet = { name: string; abbr: string; glyph: string; sign: number; degree: string; nakshatra: string; retro?: boolean; rules: string };

export const chart = {
  lagna: 5, // Simha
  ayanamsa: "Lahiri 23°53′",
  birth: { date: "14 Oct 2001", time: "6:45 AM", place: "Mumbai, IN" },
  identity: [
    { label: "Lagna", value: "Simha", note: "Ascendant", glyph: "♌", sign: "simha" },
    { label: "Rashi", value: "Tula", note: "Moon sign", glyph: "♎", sign: "tula" },
    { label: "Sun", value: "Kanya", note: "Surya rashi", glyph: "♍", sign: "kanya" },
    { label: "Nakshatra", value: "Swati", note: "Pada 3", glyph: "✦" },
  ],
  planets: [
    { name: "Sun", abbr: "Su", glyph: "☉", sign: 6, degree: "27°12′", nakshatra: "Chitra", rules: "Soul, authority, father, vitality" },
    { name: "Moon", abbr: "Mo", glyph: "☽", sign: 7, degree: "14°40′", nakshatra: "Swati", rules: "Mind, mother, emotions, comfort" },
    { name: "Mars", abbr: "Ma", glyph: "♂", sign: 11, degree: "8°05′", nakshatra: "Shatabhisha", rules: "Courage, energy, siblings, property" },
    { name: "Mercury", abbr: "Me", glyph: "☿", sign: 6, degree: "18°40′", nakshatra: "Hasta", rules: "Intellect, speech, trade, learning" },
    { name: "Jupiter", abbr: "Ju", glyph: "♃", sign: 3, degree: "22°48′", nakshatra: "Punarvasu", retro: true, rules: "Wisdom, children, fortune, teachers" },
    { name: "Venus", abbr: "Ve", glyph: "♀", sign: 6, degree: "10°31′", nakshatra: "Hasta", rules: "Love, beauty, comforts, the arts" },
    { name: "Saturn", abbr: "Sa", glyph: "♄", sign: 2, degree: "21°10′", nakshatra: "Rohini", retro: true, rules: "Discipline, karma, patience, longevity" },
    { name: "Rahu", abbr: "Ra", glyph: "☊", sign: 3, degree: "15°02′", nakshatra: "Ardra", retro: true, rules: "Ambition, foreign lands, illusion" },
    { name: "Ketu", abbr: "Ke", glyph: "☋", sign: 9, degree: "15°02′", nakshatra: "Purva Ashadha", retro: true, rules: "Detachment, past lives, liberation" },
  ] satisfies Planet[],
  /* Vimshottari, Mahadasha down to Prana; `done` is how far through it is */
  dasha: [
    { level: "Mahadasha", lord: "Rahu", from: "Mar 2019", to: "Mar 2037", done: 0.43 },
    { level: "Antardasha", lord: "Saturn", from: "Apr 2024", to: "Feb 2027", done: 0.88 },
    { level: "Pratyantar", lord: "Ketu", from: "Sep 2026", to: "Nov 2026", done: 0.62 },
    { level: "Sookshma", lord: "Venus", from: "24 Oct", to: "4 Nov", done: 0.45 },
    { level: "Prana", lord: "Sun", from: "29 Oct", to: "30 Oct", done: 0.3 },
  ],
  yogas: [
    { name: "Budha-Aditya Yoga", note: "Sun and Mercury together in the 2nd: a sharp mind, persuasive speech, wealth through intellect." },
    { name: "Dhana Yoga", note: "The lord of the 2nd joins the lord of the 11th: steady gains that build with age." },
  ],
  doshas: [
    { name: "Manglik", present: true, note: "Mars in the 7th. Match charts before marriage." },
    { name: "Kaal Sarp", present: false, note: "Planets sit on both sides of Rahu–Ketu." },
    { name: "Sade Sati", present: false, note: "Saturn is clear of your Moon sign." },
    { name: "Pitra", present: false, note: "The Sun is free of Rahu and Saturn." },
  ],
};

export const planetArt = (name: string) => `/planets/${name.toLowerCase()}.webp`;

export const signOfHouse = (house: number) => ((chart.lagna - 1 + house - 1) % 12) + 1;
export const houseOfSign = (sign: number) => ((sign - chart.lagna + 12) % 12) + 1;
export const planetsIn = (house: number) => chart.planets.filter((p) => houseOfSign(p.sign) === house);
