import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { Toaster } from "@/components/ui/demo";
import { StyleSwitcher } from "@/components/ui/StyleSwitcher";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
// Engraved display face for the skeuomorphic style only, so not preloaded.
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "Astro",
  description: "Astrology, Panchang and rituals — home.",
};

export const viewport: Viewport = {
  themeColor: "#f4e8d8",
  viewportFit: "cover",
};

// Restores the chosen UI style, practice layout and zodiac orbit before first
// paint (see StyleSwitcher);
// ?style=glass in the URL overrides it, for sharing one style.
const restoreStyle = `(function(){try{var t=new URLSearchParams(location.search).get("style")||localStorage.getItem("ui-style");if(/^(royal|glass|brutal|minimal|skeuo)$/.test(t))document.documentElement.setAttribute("data-style",t);if(localStorage.getItem("practice-layout")==="stack")document.documentElement.setAttribute("data-practice","stack");if(localStorage.getItem("zodiac-orbit")==="circle")document.documentElement.setAttribute("data-orbit","circle")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cinzel.variable}`} data-style="royal" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreStyle }} />
      </head>
      <body>
        {children}
        <BottomNavigation />
        <Toaster />
        <StyleSwitcher />
      </body>
    </html>
  );
}
