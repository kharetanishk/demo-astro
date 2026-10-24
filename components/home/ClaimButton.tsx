"use client";

import { notify } from "@/components/ui/demo";

/* An offer's CTA action: shows its demo notice and sends a sweep of light
   across the panel it sits in (no delay to the action). */
type Props = { label: string; notice: string; className: string; children?: React.ReactNode };

export function ClaimButton({ label, notice, className, children }: Props) {
  function claim(e: React.MouseEvent<HTMLButtonElement>) {
    const panel = e.currentTarget.closest("[data-sweep-target]");
    if (panel instanceof HTMLElement) {
      panel.removeAttribute("data-sweep");
      void panel.offsetWidth; // restart the sweep on repeat taps
      panel.setAttribute("data-sweep", "");
    }
    notify(notice);
  }

  return (
    <button type="button" className={className} onClick={claim} aria-label={children ? label : undefined}>
      {children ?? label}
    </button>
  );
}
