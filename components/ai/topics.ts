/* AI Astrology topics and their starter questions (after v2's
   src/data/aiAstrology.ts). "general" is the catch-all "Ask anything". */
export type Topic = { id: string; label: string; glyph: string; blurb: string; questions: string[] };

export const topics: Topic[] = [
  { id: "career", label: "Career & Job", glyph: "♄", blurb: "Growth, change, the right move", questions: ["Will I get a promotion this year?", "Is this a good time to change my job?", "Which field suits my chart best?", "Should I start my own business?"] },
  { id: "marriage", label: "Marriage", glyph: "♥", blurb: "Timing and harmony", questions: ["When is a good time for marriage in my chart?", "Will my marriage be arranged or love?", "Is there any dosha affecting my marriage?"] },
  { id: "love", label: "Love & Relationships", glyph: "♡", blurb: "Matters of the heart", questions: ["Will my current relationship last?", "When will I meet the right person?", "How can I bring more harmony to my relationship?"] },
  { id: "finance", label: "Finance & Wealth", glyph: "♃", blurb: "Gains, savings, investments", questions: ["When will my finances improve?", "Is it a good time to invest?", "What are my sources of wealth?"] },
  { id: "health", label: "Health", glyph: "♀", blurb: "Body, mind and energy", questions: ["Which areas of health should I take care of?", "What remedies support my health?", "How is my health this year?"] },
  { id: "education", label: "Education", glyph: "☿", blurb: "Study, exams, abroad", questions: ["Will I succeed in my exams?", "Which subject suits me?", "Will I study abroad?"] },
  { id: "family", label: "Family & Children", glyph: "☽", blurb: "Home and the ones you love", questions: ["When will I have children?", "How can I improve peace at home?", "How is my relationship with my parents?"] },
  { id: "property", label: "Property", glyph: "⌂", blurb: "Home, land, vehicles", questions: ["When can I buy a house?", "Is this property lucky for me?", "Will I gain from ancestral property?"] },
  { id: "travel", label: "Travel & Foreign", glyph: "☉", blurb: "Journeys and settling abroad", questions: ["Will I settle abroad?", "Is foreign travel good for my career?", "When is a good time to travel?"] },
  { id: "spirituality", label: "Spirituality & Remedies", glyph: "✦", blurb: "Mantras, gemstones, puja", questions: ["Which mantra should I chant?", "Which gemstone suits me?", "Which deity should I worship?"] },
];

export const GENERAL: Topic = { id: "general", label: "Ask anything", glyph: "✧", blurb: "Your chart, any question", questions: ["What does this year hold for me?", "What are my strengths according to my chart?", "Tell me about my current dasha."] };

/* Its own banner under the mosaic: it reads two charts, not one */
export const MATCH: Topic = { id: "matchmaking", label: "Match making", glyph: "♎", blurb: "Two charts, one answer", questions: ["How compatible are we?", "Is there any dosha in our match?", "What will help our marriage?"] };

export const allTopics = [...topics, GENERAL, MATCH];

export const topic = (id: string) => allTopics.find((t) => t.id === id);

export const credits = { balance: 240, aiQuestions: 3 };
