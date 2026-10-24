"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import styles from "./demo.module.css";

/* Local notice for actions that have no real handler yet.
   Messages state that plainly; they never report a success. */
type Notice = { text: string; open: boolean };

let notice: Notice = { text: "", open: false };
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function publish(next: Notice) {
  notice = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notify(text: string) {
  clearTimeout(timer);
  publish({ text, open: true });
  timer = setTimeout(() => publish({ text, open: false }), 2600);
}

export function DemoButton({ notice: text, ...props }: Omit<ComponentProps<"button">, "type" | "onClick"> & { notice: string }) {
  return <button {...props} type="button" onClick={() => notify(text)} />;
}

export function Toaster() {
  const current = useSyncExternalStore(subscribe, () => notice, () => notice);
  return (
    <div role="status" className={styles.toast} data-open={current.open}>
      {current.text}
    </div>
  );
}
