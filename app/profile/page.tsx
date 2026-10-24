import { Profile } from "@/components/profile/Profile";

// Demo profile until the app's user API is wired in.
const user = {
  name: "Tanishk Khare",
  rashi: "Tula",
  nakshatra: "Swati",
  lagna: "Simha",
  born: { date: "14 Oct 2001", time: "6:45 AM", place: "Mumbai" },
  phone: "+91 98765 43210",
  email: "tanishk@example.com",
  stats: [
    { label: "Points", value: 110 },
    { label: "Consultations", value: 5 },
    { label: "Bookings", value: 2 },
  ],
};

export default function ProfilePage() {
  return <Profile user={user} />;
}
