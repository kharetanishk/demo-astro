// First, so every component's own CSS can override it in production builds too
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import { NavHistory } from "@/components/ui/BackLink";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Toaster } from "@/components/ui/demo";
import { DESKTOP } from "@/components/ui/desktop";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
// Engraved display face: headings and figures.
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astro",
  description: "Astrology, Panchang and rituals — home.",
};

export const viewport: Viewport = {
  themeColor: "#f4e8d8",
  viewportFit: "cover",
};

// Before first paint: on a desktop the page shows an iPhone running the app
// (data-frame="host", see PhoneFrame); inside it the app knows it's on that screen.
// Opening the app always starts at the welcome; moving to Home from inside the app doesn't reload, so it isn't caught
const firstVisit = `if(location.pathname==="/")location.replace("/welcome");`;
const markFrame = `(function(){var h=document.documentElement;if(self!==top)h.setAttribute("data-frame","screen");else if(matchMedia(${JSON.stringify(DESKTOP)}).matches)h.setAttribute("data-frame","host")})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: firstVisit + markFrame }} />
      </head>
      <body>
        {children}
        <NavHistory />
        <BottomNavigation />
        <Toaster />
        <PhoneFrame />
      </body>
    </html>
  );
}
