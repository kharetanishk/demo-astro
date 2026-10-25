import type { CSSProperties } from "react";
import Image from "next/image";
import s from "./Sarvadrishti.module.css";
import { ZodiacOrbit } from "./ZodiacOrbit";

/* The Sarvadrishti eye, the app's own artwork (Sarvadrishti-AI-App-v2
   assets/hero/centerpiece), with its 12 rashi medallions travelling a tilted
   orbit round it: behind it across the top, in front of it across the
   bottom (or a flat ring round it, see [data-orbit]). The eye stands still;
   its glint breathes, it blinks; the Tripundra glows and catches a passing
   light. Decorative only. */
export function Sarvadrishti() {
  return (
    <div className={s.stage} aria-hidden>
      <span className={s.glow} />
      <Rays />
      <OrbitHalf className={s.ringBack} d="M-100 0A100 100 0 0 1 100 0" />
      <ZodiacOrbit />
      <span className={s.shadow} />
      <div className={s.emblem}>
        <Talisman />
      </div>
      <OrbitHalf className={s.ringFront} d="M100 0A100 100 0 0 1 -100 0" />
    </div>
  );
}

const ART = "/sarvadrishti.webp";

/* Talisman geometry, in the artwork's source pixels (1275 × 2003): the
   eye opening (a lens) and the iris */
const SRC = { w: 1275, h: 2003 };
const OPEN = { cx: 660, cy: 1195, h: 580, kx: 340, ky: 265 };
const IRIS = { x: 660, y: 1220 };
const OPEN_PATH =
  `M${OPEN.cx},${OPEN.cy - OPEN.h}C${OPEN.cx - OPEN.kx},${OPEN.cy - OPEN.ky} ${OPEN.cx - OPEN.kx},${OPEN.cy + OPEN.ky} ${OPEN.cx},${OPEN.cy + OPEN.h}` +
  `C${OPEN.cx + OPEN.kx},${OPEN.cy + OPEN.ky} ${OPEN.cx + OPEN.kx},${OPEN.cy - OPEN.ky} ${OPEN.cx},${OPEN.cy - OPEN.h}Z`;

/* 8-pointed star with valleys between the points (the eye's glint) */
const GLINT = Array.from({ length: 16 }, (_, n) => {
  const a = ((n * 22.5 - 90) * Math.PI) / 180;
  const r = n % 4 === 0 ? 150 : n % 2 === 0 ? 86 : 20;
  return `${(IRIS.x + r * Math.cos(a)).toFixed(1)},${(IRIS.y + r * Math.sin(a)).toFixed(1)}`;
}).join("L");

/* The artwork, its face washed lightly in the theme with a Faded Rose
   iris, lit for metal (see .gloss, .shine), plus: a kumkum glow behind the Tripundra and a light sweeping
   its bands (masked by the artwork itself, so only the bands' own pixels
   light up), the glint, and the lids (clipped to the eye opening, over the
   glint so it vanishes on a blink). */
function Talisman() {
  return (
    <div
      className={s.talisman}
      style={{ "--art": `url(${ART})` } as CSSProperties}
    >
      <div className={s.face}>
        <span className={s.kumkum} />
        <span className={s.rim} />
        <span className={s.outline} />
        {/* unoptimized: the same file is every mask, so it loads once */}
        <Image
          src={ART}
          alt=""
          width={SRC.w}
          height={SRC.h}
          unoptimized
          loading="eager"
          fetchPriority="high"
          className={s.art}
        />
        <span className={s.tint} />
        <span className={s.iris} />
        <span className={s.gloss} />
        <span className={s.shine} />
        <span className={s.tripundra} />
        <svg className={s.eye} viewBox={`0 0 ${SRC.w} ${SRC.h}`}>
          <defs>
            <clipPath id="sd-open">
              <path d={OPEN_PATH} />
            </clipPath>
            <radialGradient id="sd-halo">
              <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffe6a8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sd-lid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ecd08f" />
              <stop offset="1" stopColor="#ad8240" />
            </linearGradient>
            <linearGradient
              id="sd-lid-up"
              href="#sd-lid"
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            />
          </defs>
          <g clipPath="url(#sd-open)">
            <g className={s.glint}>
              <circle cx={IRIS.x} cy={IRIS.y} r="120" fill="url(#sd-halo)" />
              <path d={`M${GLINT}Z`} fill="#fff8e0" fillOpacity="0.9" />
            </g>
            <rect
              x="0"
              y={OPEN.cy - OPEN.h}
              width={SRC.w}
              height={OPEN.h}
              fill="url(#sd-lid)"
              className={`${s.lid} ${s.lidTop}`}
            />
            <rect
              x="0"
              y={OPEN.cy}
              width={SRC.w}
              height={OPEN.h}
              fill="url(#sd-lid-up)"
              className={`${s.lid} ${s.lidBottom}`}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* 24 tapered sun rays behind the eye, turning slowly */
const RAYS = Array.from({ length: 24 }, (_, i) => {
  const a = ((i * 15 - 90) * Math.PI) / 180;
  const [r0, r1, w] = [30, i % 3 === 0 ? 96 : 76, i % 3 === 0 ? 0.06 : 0.045];
  const p = (r: number, da: number) =>
    `${(r * Math.cos(a + da)).toFixed(1)},${(r * Math.sin(a + da)).toFixed(1)}`;
  return `M${p(r0, -w)}L${p(r1, 0)}L${p(r0, w)}Z`;
}).join("");

function Rays() {
  return (
    <svg className={s.rays} viewBox="-100 -100 200 200">
      <defs>
        <radialGradient id="sd-ray" r="0.5">
          <stop offset="0.3" className={s.rayLit} />
          <stop offset="1" className={s.rayFade} />
        </radialGradient>
      </defs>
      <path d={RAYS} fill="url(#sd-ray)" />
    </svg>
  );
}

/* Half of the orbit's track, stretched to the ellipse's box */
function OrbitHalf({ className, d }: { className: string; d: string }) {
  return (
    <svg
      className={`${s.orbit} ${className}`}
      viewBox="-100 -100 200 200"
      preserveAspectRatio="none"
    >
      <path d={d} className={s.track} />
      <path d={d} className={s.trail} />
    </svg>
  );
}
