"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/* In-app history, so Back returns to the screen you came from (Wallet
   opened from Home goes back to Home, not Profile). Opened cold, from a
   shared link or a reload, there's nothing to return to, so Back goes to
   the screen's parent instead. */
const visited: string[] = [];

export function NavHistory() {
  const pathname = usePathname();
  useEffect(() => {
    if (visited.at(-2) === pathname) visited.pop(); // a step back
    else if (visited.at(-1) !== pathname) visited.push(pathname);
  }, [pathname]);
  return null;
}

export function BackLink({ fallback, className, label = "Back", children }: { fallback: string; className?: string; label?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      className={className}
      aria-label={label}
      onClick={(e) => {
        if (visited.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      {children}
    </Link>
  );
}
