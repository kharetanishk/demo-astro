import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Plus_Jakarta_Sans } from "next/font/google";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Toaster } from "@/components/ui/demo";
import { StyleSwitcher } from "@/components/ui/StyleSwitcher";
import { DESKTOP } from "@/components/ui/desktop";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
// Engraved display face: the Sarvadrishti wordmark, and the skeuomorphic style.
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
// The wordmark's swash S and R only.
const cinzelDecorative = Cinzel_Decorative({ variable: "--font-cinzel-decorative", weight: "700", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astro",
  description: "Astrology, Panchang and rituals — home.",
};

export const viewport: Viewport = {
  themeColor: "#f4e8d8",
  viewportFit: "cover",
};

// Restores the chosen UI style, and the carousel if switched on, before
// first paint (see StyleSwitcher); <html> carries the defaults.
// ?style=glass in the URL overrides it, for sharing one style.
// On a desktop the page shows an iPhone running the app (data-frame="host",
// see PhoneFrame); inside it the app knows it's on that screen.
const restoreStyle = `(function(){var h=document.documentElement;if(self!==top)h.setAttribute("data-frame","screen");else if(matchMedia(${JSON.stringify(DESKTOP)}).matches)h.setAttribute("data-frame","host");try{var t=new URLSearchParams(location.search).get("style")||localStorage.getItem("ui-style");if(/^(royal|glass|brutal|minimal|skeuo)$/.test(t))document.documentElement.setAttribute("data-style",t);if(localStorage.getItem("home-layout")==="carousel")document.documentElement.setAttribute("data-practice","carousel")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cinzel.variable} ${cinzelDecorative.variable}`} data-style="royal" data-practice="stack" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreStyle }} />
      </head>
      <body>
        {children}
        <BottomNavigation />
        <Toaster />
        <StyleSwitcher />
        <PhoneFrame />
      </body>
    </html>
  );
}
