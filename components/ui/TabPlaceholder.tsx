import Link from "next/link";
import s from "./TabPlaceholder.module.css";

/* Stand-in for tab screens that aren't part of the demo yet, so the bottom
   navigation has real routes to move between. Replace each route's page
   (app/history, app/kundli, app/profile) with its real screen. */
export function TabPlaceholder({ title }: { title: string }) {
  return (
    <main className={`page ${s.placeholder}`}>
      <p className="eyebrow">Not in this demo yet</p>
      <h1 className={s.title}>{title}</h1>
      <p className={s.note}>This screen will arrive with the full app.</p>
      <Link href="/" className={`btn btn-primary ${s.back}`}>
        Back to Home
      </Link>
    </main>
  );
}
