import Link from "next/link";
import { Icon } from "@/components/ui/ornaments";
import s from "./HomeHeader.module.css";

type Props = { unread: number; points: number };

/* Two capsules flanking the Sanctum's crown: rewards on the left,
   calendar and notifications on the right. */
export function HomeHeader({ unread, points }: Props) {
  const badge = unread > 9 ? "9+" : String(unread);

  return (
    <header className={`${s.header} rise`}>
      <div className={`${s.capsule} surface`}>
        <span className={s.points}>
          <Icon name="star" size={16} className={s.star} />
          {points}
          <span className="sr-only"> points</span>
        </span>
        <Link href="/wallet" className={s.button} aria-label="Add credits">
          <span className={s.addDisc}>
            <Icon name="plus" size={16} />
          </span>
        </Link>
      </div>

      <div className={`${s.capsule} surface`} role="group" aria-label="Quick actions">
        <Link href="/panchang" className={s.button} aria-label="Panchang">
          <Icon name="calendar" size={20} />
        </Link>
        <Link href="/notifications" className={s.button} aria-label={unread ? `Notifications, ${badge} unread` : "Notifications"}>
          <Icon name="bell" size={20} />
          {unread > 0 && (
            <span className={s.badge} aria-hidden>
              {badge}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
