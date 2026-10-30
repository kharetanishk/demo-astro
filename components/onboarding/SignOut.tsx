"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/ornaments";

/* Back to the welcome, so the whole flow can be walked again */
export function SignOut({ className }: { className: string }) {
  return (
    <Link href="/welcome" className={className}>
      <Icon name="logout" size={18} />
      Sign out
    </Link>
  );
}
