"use client";

import { useLayoutEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/components/ui/demo";
import { Icon } from "@/components/ui/ornaments";
import { moduleDetails, type HomeModule } from "./modules";
import s from "./ModuleSheet.module.css";

/* A service's own page, opened from its card. The card's colour grows into
   the sheet's header while its artwork flies up into it (the same picture,
   moved), then the copy rises in from below. Closing plays it in reverse,
   back into the card it came from.

   Any card opens it with openModule(module, cardElement) (or ModuleOpener);
   the one sheet is mounted on Home. Built on a modal <dialog>: focus stays
   inside, Esc closes it, and the page behind is inert. */
type Opened = { module: HomeModule; source: HTMLElement };

let opened: Opened | null = null;
const listeners = new Set<() => void>();

export function openModule(module: HomeModule, source: HTMLElement) {
  opened = { module, source };
  listeners.forEach((l) => l());
}

function closeModule() {
  opened = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const OPEN = { duration: 620, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
const CLOSE = { duration: 440, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const px = (v: string) => parseFloat(v) || 0;

/* The picture's visible box inside its <img> (object-fit: contain), so the
   flight lands the drawing on the drawing, not box on box. */
function picture(img: HTMLImageElement, aspect: number) {
  const r = img.getBoundingClientRect();
  const [ox, oy] = getComputedStyle(img).objectPosition.split(" ").map((v) => px(v) / 100);
  let w = r.width;
  let h = w / aspect;
  if (h > r.height) {
    h = r.height;
    w = h * aspect;
  }
  return { x: r.left + (r.width - w) * ox, y: r.top + (r.height - h) * oy, w, h };
}

/* clip-path that cuts the full-screen colour layer down to a box with the
   given corner radii ("h v" pairs as getComputedStyle reports them). */
function clip(box: DOMRect, frame: DOMRect, radii: string[]) {
  const [h, v] = [0, 1].map((k) => radii.map((r) => `${px(r.split(" ")[k] ?? r.split(" ")[0])}px`).join(" "));
  return `inset(${box.top - frame.top}px ${frame.right - box.right}px ${frame.bottom - box.bottom}px ${box.left - frame.left}px round ${h} / ${v})`;
}

const cornersOf = (el: Element) => {
  const cs = getComputedStyle(el);
  return [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
};

export function ModuleSheet() {
  const current = useSyncExternalStore(subscribe, () => opened, () => null);
  const dialog = useRef<HTMLDialogElement>(null);
  const colour = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const art = useRef<HTMLImageElement>(null);
  const closing = useRef(false);
  const router = useRouter();

  // The card's picture: hidden while its twin is up in the sheet
  const sourceImg = current?.source.querySelector("img") ?? null;

  /* One flight between the card and the sheet, either way. */
  function fly(direction: "open" | "close") {
    const d = dialog.current;
    if (!d || !current || !colour.current || !header.current || !art.current || !sourceImg) return Promise.resolve();
    if (reduced()) return Promise.resolve();
    const timing = direction === "open" ? OPEN : CLOSE;
    const frame = d.getBoundingClientRect();
    const card = current.source.getBoundingClientRect();
    const head = header.current.getBoundingClientRect();

    const inCard = clip(card, frame, cornersOf(current.source));
    const inHeader = clip(head, frame, cornersOf(header.current));

    const aspect = sourceImg.naturalWidth / sourceImg.naturalHeight || 1;
    const from = picture(sourceImg, aspect);
    const to = picture(art.current, aspect);
    const inCardArt = `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.w / to.w})`;

    const keys = <T,>(a: T, b: T) => (direction === "open" ? [a, b] : [b, a]);
    return Promise.all([
      colour.current.animate({ clipPath: keys(inCard, inHeader) }, { ...timing, fill: "both" }).finished,
      art.current.animate({ transform: keys(inCardArt, "none") }, { ...timing, fill: "both" }).finished,
    ]).catch(() => {});
  }

  useLayoutEffect(() => {
    const d = dialog.current;
    if (!current || !d) return;
    closing.current = false;
    d.dataset.state = "opening";
    d.showModal();
    // Its screen is one tap away: fetch it while the sheet opens
    if (current.module.href) router.prefetch(current.module.href);
    // Only the sheet scrolls
    const root = document.documentElement;
    root.style.overflow = "hidden";
    if (sourceImg) sourceImg.style.visibility = "hidden";
    d.querySelector<HTMLElement>("[data-scroll]")?.scrollTo(0, 0);
    fly("open").then(() => {
      if (!closing.current) d.dataset.state = "open";
    });
    return () => {
      // Also runs when Next keeps Home alive but hidden after a navigation:
      // a modal left open there would make the next screen inert.
      if (d.open) d.close();
      root.style.overflow = "";
      if (sourceImg) sourceImg.style.visibility = "";
    };
  }, [current]); // once per opening

  async function close() {
    const d = dialog.current;
    if (!d || closing.current) return;
    closing.current = true;
    d.dataset.state = "closing";
    // Fly back from the top, where the header is
    d.querySelector<HTMLElement>("[data-scroll]")?.scrollTo(0, 0);
    await fly("close");
    d.close();
    closeModule();
  }

  if (!current) return null;
  const m = current.module;
  const detail = moduleDetails[m.id];
  if (!detail) return null;
  const group = m.group === "guidance" ? "Seek guidance" : "Daily practice";

  /* Leave for the module's screen: the sheet shuts first, so returning to
     Home finds it closed and the new screen isn't behind a modal. */
  function act() {
    if (!m.href) return notify(`${m.title} isn't part of this demo yet.`);
    dialog.current?.close();
    closeModule();
    router.push(m.href);
  }

  return (
    <dialog
      ref={dialog}
      className={s.sheet}
      aria-labelledby="module-sheet-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      style={{ "--card-bg": m.theme?.card, "--card-ink": m.theme?.ink } as CSSProperties}
    >
      <div className={s.veil} aria-hidden />
      <div ref={colour} className={s.colour} aria-hidden />

      {/* Outside the scroll, so Back and the breadcrumb stay as the copy moves */}
      <div className={s.toolbar}>
        <button type="button" className="icon-btn surface" onClick={close} aria-label="Back">
          <Icon name="arrow" size={20} className={s.backIcon} />
        </button>
        <nav aria-label="Breadcrumb" className={`${s.crumbs} surface`}>
          <ol>
            <li>
              <button type="button" className={s.crumbLink} onClick={close}>
                Home
              </button>
            </li>
            <li aria-current="page">{group}</li>
          </ol>
        </nav>
        <button type="button" className="icon-btn surface" onClick={() => notify("Saving isn't part of this demo yet.")} aria-label={`Save ${m.title}`}>
          <Icon name="heart" size={20} />
        </button>
      </div>

      <div className={s.scroll} data-scroll>
        {/* Stage: the artwork on a lit plinth under a spotlight */}
        <header ref={header} className={s.header}>
          <span className={s.spotlight} aria-hidden />
          <span className={s.plinth} aria-hidden />
          <div className={s.artBox}>
            {/* The card's own loaded file, so the picture is there the moment it flies */}
            <img ref={art} src={sourceImg?.currentSrc || m.artwork.src} alt="" className={`${s.art} ${s[m.artwork.fit]}`} />
          </div>
        </header>

        {/* Panel rising over the stage; the at-a-glance strip straddles its edge */}
        <div className={s.panel}>
          <ul className={`${s.glance} surface`} aria-label="At a glance">
            {detail.meta.map((item) => (
              <li key={item} className={s.glanceItem}>
                <span className="diamond" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <p className={`eyebrow ${s.rise}`} style={{ "--n": 0 } as CSSProperties}>
            {group}
          </p>
          <h2 id="module-sheet-title" className={`${s.title} ${s.rise}`} style={{ "--n": 1 } as CSSProperties}>
            {m.title}
          </h2>
          <p className={`${s.tagline} ${s.rise}`} style={{ "--n": 2 } as CSSProperties}>
            {m.description}
          </p>

          <section className={`${s.block} ${s.rise}`} style={{ "--n": 3 } as CSSProperties} aria-labelledby="module-sheet-about">
            <h3 id="module-sheet-about" className="eyebrow">
              About
            </h3>
            <p className={s.about}>{detail.about}</p>
          </section>

          <section className={`${s.block} ${s.rise}`} style={{ "--n": 4 } as CSSProperties} aria-labelledby="module-sheet-features">
            <div className={s.blockHead}>
              <h3 id="module-sheet-features" className="eyebrow">
                What you&rsquo;ll find
              </h3>
              <span className={s.count} aria-hidden>
                {String(detail.features.length).padStart(2, "0")}
              </span>
            </div>
            <ul className={s.features}>
              {detail.features.map((f, i) => (
                <li key={f.title} className={`${s.feature} surface`}>
                  <span className={s.featureIndex} aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={s.featureTitle}>{f.title}</span>
                  <span className={s.featureNote}>{f.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className={s.fade} aria-hidden />
      <div className={`${s.actions} surface`}>
        <button type="button" className={`btn btn-primary ${s.cta}`} onClick={act}>
          {detail.cta}
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </dialog>
  );
}

/* A card that opens its module's sheet */
export function ModuleOpener({ module, className, children }: { module: HomeModule; className: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={(e) => openModule(module, e.currentTarget)}>
      {children}
    </button>
  );
}
