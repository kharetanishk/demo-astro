/* Demo history until /messages, /userCalls and /userBookings are wired in:
   AI questions, consultations and bookings, as one timeline. */
export type Entry =
  | { kind: "ai"; id: string; day: string; time: string; topic: string; question: string; answer: string }
  | { kind: "consult"; id: string; day: string; time: string; guru: string; media: "chat" | "audio" | "video"; minutes: number; credits: number }
  | { kind: "booking"; id: string; day: string; time: string; guru: string; media: "chat" | "audio" | "video"; minutes: number; when: string; status: "upcoming" | "done" | "cancelled" };

export const entries: Entry[] = [
  {
    kind: "ai",
    id: "q1",
    day: "Today",
    time: "9:12 AM",
    topic: "Career & Job",
    question: "Will I get a promotion this year?",
    answer:
      "Saturn, the lord of your 6th and 7th, sits in your 10th house of career, and your Rahu–Saturn period runs until February 2027. That is a slow, steady climb, not a sudden jump. Expect recognition between December and February, most likely after a change of responsibility rather than a new title first.\n\nWhat helps: deliver on one visible project before December, and keep Saturdays for planning. Lighting a sesame-oil diya on Saturday evenings is the traditional remedy for a strong but slow Saturn.",
  },
  { kind: "booking", id: "b1", day: "Today", time: "8:40 AM", guru: "meera-joshi", media: "video", minutes: 20, when: "Tomorrow, 7:30 PM", status: "upcoming" },
  { kind: "consult", id: "c1", day: "Yesterday", time: "8:05 PM", guru: "raghav-shastri", media: "chat", minutes: 14, credits: 350 },
  {
    kind: "ai",
    id: "q2",
    day: "Yesterday",
    time: "11:30 AM",
    topic: "Marriage",
    question: "When is a good time for marriage in my chart?",
    answer:
      "Your 7th house falls in Kumbha with Mars in it, which makes you Manglik: matching charts carefully matters more for you than timing alone. Venus, the planet of marriage, is strong in your 2nd house of family. The window from mid-2027, when Jupiter moves over your 11th and 12th, opens the strongest support for a union.\n\nWhat helps: a Guna Milan with your partner's chart, and Friday prayers to Lakshmi.",
  },
  { kind: "consult", id: "c2", day: "26 Oct", time: "6:20 PM", guru: "anand-tiwari", media: "audio", minutes: 22, credits: 770 },
  {
    kind: "ai",
    id: "q3",
    day: "24 Oct",
    time: "7:45 AM",
    topic: "Health",
    question: "Which areas of health should I take care of?",
    answer:
      "Your 6th house is Makara, ruled by Saturn: joints, knees and posture deserve attention, especially with long hours at a desk. The Sun in the 2nd suggests watching the eyes and the throat.\n\nWhat helps: a daily walk at sunrise, Surya namaskar, and offering water to the Sun on Sundays.",
  },
  { kind: "booking", id: "b2", day: "20 Oct", time: "4:00 PM", guru: "kavya-iyer", media: "chat", minutes: 15, when: "20 Oct, 4:00 PM", status: "done" },
];
