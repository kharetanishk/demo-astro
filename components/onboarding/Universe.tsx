"use client";

import { useEffect, useRef } from "react";
import { chart, planetArt } from "@/components/kundli/chart";
import { emblem, signs } from "@/components/rashifal/signs";
import { useDarkStatusBar } from "@/components/ui/useDarkStatusBar";
import s from "./Onboarding.module.css";

const NIGHT = "#120a0d"; // the sky's darkest, also the browser's bar while it shows

const SPRITE = 160; // a sign's sprite, in px
const BASE = 64; // its drawn size at scale 1, in CSS px
const FAR = 6.5;
const NEAR = 0.62;
const SPEED = 0.42; // depth units a second: a drift, not a rush
const ALPHA = 0.78; // a sign's brightest
const STARS = 110;
const GOLDEN_ANGLE = 2.39996; // spreads successive signs evenly round the eye

type Sign = { img: HTMLCanvasElement; x: number; y: number; z: number; rot: number; spin: number };
type Star = { x: number; y: number; z: number; age: number; size: number };

/* The sky behind the welcome: the twelve signs and nine planets drift out from behind the eye,
   past you, among slow stars. A 2D canvas of pre-drawn sprites, about 130
   drawImage calls a frame. Runs only while on screen, and holds a still frame
   for reduced motion. `vanish` marks the point it all flows from. */
export function Universe({ vanish }: { vanish: React.RefObject<HTMLElement | null> }) {
  useDarkStatusBar(NIGHT);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let f = 1;
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let alive = true;
    let turn = 0;
    let flying: Sign[] = [];
    let stars: Star[] = [];

    const dot = document.createElement("canvas");
    dot.width = dot.height = 16;
    const d = dot.getContext("2d")!;
    const glow = d.createRadialGradient(8, 8, 0, 8, 8, 8);
    glow.addColorStop(0, "rgb(255 244 214 / 1)");
    glow.addColorStop(0.3, "rgb(255 232 178 / 0.55)");
    glow.addColorStop(1, "rgb(255 232 178 / 0)");
    d.fillStyle = glow;
    d.fillRect(0, 0, 16, 16);

    // Away from the eye at every depth, so the logo always stays clear
    const launch = (sign: Sign, z: number) => {
      const a = (turn += GOLDEN_ANGLE);
      const r = 0.72 + Math.random() * 0.4;
      sign.x = Math.cos(a) * r;
      sign.y = Math.sin(a) * r * 1.25;
      sign.z = z;
      sign.rot = (Math.random() - 0.5) * 0.5;
      sign.spin = (Math.random() - 0.5) * 0.09;
    };

    // Placed by where it lands on screen, so the field stays even
    const place = (star: Star, z: number) => {
      star.x = ((Math.random() * w - cx) * z) / f;
      star.y = ((Math.random() * h - cy) * z) / f;
      star.z = z;
      star.age = 0;
      star.size = 1.6 + Math.random() * Math.random() * 5;
    };

    const measure = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      f = Math.min(w, h) * 0.5;
      const at = vanish.current?.getBoundingClientRect();
      const box = canvas.getBoundingClientRect();
      cx = at ? at.left - box.left : w / 2;
      cy = at ? at.top - box.top : h * 0.36;
      if (!stars.length) {
        stars = Array.from({ length: STARS }, () => {
          const star = { x: 0, y: 0, z: 0, age: 2, size: 1 };
          place(star, NEAR + Math.random() * (FAR - NEAR));
          star.age = 2;
          return star;
        });
      }
    };

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.z -= dt * SPEED;
        star.age += dt;
        const x = cx + (star.x * f) / star.z;
        const y = cy + (star.y * f) / star.z;
        if (star.z < NEAR || x < -8 || x > w + 8 || y < -8 || y > h + 8) {
          place(star, 3 + Math.random() * (FAR - 3));
          continue;
        }
        const size = star.size * Math.min(1.5, 1.6 / star.z + 0.4);
        ctx.globalAlpha = Math.min(1, star.age / 1.5) * Math.min(1, 0.5 + 1.2 / star.z);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(dot, x - size / 2, y - size / 2, size, size);
      }

      flying.sort((a, b) => b.z - a.z); // far first
      for (const sign of flying) {
        sign.z -= dt * SPEED;
        sign.rot += sign.spin * dt;
        if (sign.z < NEAR) launch(sign, FAR);
        const scale = (f / sign.z) * 0.0064;
        // Out of the distance slowly, and gone before it gets large
        ctx.globalAlpha = ALPHA * Math.min(1, (FAR - sign.z) / 2.5, (sign.z - NEAR) / 0.65);
        ctx.setTransform(dpr, 0, 0, dpr, (cx + (sign.x * f) / sign.z) * dpr, (cy + (sign.y * f) / sign.z) * dpr);
        ctx.rotate(sign.rot);
        ctx.scale(scale, scale);
        ctx.drawImage(sign.img, -BASE / 2, -BASE / 2, BASE, BASE);
      }
      if (!reduce && onScreen && alive) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const ro = new ResizeObserver(() => {
      measure();
      if (reduce) frame(0);
    });
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !reduce) start();
    });

    Promise.all(
      [...signs.map((x) => emblem(x.id)), ...chart.planets.map((p) => planetArt(p.name))].map(
        (src) =>
          new Promise<HTMLCanvasElement>((resolve) => {
            const img = new Image();
            const sprite = document.createElement("canvas");
            sprite.width = sprite.height = SPRITE;
            img.onload = () => {
              const g = sprite.getContext("2d")!;
              g.imageSmoothingQuality = "high";
              g.drawImage(img, 0, 0, SPRITE, SPRITE);
              resolve(sprite);
            };
            img.onerror = () => resolve(sprite);
            img.src = src;
          }),
      ),
    ).then((sprites) => {
      if (!alive) return;
      measure();
      // One of each sign and planet, shuffled so they come mixed, evenly spaced in
      // depth so the sky is never empty or crowded
      flying = [...sprites].sort(() => Math.random() - 0.5).map((img, i) => {
        const sign: Sign = { img, x: 0, y: 0, z: 0, rot: 0, spin: 0 };
        launch(sign, NEAR + (FAR - NEAR) * ((i + 0.5) / sprites.length));
        return sign;
      });
      ro.observe(canvas);
      io.observe(canvas);
      document.fonts.ready.then(() => alive && measure()); // text settling can move the eye
      if (reduce) frame(0);
      else start();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [vanish]);

  return (
    <div className={s.universe} aria-hidden>
      <canvas ref={ref} className={s.universeCanvas} />
    </div>
  );
}
