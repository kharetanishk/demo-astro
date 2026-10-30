"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* A full-screen flow (see Immersive) opens as a sheet: it rises over the
   screen it came from and sinks back to reveal it. The browser pictures the
   screen before navigating and holds it until the flow has arrived or left,
   the moment Immersive changes, so nothing half-loaded ever shows. */
export function moveSheet(direction: "up" | "down", navigate: () => void) {
  if (!document.startViewTransition) return navigate();
  const root = document.documentElement;
  root.dataset.sheet = direction;
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((done) => {
        const moved = new MutationObserver(() => {
          if ("immersive" in root.dataset !== (direction === "up")) return;
          moved.disconnect();
          if (direction === "down") settleEntrance();
          done();
        });
        moved.observe(root, { attributes: true, attributeFilter: ["data-immersive"] });
        navigate();
      }),
  );
  transition.finished.finally(() => delete root.dataset.sheet).catch(() => {});
}

/* A screen coming back replays its .rise entrance (it was display: none). Under
   a sinking sheet it should simply be there, so skip straight to the end. */
function settleEntrance() {
  for (const animation of document.getAnimations()) {
    if (animation instanceof CSSAnimation && animation.animationName === "rise") animation.finish();
  }
}

/* A link that opens its screen as a sheet */
export function SheetLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        moveSheet("up", () => router.push(href));
      }}
      {...props}
    />
  );
}
