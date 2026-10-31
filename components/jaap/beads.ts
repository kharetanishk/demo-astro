/* The malas you can chant on. Each bead is drawn, not photographed: a lit
   sphere in the wood's or stone's colours, its surface raised by SVG noise
   (rudraksha's deep furrows, sandalwood's grain, nothing on crystal). Built
   once as a small SVG image, so a strand of them moves as cheaply as photos. */
export type Bead = {
  id: string;
  name: string;
  note: string;
  light: string;
  base: string;
  dark: string;
  texture?: "furrows" | "grain";
  mukhi?: boolean;
  glass?: boolean;
  gold?: boolean;
  special?: boolean;
};

export const BEADS: Bead[] = [
  { id: "rudraksha", name: "Rudraksha", note: "Shiva's tears: steadiness and calm", light: "#c97a4b", base: "#8a4425", dark: "#2e1206", texture: "furrows", mukhi: true },
  { id: "tulsi", name: "Tulsi", note: "Holy basil, dear to Vishnu and Krishna", light: "#f6e9c6", base: "#d6b983", dark: "#8a6837", texture: "grain" },
  { id: "sphatik", name: "Sphatik", note: "Clear quartz, cooling and pure", light: "#ffffff", base: "#e9e7ef", dark: "#9c98aa", glass: true },
  { id: "chandan", name: "Chandan", note: "Sandalwood, fragrant and soothing", light: "#f4b67c", base: "#cc7a3a", dark: "#6e3410", texture: "grain" },
  { id: "kamalgatta", name: "Kamal Gatta", note: "Lotus seed, for Lakshmi's grace", light: "#8f6638", base: "#4f3015", dark: "#160a03", texture: "grain" },
  { id: "karungali", name: "Karungali", note: "Ebony, grounding and protective", light: "#6a5a50", base: "#231b16", dark: "#030202" },
  { id: "mahadev", name: "Mahadev Rudraksha", note: "Rudraksha capped in silver and gold", light: "#d48553", base: "#8f4726", dark: "#2e1206", texture: "furrows", mukhi: true, gold: true, special: true },
  { id: "sphatikgold", name: "Sphatik Gold", note: "Crystal set with gold caps", light: "#ffffff", base: "#ece9f1", dark: "#a29db0", glass: true, gold: true, special: true },
  { id: "haldi", name: "Haldi", note: "Turmeric root, for Baglamukhi", light: "#ffd977", base: "#dc9f22", dark: "#7a4c06", texture: "furrows", special: true },
  { id: "raktchandan", name: "Rakt Chandan", note: "Red sandalwood, for Surya and Hanuman", light: "#e6a090", base: "#b4513e", dark: "#521810", texture: "grain", special: true },
];

export const bead = (id: string) => BEADS.find((b) => b.id === id) ?? BEADS[0];

const TEXTURE = {
  furrows: { noise: `baseFrequency="0.16 0.09" numOctaves="3"`, relief: 4, mix: `k1="1.4" k2="0" k3="0"` },
  grain: { noise: `baseFrequency="0.012 0.32" numOctaves="2"`, relief: 2, mix: `k1="0.55" k2="0.5" k3="0"` },
};

/* A rudraksha's mukhi: the deep grooves running pole to pole, seen on a sphere */
const MUKHI = [12, 30, 47]
  .map((rx) => `<ellipse cx="50" cy="50" rx="${rx}" ry="46" fill="none" stroke="#1e0a02" stroke-opacity="0.45" stroke-width="2.4"/>`)
  .join("");

/* One bead as an SVG data URL, on a 100 square */
export function beadSrc(b: Bead) {
  const t = b.texture && TEXTURE[b.texture];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs>
<radialGradient id="body" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="${b.light}" stop-opacity="${b.glass ? 0.95 : 1}"/><stop offset="0.5" stop-color="${b.base}" stop-opacity="${b.glass ? 0.7 : 1}"/><stop offset="1" stop-color="${b.dark}" stop-opacity="${b.glass ? 0.85 : 1}"/></radialGradient>
<radialGradient id="shine" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity="${b.glass ? 0.95 : 0.6}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="rim" cx="50%" cy="50%" r="50%"><stop offset="0.72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${b.glass ? 0.18 : 0.38}"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset="0.5" stop-color="#d8a646"/><stop offset="1" stop-color="#7a4f12"/></linearGradient>
${t ? `<filter id="tex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" ${t.noise} seed="9" result="n"/><feDiffuseLighting in="n" surfaceScale="${t.relief}" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="48"/></feDiffuseLighting><feComposite in="SourceGraphic" in2="l" operator="arithmetic" ${t.mix} k4="0"/><feComposite in2="SourceAlpha" operator="in"/></filter>` : ""}
</defs>
<circle cx="50" cy="50" r="47" fill="url(#body)"${t ? ` filter="url(#tex)"` : ""}/>
${b.glass ? `<ellipse cx="58" cy="64" rx="20" ry="13" fill="#fff" opacity="0.28"/>` : ""}
${b.mukhi ? MUKHI : ""}
<circle cx="50" cy="50" r="47" fill="url(#rim)"/>
<ellipse cx="35" cy="29" rx="${b.glass ? 15 : 17}" ry="${b.glass ? 9 : 11}" fill="url(#shine)" transform="rotate(-28 35 29)"/>
${b.gold ? `<path d="M30 9 Q50 1 70 9 L66 16 Q50 10 34 16Z M30 91 Q50 99 70 91 L66 84 Q50 90 34 84Z" fill="url(#gold)"/>` : ""}
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
