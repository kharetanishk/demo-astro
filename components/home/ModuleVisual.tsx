import Image from "next/image";
import type { HomeModule } from "./modules";
import s from "./ModuleVisual.module.css";

type Slot = "guide" | "plate" | "chip";

const sizes: Record<Slot, string> = {
  // Both at the sheet header's size, so the sheet can reuse the loaded file
  guide: "260px",
  plate: "260px",
  chip: "44px",
};

/* A module's artwork in a given frame. Fit and padding per slot live in
   ModuleVisual.module.css. Decorative: the module title always sits beside it. */
export function ModuleVisual({ module: m, slot }: { module: HomeModule; slot: Slot }) {
  return <Image src={m.artwork.src} alt="" fill sizes={sizes[slot]} className={`${s.image} ${s[slot]} ${s[m.artwork.fit]}`} />;
}
