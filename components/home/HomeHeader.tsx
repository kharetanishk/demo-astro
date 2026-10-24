import { DemoButton } from "@/components/ui/demo";
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
        <DemoButton className={s.button} aria-label="Add points" notice="Adding points isn't part of this demo yet.">
          <span className={s.addDisc}>
            <Icon name="plus" size={16} />
          </span>
        </DemoButton>
      </div>

      <div className={`${s.capsule} surface`} role="group" aria-label="Quick actions">
        <DemoButton className={s.button} aria-label="Calendar" notice="Calendar isn't part of this demo yet.">
          <Icon name="calendar" size={20} />
        </DemoButton>
        <DemoButton
          className={s.button}
          aria-label={unread ? `Notifications, ${badge} unread` : "Notifications"}
          notice="Notifications aren't part of this demo yet."
        >
          <Icon name="bell" size={20} />
          {unread > 0 && (
            <span className={s.badge} aria-hidden>
              {badge}
            </span>
          )}
        </DemoButton>
      </div>
    </header>
  );
}
