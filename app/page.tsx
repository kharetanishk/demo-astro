import { HomeHeader } from "@/components/home/HomeHeader";
import { ModuleSection } from "@/components/home/ModuleSection";
import { ModuleSheet } from "@/components/home/ModuleSheet";
import { CourtyardBackdrop, Sanctum } from "@/components/home/Sanctum";
import { BACKDROP_ARTWORK, homeModules } from "@/components/home/modules";
import { homeOffers } from "@/components/home/offer";

// Demo user until the app's user API is wired in.
const user = { name: "Tanishk", unreadNotifications: 12, points: 110 };

export default function HomePage() {
  return (
    <main className="page">
      <CourtyardBackdrop src={BACKDROP_ARTWORK} />
      <HomeHeader unread={user.unreadNotifications} points={user.points} />
      <Sanctum name={user.name} offers={homeOffers} />
      <ModuleSection modules={homeModules} />
      <ModuleSheet />
    </main>
  );
}
