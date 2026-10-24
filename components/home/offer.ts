/* The home promotional offers, shown in order as a slideshow. This is the
   single source of truth for their content: each panel renders whatever
   Offer it's given. There's no admin API in this demo yet; when there is,
   load the configured offers here instead of the list below. */
export type Offer = {
  id: string;
  eyebrow?: string;
  heading: string;
  /** A part of the heading set in display type, e.g. a number. */
  emphasis?: string;
  description?: string;
  /** Optional transparent PNG in /public, shown beside the copy. */
  image?: string;
  /** Optional finished artwork that already shows the copy and button.
      When set, it replaces the panel's own text and the whole poster is
      the CTA; the heading is still read out to assistive tech. */
  poster?: { src: string; width: number; height: number };
  /** With `href` the CTA navigates; without, it runs the claim action and
      shows `notice` (the demo has no claim backend). */
  cta: { label: string; href?: string; notice?: string };
};

export const homeOffers: Offer[] = [
  {
    id: "first-questions-free",
    eyebrow: "A gift for your journey",
    heading: "Your first 3 questions are on us.",
    emphasis: "3",
    description: "Begin your journey with a little celestial guidance.",
    cta: { label: "Claim now", notice: "Claiming the offer isn't part of this demo yet." },
    // Transparent copy of /3question-poster.png (checkerboard removed, margins trimmed)
    poster: { src: "/3question-poster-alpha.webp", width: 1440, height: 784 },
  },
  {
    id: "sarvadrishti",
    eyebrow: "Your future is here",
    heading: "Sarvadrishti",
    description: "Explore AI-powered insights across love, career, health and more.",
    cta: { label: "Explore now", notice: "Sarvadrishti isn't part of this demo yet." },
    // Transparent copy of /poster-2.png (checkerboard removed, margins trimmed)
    poster: { src: "/poster-2-alpha.webp", width: 1520, height: 848 },
  },
];
