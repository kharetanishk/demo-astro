import Image from "next/image";
import s from "./Sarvadrishti.module.css";

/* The Sarvdrishti logo: the gold eye over its wordmark, cut from the final
   artwork (1231 × 1278) at over 4× its size on screen. The eye's glint
   breathes and it blinks: gold lids, drawn as vectors so they stay sharp,
   close over the iris. The eye is decorative; the name is read. */
export function Sarvadrishti() {
  return (
    <div className={s.sarvadrishti}>
      <div className={s.lockup}>
        <span className={s.glow} aria-hidden />
        <Rays />
        <div className={s.emblem} aria-hidden>
          <Image
            src={EYE.src}
            alt=""
            width={EYE.w}
            height={EYE.h}
            unoptimized
            loading="eager"
            fetchPriority="high"
            className={s.art}
          />
          <span className={s.shine} />
          <Lids />
        </div>
        <Image
          src="/logo/sarvdrishti-wordmark.webp"
          alt="Sarvdrishti"
          width={1135}
          height={254}
          unoptimized
          loading="eager"
          className={s.wordmark}
        />
      </div>
    </div>
  );
}

/* The emblem, in its own pixels: the iris (to the dark ring round it) and
   the star at its heart */
const EYE = { src: "/logo/sarvdrishti-eye.webp", w: 514, h: 982 };
const IRIS = { x: 258, y: 588, r: 108 };
const STAR = { x: 256, y: 582 };

/* Each lid is a wide ellipse whose edge curves like a real lid's. Shut, the
   upper lid comes down past the centre and the lower one rises to it, so
   they overlap across the whole iris; open, both sit outside the clip. */
const LID = { rx: 2 * IRIS.r, ry: 130 };
const UPPER_EDGE = IRIS.y + 0.4 * IRIS.r; // the upper lid's edge, shut
const LOWER_EDGE = IRIS.y; // the lower lid's edge, shut

function Lids() {
  const upperCy = UPPER_EDGE - LID.ry;
  const lowerCy = LOWER_EDGE + LID.ry;
  return (
    <svg className={s.lids} viewBox={`0 0 ${EYE.w} ${EYE.h}`}>
      <defs>
        <clipPath id="sd-iris">
          <circle cx={IRIS.x} cy={IRIS.y} r={IRIS.r} />
        </clipPath>
        <radialGradient id="sd-glint">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#ffe2a6" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        {/* Polished gold, shaded under the brow, lit across the lid, dark in
            the crease at its edge */}
        <linearGradient id="sd-lid-upper" gradientUnits="userSpaceOnUse" x1="0" y1={IRIS.y - IRIS.r} x2="0" y2={UPPER_EDGE}>
          <stop offset="0" stopColor="#6e3a0c" />
          <stop offset="0.35" stopColor="#b97a2e" />
          <stop offset="0.72" stopColor="#f2cd7c" />
          <stop offset="0.9" stopColor="#c2843a" />
          <stop offset="1" stopColor="#5a2806" />
        </linearGradient>
        <linearGradient id="sd-lid-lower" gradientUnits="userSpaceOnUse" x1="0" y1={LOWER_EDGE} x2="0" y2={IRIS.y + IRIS.r}>
          <stop offset="0" stopColor="#5a2806" />
          <stop offset="0.1" stopColor="#b5772c" />
          <stop offset="0.4" stopColor="#ebc472" />
          <stop offset="1" stopColor="#7d4512" />
        </linearGradient>
        <filter id="sd-lid-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g clipPath="url(#sd-iris)">
        <circle className={s.glint} cx={STAR.x} cy={STAR.y} r="64" fill="url(#sd-glint)" />
        <g className={s.lidUpper}>
          {/* the shadow it casts on the iris as it comes down */}
          <ellipse cx={IRIS.x} cy={upperCy + 10} rx={LID.rx} ry={LID.ry} fill="#2a0d00" fillOpacity="0.55" filter="url(#sd-lid-shadow)" />
          <ellipse cx={IRIS.x} cy={upperCy} rx={LID.rx} ry={LID.ry} fill="url(#sd-lid-upper)" stroke="#3a1602" strokeWidth="3.5" />
          <ellipse cx={IRIS.x} cy={upperCy - 9} rx={LID.rx - 6} ry={LID.ry - 6} fill="none" stroke="#fff1c4" strokeOpacity="0.45" strokeWidth="2" />
        </g>
        <g className={s.lidLower}>
          <ellipse cx={IRIS.x} cy={lowerCy} rx={LID.rx} ry={LID.ry} fill="url(#sd-lid-lower)" stroke="#3a1602" strokeWidth="3.5" />
          <ellipse cx={IRIS.x} cy={lowerCy + 8} rx={LID.rx - 6} ry={LID.ry - 6} fill="none" stroke="#fff1c4" strokeOpacity="0.35" strokeWidth="2" />
        </g>
      </g>
    </svg>
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
    <svg className={s.rays} viewBox="-100 -100 200 200" aria-hidden>
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
