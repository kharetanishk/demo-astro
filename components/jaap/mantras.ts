/* Mantras from v2's src/data/mantras.ts, with the English prose the app
   shows beside them. Counts are demo progress until /japa is wired in. */
export type Mantra = { id: string; name: string; deity: string; glyph: string; dev: string; tr: string; meaning: string; bestTime: string; chanted: number };

export const MALA = 108;

export const mantras: Mantra[] = [
  { id: "shiva", name: "Panchakshari", deity: "Shiva", glyph: "ॐ", dev: "ॐ नमः शिवाय", tr: "Om Namah Shivaya", meaning: "I bow to Shiva, the auspicious one, the self within.", bestTime: "Dawn or Monday evenings", chanted: 4212 },
  { id: "gayatri", name: "Gayatri", deity: "Savitr", glyph: "☉", dev: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्", tr: "Om bhur bhuvah svah · tat savitur varenyam · bhargo devasya dhimahi · dhiyo yo nah prachodayat", meaning: "We meditate on the radiance of the divine sun; may it awaken our minds.", bestTime: "Sunrise, noon and sunset", chanted: 1080 },
  { id: "harekrishna", name: "Mahamantra", deity: "Krishna", glyph: "✿", dev: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे\nहरे राम हरे राम राम राम हरे हरे", tr: "Hare Krishna Hare Krishna · Krishna Krishna Hare Hare · Hare Rama Hare Rama · Rama Rama Hare Hare", meaning: "A call to the divine, by its names, to draw the mind into devotion.", bestTime: "Any time; Brahma muhurta is best", chanted: 648 },
  { id: "mrityunjaya", name: "Mahamrityunjaya", deity: "Shiva", glyph: "☽", dev: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्", tr: "Om tryambakam yajamahe sugandhim pushti-vardhanam · urvarukam iva bandhanan mrityor mukshiya mamritat", meaning: "We worship the three-eyed one; may he free us from death as a ripe cucumber from its vine.", bestTime: "Mornings, for health and protection", chanted: 324 },
  { id: "ganapati", name: "Ganapati", deity: "Ganesha", glyph: "गं", dev: "ॐ गं गणपतये नमः", tr: "Om Gam Ganapataye Namah", meaning: "I bow to Ganesha, remover of obstacles, before every beginning.", bestTime: "Before new work; Wednesdays", chanted: 216 },
];

export const mantra = (id: string) => mantras.find((m) => m.id === id);

export const today = { done: 216, sankalp: 324, streak: 12, last: "shiva" };

/* Demo sadhana numbers and community, until /japa and sign-in are wired in */
export const stats = { total: 48_912, malas: 452, streak: 12, best: 31, punya: 6_840, rank: 18 };

// Mon … Sun: done, missed, or today (still open)
export const week: ("done" | "missed" | "today" | "ahead")[] = ["done", "done", "missed", "done", "done", "today", "ahead"];

export const devotees = [
  { name: "Jai Shree Ram Seva", streak: 209, jaap: 498_500 },
  { name: "Subhadip C.", streak: 266, jaap: 339_200 },
  { name: "Satender K.", streak: 104, jaap: 195_000 },
  { name: "Shubham Y.", streak: 146, jaap: 127_000 },
  { name: "Prashant C.", streak: 34, jaap: 117_100 },
];

// Sample: devotees chanting right now, shown on the session screen
export const LIVE = 1_432;
