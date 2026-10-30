/* The twelve rashis, in zodiac order (ids match /public/zodiac), with their
   sidereal Sun dates. Readings are demo copy until a horoscope API is wired in,
   and the screens say so. `stars` draws its constellation on a 100 square. */
export type Sign = {
  id: string;
  name: string;
  western: string;
  dates: string;
  lord: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  friends: [string, string];
  today: string;
  week: string;
  month: string;
  stars: [number, number][];
};

export const signs: Sign[] = [
  { id: "mesha", name: "Mesha", western: "Aries", dates: "14 Apr – 14 May", lord: "Mars", element: "Fire", friends: ["simha", "dhanu"],
    today: "Mars lends you a quick start. Begin the thing you have been circling, then let someone else carry the detail.",
    week: "Momentum builds at work by midweek. Hold your temper around Thursday: a short pause saves a long repair.",
    month: "A new role or responsibility takes shape. Spend on your health and your tools, not on proving a point.",
    stars: [[20, 62], [46, 42], [66, 40], [80, 54]] },
  { id: "vrishabha", name: "Vrishabha", western: "Taurus", dates: "15 May – 14 Jun", lord: "Venus", element: "Earth", friends: ["kanya", "makara"],
    today: "A slow, steady day suits you. A small comfort at home settles something larger in your mind.",
    week: "Money matters ask for patience. A family conversation near the weekend goes better than you expect.",
    month: "Savings grow if you resist one tempting purchase. Love deepens through routine rather than surprise.",
    stars: [[16, 30], [36, 44], [50, 52], [62, 46], [84, 26], [50, 52], [40, 76]] },
  { id: "mithuna", name: "Mithuna", western: "Gemini", dates: "15 Jun – 15 Jul", lord: "Mercury", element: "Air", friends: ["tula", "kumbha"],
    today: "Your words travel well today. Send the message you drafted, and listen for the answer between the lines.",
    week: "Two offers compete for your time. Choose by the one that teaches you more, not the one that pays first.",
    month: "Study, writing and short trips favour you. Keep one evening a week free of your phone.",
    stars: [[30, 18], [34, 46], [30, 80], [70, 20], [66, 48], [70, 80], [34, 46], [66, 48]] },
  { id: "karka", name: "Karka", western: "Cancer", dates: "16 Jul – 16 Aug", lord: "Moon", element: "Water", friends: ["vrishchika", "meena"],
    today: "The Moon keeps your feelings close to the surface. Trust them, but sleep on any reply written tonight.",
    week: "Home needs a little of your attention. Someone older in the family has advice worth hearing.",
    month: "Emotional clarity arrives after the full Moon. A property or household decision can move forward.",
    stars: [[50, 16], [50, 46], [24, 78], [76, 72]] },
  { id: "simha", name: "Simha", western: "Leo", dates: "17 Aug – 16 Sep", lord: "Sun", element: "Fire", friends: ["mesha", "dhanu"],
    today: "The Sun puts you in plain view. Lead warmly and share the credit: it comes back to you doubled.",
    week: "Recognition is close, though it arrives through someone else's words. Let them say it first.",
    month: "A creative project or a child's success brings pride. Watch your back and your posture.",
    stars: [[78, 30], [66, 20], [52, 26], [50, 44], [62, 52], [34, 62], [18, 76], [40, 78]] },
  { id: "kanya", name: "Kanya", western: "Virgo", dates: "17 Sep – 16 Oct", lord: "Mercury", element: "Earth", friends: ["vrishabha", "makara"],
    today: "A precise eye serves you well. Tidy one thing fully rather than five things halfway.",
    week: "Colleagues lean on you more than they admit. Name a boundary early, kindly, and keep it.",
    month: "Health habits begun now will last. A long-running task finally closes near the month's end.",
    stars: [[18, 26], [36, 36], [52, 34], [50, 56], [70, 62], [84, 80], [50, 56], [34, 76]] },
  { id: "tula", name: "Tula", western: "Libra", dates: "17 Oct – 15 Nov", lord: "Venus", element: "Air", friends: ["mithuna", "kumbha"],
    today: "Venus softens a tense conversation. Say the fair thing first, and the hard thing lands more gently.",
    week: "Partnerships are in focus. An agreement you have delayed is ready to sign, once you read it twice.",
    month: "Your Rahu–Saturn period rewards patience: effort made now pays late but stays. Balance your budget early.",
    stars: [[50, 16], [24, 42], [74, 42], [50, 16], [30, 74], [24, 42], [74, 42], [70, 76]] },
  { id: "vrishchika", name: "Vrishchika", western: "Scorpio", dates: "16 Nov – 15 Dec", lord: "Mars", element: "Water", friends: ["karka", "meena"],
    today: "You see what others miss today. Keep it to yourself until you know what it is worth.",
    week: "A shared expense or inheritance question surfaces. Ask for it in writing and stay calm.",
    month: "A private change runs deep this month. Let go of one old grudge and you will feel the room it leaves.",
    stars: [[84, 18], [72, 30], [84, 42], [58, 34], [48, 50], [40, 68], [24, 80], [12, 66]] },
  { id: "dhanu", name: "Dhanu", western: "Sagittarius", dates: "16 Dec – 13 Jan", lord: "Jupiter", element: "Fire", friends: ["mesha", "simha"],
    today: "Jupiter widens your view. A book, a teacher or a far-off friend says the thing you needed.",
    week: "Plans for travel or study firm up. Check the small print before you share the good news.",
    month: "Fortune favours a bold question this month. Teach what you know and more will come to you.",
    stars: [[20, 78], [40, 58], [58, 40], [82, 18], [58, 40], [66, 64], [58, 40], [34, 30]] },
  { id: "makara", name: "Makara", western: "Capricorn", dates: "14 Jan – 12 Feb", lord: "Saturn", element: "Earth", friends: ["vrishabha", "kanya"],
    today: "Saturn asks for one more careful step. Finish it, and the week ahead becomes much lighter.",
    week: "Work you did quietly gets noticed by the right person. Don't undersell it when asked.",
    month: "Slow gains accumulate. A long-term plan, for career or property, is worth writing down now.",
    stars: [[16, 24], [40, 30], [84, 26], [72, 56], [46, 76], [16, 24]] },
  { id: "kumbha", name: "Kumbha", western: "Aquarius", dates: "13 Feb – 13 Mar", lord: "Saturn", element: "Air", friends: ["mithuna", "tula"],
    today: "An unusual idea finds its audience. Share it with the group rather than polishing it alone.",
    week: "Friends open a useful door. Say yes to the invitation you would normally skip.",
    month: "A cause or community gives you purpose this month. Gains arrive through people, not through luck.",
    stars: [[14, 34], [30, 44], [46, 34], [62, 44], [80, 34], [62, 44], [50, 66], [68, 84]] },
  { id: "meena", name: "Meena", western: "Pisces", dates: "14 Mar – 13 Apr", lord: "Jupiter", element: "Water", friends: ["karka", "vrishchika"],
    today: "Your intuition runs ahead of the facts today. Follow it gently, and verify before you commit.",
    week: "Quiet time restores you midweek. A spiritual practice or an early night does more than coffee.",
    month: "An ending makes room for something kinder. Dreams and prayer feel unusually clear this month.",
    stars: [[20, 20], [30, 46], [44, 74], [60, 56], [84, 40], [74, 28], [84, 40]] },
];

export const sign = (id: string) => signs.find((s) => s.id === id);

/* The demo user's chart (as on Kundli and Profile) */
export const MY_RASHI = "tula";
export const emblem = (id: string) => `/zodiac/${id}.webp`;
/* Only a sign's own reading needs the big one */
export const emblemLarge = (id: string) => `/zodiac/large/${id}.webp`;
/* From a rashi's display name ("Tula"), for screens that hold only the name */
export const emblemOfName = (name: string) => emblem(name.toLowerCase());
