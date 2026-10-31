"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SarvEye, ZodiacRing } from "@/components/home/Sarvadrishti";
import { emblem } from "@/components/rashifal/signs";
import { ZodiacWheel } from "@/components/rashifal/ZodiacWheel";
import { Immersive } from "@/components/ui/Immersive";
import { Icon, type GlyphName } from "@/components/ui/ornaments";
import { fadeScreens, moveSheet } from "@/components/ui/sheet";
import { Universe } from "./Universe";
import s from "./Onboarding.module.css";

const CODE_LENGTH = 6;

type Lang = "en" | "hi";
type Step = "language" | "welcome" | "phone" | "code" | "name" | "gender" | "date" | "knownTime" | "time" | "place" | "languages" | "ready" | "terms";

// [English, Hindi]: the English is what's kept, the pair is what's shown
const CITIES: [string, string][] = [
  ["Mumbai, Maharashtra", "मुंबई, महाराष्ट्र"],
  ["Delhi", "दिल्ली"],
  ["Bengaluru, Karnataka", "बेंगलुरु, कर्नाटक"],
  ["Kolkata, West Bengal", "कोलकाता, पश्चिम बंगाल"],
  ["Chennai, Tamil Nadu", "चेन्नई, तमिलनाडु"],
  ["Jaipur, Rajasthan", "जयपुर, राजस्थान"],
  ["Varanasi, Uttar Pradesh", "वाराणसी, उत्तर प्रदेश"],
  ["Pune, Maharashtra", "पुणे, महाराष्ट्र"],
  ["Ahmedabad, Gujarat", "अहमदाबाद, गुजरात"],
  ["Hyderabad, Telangana", "हैदराबाद, तेलंगाना"],
];
const LANGUAGES: [string, string][] = [
  ["English", "अंग्रेज़ी"],
  ["Hindi", "हिन्दी"],
  ["Bengali", "बांग्ला"],
  ["Gujarati", "गुजराती"],
  ["Kannada", "कन्नड़"],
  ["Malayalam", "मलयालम"],
  ["Marathi", "मराठी"],
  ["Punjabi", "पंजाबी"],
  ["Tamil", "तमिल"],
  ["Telugu", "तेलुगु"],
  ["Urdu", "उर्दू"],
];

const en = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  changeLanguage: "Change language",
  tagline: "Your stars, decoded for you",
  promise: "Your Kundli, daily guidance and live Jyotishis, in one place.",
  withMobile: "Continue with mobile number",
  withGoogle: "Continue with Google",
  terms: ["By continuing you agree to our", "Terms", "and", "Privacy Policy", ""],
  medallions: ["Your name", "About you", "Birth date", "Birth time", "Birthplace", "Languages"],
  stepOf: (n: number, of: number) => `Step ${n} of ${of}`,
  back: "Back",
  signIn: "Sign in",
  phoneQ: "Your mobile number",
  phoneHint: "For sign-in and consultation reminders.",
  phoneLabel: "Mobile number",
  codeQ: "Enter your code",
  sentTo: "Sent to",
  change: "Change",
  codeLabel: "Verification code",
  codeDemo: (n: number) => `This demo sends no message: any ${n} digits will do.`,
  nameQ: "What should we call you?",
  nameHint: "Your name personalises your cosmic journey.",
  nameLabel: "Your name",
  namePlaceholder: "Your first name",
  nameQuote: "A name is the first gift from the universe; it carries its own vibration.",
  genderQ: "I identify as",
  genderHint: "It tunes marriage and partnership readings. You can change it later.",
  genderLabel: "Gender",
  genders: {
    male: ["Male", "Venus read as your marriage karaka"],
    female: ["Female", "Jupiter read as your marriage karaka"],
    other: ["Other", "Or prefer not to say: a unisex reading"],
  },
  dateQ: "When were you born?",
  dateHint: "Your birth date is the key to your chart.",
  month: "Month",
  day: "Day",
  year: "Year",
  knownQ: "Do you know your time of birth?",
  knownHint: "Your birth time sets your Lagna, which shapes your personality reading.",
  yes: "Yes, I know it",
  no: "No, I don\u2019t",
  knownQuote: "Without it we use sunrise, so your Lagna is approximate. You can add it later.",
  timeQ: "At what time?",
  timeHint: "Even an approximate time sharpens your Lagna.",
  hour: "Hour",
  minute: "Minute",
  ampm: "AM or PM",
  placeQ: "Where were you born?",
  placeHint: "Your birthplace sets the cosmic coordinates.",
  placeLabel: "City or town",
  placeSearch: "Search city or town",
  places: "Places",
  india: "India",
  langQ: "Which languages should your astrologer speak?",
  langHint: "Choose as many as you like.",
  reveal: "Reveal my stars",
  sendCode: "Send code",
  next: "Next",
  ready: "Your chart is ready",
  namaste: (name: string) => `Namaste, ${name || "friend"}`,
  readyLine: "The stars have been waiting for you.",
  seals: [
    ["Lagna", "Simha"],
    ["Rashi", "Tula"],
    ["Nakshatra", "Swati"],
  ],
  born: "Born",
  timeUnknown: "time unknown",
  sample: "A sample chart: nothing you entered is saved in this demo.",
  enter: "Enter the world of Sarvdrishti",
  proceed: "Continue",
  termsTop: "Terms",
  termsQ: "Terms & Conditions",
  termsHint: "Please read to the end to accept.",
  termsAgree: "I have read and agree to the Terms & Conditions and Privacy Policy",
  termsLocked: "Scroll to the end of the terms to accept",
  termsBody: [
    ["1. About these terms", "These terms govern your use of the Sarvdrishti app, its website and every service offered through them, including Kundli, Panchang, Rashifal, Astro Guru consultations, E-Puja, Maala Jaap, Vastu AI and Tarot. By creating an account you agree to them in full."],
    ["2. Guidance, not a guarantee", "Astrology, Vastu and Tarot are traditional systems of interpretation. Readings, predictions and remedies are offered for spiritual guidance and reflection only. They are not a substitute for medical, legal, financial or psychological advice, and no outcome is promised."],
    ["3. Your account", "You must be at least 18 years old, or have a guardian's consent, to use the app. Keep your mobile number and sign-in code private; you are responsible for activity on your account. Tell us at once if you think it has been misused."],
    ["4. Birth details and privacy", "Your name, birth date, time and place are used only to prepare your chart and personalise readings. We do not sell your personal data. You may ask for your data to be corrected or deleted at any time from Profile, or by writing to our support team."],
    ["5. Consultations with astrologers", "Astro Guru connects you with independent astrologers. They are not our employees, and their views are their own. Be respectful in chats and calls; abusive conduct may lead to your account being suspended without refund."],
    ["6. Wallet, payments and refunds", "Consultations are charged per minute from your wallet balance at the rate shown before you connect. Wallet money cannot be withdrawn as cash. If a session fails because of a technical fault on our side, the unused amount is returned to your wallet within 7 working days."],
    ["7. E-Puja and offerings", "Pujas are performed by our partner temples and priests on the date you choose, subject to temple schedules and festivals. Prasad delivery times are estimates. If a puja cannot be performed, you may reschedule it or receive a full refund."],
    ["8. Acceptable use", "Do not copy, resell or misuse content from the app, attempt to access other users' accounts, or interfere with how the service works. We may remove content or suspend accounts that break these rules."],
    ["9. Changes to the service", "We may add, change or retire features, and update these terms from time to time. When we make a material change we will tell you in the app; continuing to use Sarvdrishti after that means you accept the updated terms."],
    ["10. Liability", "To the extent the law allows, Sarvdrishti is not liable for decisions you make based on readings, or for indirect losses arising from use of the app. Nothing in these terms limits rights you have under Indian consumer law."],
    ["11. Governing law", "These terms are governed by the laws of India. Any dispute will be handled by the courts of Mumbai, Maharashtra."],
    ["12. Contact", "Questions about these terms? Write to support from the Profile screen; we reply within 2 working days."],
  ],
};

const hi: typeof en = {
  months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  changeLanguage: "भाषा बदलें",
  tagline: "आपके सितारे, आपके लिए",
  promise: "आपकी कुंडली, रोज़ का मार्गदर्शन और लाइव ज्योतिषी, एक ही जगह।",
  withMobile: "मोबाइल नंबर से आगे बढ़ें",
  withGoogle: "Google से आगे बढ़ें",
  terms: ["आगे बढ़कर आप हमारी", "शर्तों", "और", "गोपनीयता नीति", " से सहमत होते हैं"],
  medallions: ["आपका नाम", "आपके बारे में", "जन्म तिथि", "जन्म समय", "जन्म स्थान", "भाषाएँ"],
  stepOf: (n, of) => `चरण ${n} / ${of}`,
  back: "पीछे",
  signIn: "साइन इन",
  phoneQ: "आपका मोबाइल नंबर",
  phoneHint: "साइन इन और परामर्श की याद दिलाने के लिए।",
  phoneLabel: "मोबाइल नंबर",
  codeQ: "अपना कोड डालें",
  sentTo: "भेजा गया",
  change: "बदलें",
  codeLabel: "सत्यापन कोड",
  codeDemo: (n) => `यह डेमो कोई संदेश नहीं भेजता: कोई भी ${n} अंक चलेंगे।`,
  nameQ: "हम आपको किस नाम से पुकारें?",
  nameHint: "आपका नाम आपकी ब्रह्मांडीय यात्रा को आपका बनाता है।",
  nameLabel: "आपका नाम",
  namePlaceholder: "आपका पहला नाम",
  nameQuote: "नाम ब्रह्मांड का पहला उपहार है; उसकी अपनी तरंग होती है।",
  genderQ: "मैं हूँ",
  genderHint: "इससे विवाह और साझेदारी के फल सटीक होते हैं। आप इसे बाद में बदल सकते हैं।",
  genderLabel: "लिंग",
  genders: {
    male: ["पुरुष", "शुक्र आपका विवाह कारक"],
    female: ["महिला", "गुरु आपका विवाह कारक"],
    other: ["अन्य", "या न बताना चाहें: सबके लिए एक फल"],
  },
  dateQ: "आपका जन्म कब हुआ?",
  dateHint: "आपकी जन्म तिथि आपकी कुंडली की कुंजी है।",
  month: "महीना",
  day: "दिन",
  year: "वर्ष",
  knownQ: "क्या आप अपना जन्म समय जानते हैं?",
  knownHint: "जन्म समय से आपका लग्न तय होता है, जो आपके स्वभाव का फल बताता है।",
  yes: "हाँ, मुझे पता है",
  no: "नहीं, मुझे नहीं पता",
  knownQuote: "इसके बिना हम सूर्योदय का समय लेते हैं, तो लग्न अनुमानित होगा। आप इसे बाद में जोड़ सकते हैं।",
  timeQ: "किस समय?",
  timeHint: "अनुमानित समय से भी लग्न अधिक सटीक होता है।",
  hour: "घंटा",
  minute: "मिनट",
  ampm: "AM या PM",
  placeQ: "आपका जन्म कहाँ हुआ?",
  placeHint: "आपका जन्म स्थान ब्रह्मांडीय निर्देशांक तय करता है।",
  placeLabel: "शहर या कस्बा",
  placeSearch: "शहर या कस्बा खोजें",
  places: "स्थान",
  india: "भारत",
  langQ: "आपके ज्योतिषी कौन-सी भाषाएँ बोलें?",
  langHint: "जितनी चाहें उतनी चुनें।",
  reveal: "मेरे सितारे दिखाएँ",
  sendCode: "कोड भेजें",
  next: "आगे",
  ready: "आपकी कुंडली तैयार है",
  namaste: (name) => `नमस्ते, ${name || "मित्र"}`,
  readyLine: "सितारे आपकी प्रतीक्षा कर रहे थे।",
  seals: [
    ["लग्न", "सिंह"],
    ["राशि", "तुला"],
    ["नक्षत्र", "स्वाति"],
  ],
  born: "जन्म",
  timeUnknown: "समय अज्ञात",
  sample: "यह एक नमूना कुंडली है: इस डेमो में आपकी कोई जानकारी सहेजी नहीं जाती।",
  enter: "सर्वदृष्टि की दुनिया में प्रवेश करें",
  proceed: "आगे बढ़ें",
  termsTop: "शर्तें",
  termsQ: "नियम एवं शर्तें",
  termsHint: "स्वीकार करने के लिए कृपया अंत तक पढ़ें।",
  termsAgree: "मैंने नियम एवं शर्तें और गोपनीयता नीति पढ़ ली हैं और मैं सहमत हूँ",
  termsLocked: "स्वीकार करने के लिए शर्तों के अंत तक स्क्रॉल करें",
  termsBody: [
    ["1. इन शर्तों के बारे में", "ये शर्तें सर्वदृष्टि ऐप, उसकी वेबसाइट और उनके माध्यम से दी जाने वाली हर सेवा पर लागू होती हैं, जिसमें कुंडली, पंचांग, राशिफल, एस्ट्रो गुरु परामर्श, ई-पूजा, माला जाप, वास्तु AI और टैरो शामिल हैं। खाता बनाकर आप इन्हें पूरी तरह स्वीकार करते हैं।"],
    ["2. मार्गदर्शन, गारंटी नहीं", "ज्योतिष, वास्तु और टैरो व्याख्या की पारंपरिक पद्धतियाँ हैं। फल, भविष्यवाणियाँ और उपाय केवल आध्यात्मिक मार्गदर्शन और चिंतन के लिए हैं। ये चिकित्सा, कानूनी, वित्तीय या मनोवैज्ञानिक सलाह का विकल्प नहीं हैं, और किसी परिणाम का वादा नहीं किया जाता।"],
    ["3. आपका खाता", "ऐप उपयोग करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए, या अभिभावक की सहमति होनी चाहिए। अपना मोबाइल नंबर और साइन-इन कोड गोपनीय रखें; आपके खाते की गतिविधि के लिए आप ज़िम्मेदार हैं। दुरुपयोग का संदेह हो तो तुरंत हमें बताएँ।"],
    ["4. जन्म विवरण और गोपनीयता", "आपका नाम, जन्म तिथि, समय और स्थान केवल आपकी कुंडली बनाने और फल को आपके अनुसार ढालने के लिए उपयोग होते हैं। हम आपका निजी डेटा नहीं बेचते। आप प्रोफ़ाइल से या सहायता टीम को लिखकर कभी भी अपना डेटा सुधारने या हटाने को कह सकते हैं।"],
    ["5. ज्योतिषियों से परामर्श", "एस्ट्रो गुरु आपको स्वतंत्र ज्योतिषियों से जोड़ता है। वे हमारे कर्मचारी नहीं हैं, और उनके विचार उनके अपने हैं। चैट और कॉल में सम्मानजनक रहें; अभद्र व्यवहार पर आपका खाता बिना धनवापसी के निलंबित हो सकता है।"],
    ["6. वॉलेट, भुगतान और धनवापसी", "परामर्श का शुल्क जुड़ने से पहले दिखाई गई दर पर प्रति मिनट आपके वॉलेट से लिया जाता है। वॉलेट की राशि नकद नहीं निकाली जा सकती। हमारी ओर की तकनीकी खराबी से सत्र विफल हो तो बची राशि 7 कार्य दिवसों में आपके वॉलेट में लौटा दी जाती है।"],
    ["7. ई-पूजा और चढ़ावा", "पूजा हमारे सहयोगी मंदिरों और पुजारियों द्वारा आपकी चुनी तिथि पर, मंदिर के कार्यक्रम और त्योहारों के अनुसार की जाती है। प्रसाद पहुँचने का समय अनुमानित है। पूजा न हो सके तो आप उसे दोबारा तय कर सकते हैं या पूरी धनवापसी पा सकते हैं।"],
    ["8. स्वीकार्य उपयोग", "ऐप की सामग्री की नकल, पुनर्विक्रय या दुरुपयोग न करें, दूसरों के खातों तक पहुँचने का प्रयास न करें, और सेवा के काम में बाधा न डालें। इन नियमों को तोड़ने वाली सामग्री हम हटा सकते हैं या खाते निलंबित कर सकते हैं।"],
    ["9. सेवा में बदलाव", "हम समय-समय पर सुविधाएँ जोड़, बदल या बंद कर सकते हैं, और इन शर्तों को अपडेट कर सकते हैं। बड़े बदलाव की सूचना हम ऐप में देंगे; उसके बाद भी सर्वदृष्टि का उपयोग करने का अर्थ है कि आप नई शर्तें स्वीकार करते हैं।"],
    ["10. दायित्व", "कानून की अनुमति की सीमा तक, फल के आधार पर लिए गए आपके निर्णयों, या ऐप के उपयोग से हुई अप्रत्यक्ष हानि के लिए सर्वदृष्टि ज़िम्मेदार नहीं है। इन शर्तों में कुछ भी भारतीय उपभोक्ता कानून के तहत आपके अधिकारों को सीमित नहीं करता।"],
    ["11. लागू कानून", "ये शर्तें भारत के कानूनों के अधीन हैं। किसी भी विवाद का निपटारा मुंबई, महाराष्ट्र की अदालतों में होगा।"],
    ["12. संपर्क", "इन शर्तों के बारे में प्रश्न? प्रोफ़ाइल स्क्रीन से सहायता को लिखें; हम 2 कार्य दिवसों में उत्तर देते हैं।"],
  ],
};

const TEXT = { en, hi };
type Text = typeof en;

/* The medallions along the top: one per subject, so both birth-time screens
   sit under the clock */
const MEDALLIONS: { icon: GlyphName; steps: Step[] }[] = [
  { icon: "user", steps: ["name"] },
  { icon: "star", steps: ["gender"] },
  { icon: "calendar", steps: ["date"] },
  { icon: "clock", steps: ["knownTime", "time"] },
  { icon: "pin", steps: ["place"] },
  { icon: "chat", steps: ["languages"] },
];

/* The name, in the languages of the app (Marathi shares Hindi's script). The
   scripts are pre-drawn in the wordmark's crimson and gold, so no script fonts
   load; each sits centred in the same box. Timed by .name in the CSS. */
const NAMES = ["/logo/sarvdrishti-wordmark.webp", ...["hi", "bn", "ta", "te", "kn", "ml", "gu", "pa"].map((id) => `/logo/names/${id}.webp`)];

const GENDERS = ["male", "female", "other"] as const;

/* Onboarding: first the language, then the welcome, both with the signs
   drifting out of the night behind the eye; sign in by mobile number or
   Google; one question a screen under a row of gold medallions; the chart
   revealed; the terms, read to the end; then the app opening like an eye.
   The way back retraces the way you came. Nothing you enter is kept. */
export function Onboarding() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [trail, setTrail] = useState<Step[]>(["language"]);
  const [forward, setForward] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [date, setDate] = useState({ d: 14, m: 9, y: 2001 });
  const [time, setTime] = useState({ h: 6, min: 45, pm: false, unknown: false });
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState(-1);
  const [languages, setLanguages] = useState(["English", "Hindi"]);
  const [read, setRead] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const vanish = useRef<HTMLSpanElement>(null);
  const t = TEXT[lang];
  const shown = ([english, hindi]: [string, string]) => (lang === "hi" ? hindi : english);

  const step = trail[trail.length - 1];
  const sky = (x: Step) => x === "language" || x === "welcome";
  // Into or out of the night sky, the whole screen changes: dissolve between them
  const move = (to: Step[], ahead: boolean) => {
    const change = () => {
      setForward(ahead);
      setTrail(to);
    };
    if (sky(step) !== sky(to[to.length - 1])) fadeScreens(change);
    else change();
  };
  const go = (to: Step) => move([...trail, to], true);
  const back = () => move(trail.slice(0, -1), false);

  function enter() {
    moveSheet("enter", () => router.replace("/"));
  }

  // Read to the end (or nothing to scroll): the box can be ticked
  const checkRead = (el: HTMLElement | null) => {
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setRead(true);
  };

  if (sky(step)) {
    return (
      <main lang={lang} className={`page ${s.welcome}`}>
        <Immersive />
        <Universe vanish={vanish} />
        {step === "welcome" && (
          <button type="button" className={s.langSwitch} onClick={back} aria-label={t.changeLanguage}>
            <Icon name="chat" size={16} />
            {lang === "hi" ? "हिन्दी" : "English"}
          </button>
        )}
        <div className={s.brand}>
          <ZodiacRing className={s.markRing}>
            <div className={s.mark}>
              <span ref={vanish} className={s.vanish} aria-hidden />
              <span className={s.halo} aria-hidden />
              <span className={s.ripple} aria-hidden />
              <span className={s.eye}>
                <SarvEye />
              </span>
            </div>
          </ZodiacRing>
        </div>
        {/* The sky above, and the brand on the app's own light ground, where its crimson belongs */}
        <div key={step} className={s.sheet}>
          <div className={s.names} role="img" aria-label="Sarvdrishti">
            {NAMES.map((src, i) => (
              <Image key={src} src={src} alt="" width={472} height={128} unoptimized loading="eager" className={s.name} style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
          {step === "language" ? (
            <>
              <p className={`eyebrow ${s.langEyebrow}`}>
                Language · <span lang="hi">भाषा</span>
              </p>
              <h1 className={s.tagline}>Choose your language</h1>
              <p className={s.promise} lang="hi">
                अपनी भाषा चुनें
              </p>
              <div className={s.langs} role="radiogroup" aria-label="Language">
                {(
                  [
                    ["en", "Aa", "English", "Continue in English"],
                    ["hi", "अ", "हिन्दी", "हिन्दी में जारी रखें"],
                  ] as const
                ).map(([id, glyph, label, note]) => (
                  <button key={id} type="button" role="radio" aria-checked={id === lang} lang={id} className={`${s.langTile} pressable`} onClick={() => setLang(id)}>
                    <span className={s.langCheck} aria-hidden>
                      <Icon name="check" size={12} />
                    </span>
                    <span className={s.langGlyph} aria-hidden>
                      {glyph}
                    </span>
                    <strong>{label}</strong>
                    <small>{note}</small>
                  </button>
                ))}
              </div>
              <button type="button" className={`btn btn-primary ${s.wide} ${s.langGo}`} onClick={() => go("welcome")}>
                {lang === "hi" ? "आगे बढ़ें" : "Continue"}
                <Icon name="arrow" size={18} />
              </button>
              <p className={s.terms}>
                You can change it on the next screen · <span lang="hi">अगली स्क्रीन पर बदल सकते हैं</span>
              </p>
            </>
          ) : (
            <>
              <h1 className={s.tagline}>{t.tagline}</h1>
              <p className={s.promise}>{t.promise}</p>
              <div className={s.signIn}>
                <button type="button" className={`btn btn-primary ${s.wide}`} onClick={() => go("phone")}>
                  <Icon name="phone" size={18} />
                  {t.withMobile}
                </button>
                <button type="button" className={`btn btn-secondary ${s.wide}`} onClick={() => go("name")}>
                  <GoogleMark />
                  {t.withGoogle}
                </button>
              </div>
              <p className={s.terms}>
                {t.terms[0]} <u>{t.terms[1]}</u> {t.terms[2]} <u>{t.terms[3]}</u>
                {t.terms[4]}
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  if (step === "ready") {
    return (
      <main lang={lang} className={`page ${s.screen} ${s.readyScreen}`}>
        <Immersive />
        <ZodiacWheel center="tula" className={s.readyWheel} />
        <p className={`eyebrow ${s.readyEyebrow}`}>{t.ready}</p>
        <h1 className={s.readyTitle}>{t.namaste(name.trim().split(" ")[0])}</h1>
        <p className={s.readyLine}>{t.readyLine}</p>
        <ul className={s.seals}>
          {t.seals.map(([label, value], i) => {
            const sign = ["simha", "tula"][i];
            return (
              <li key={label} className={s.seal} style={{ "--n": i } as CSSProperties}>
                {sign ? (
                  <Image src={emblem(sign)} alt="" width={64} height={64} loading="eager" />
                ) : (
                  <span className={s.sealStar} aria-hidden>
                    <Icon name="star" size={30} />
                  </span>
                )}
                <span className={s.sealLabel}>{label}</span>
                <strong>{value}</strong>
              </li>
            );
          })}
        </ul>
        <p className={s.readyNote}>
          {t.born} {date.d} {t.months[date.m]} {date.y}
          {time.unknown ? `, ${t.timeUnknown}` : `, ${time.h}:${String(time.min).padStart(2, "0")} ${time.pm ? "PM" : "AM"}`}
          {place >= 0 && ` · ${shown(CITIES[place]).split(",")[0]}`}
          <br />
          <small>{t.sample}</small>
        </p>
        <button type="button" className={`btn btn-primary ${s.wide} ${s.enter}`} onClick={() => go("terms")}>
          {t.proceed}
          <Icon name="arrow" size={18} />
        </button>
      </main>
    );
  }

  const medal = MEDALLIONS.findIndex((m) => m.steps.includes(step));
  const answered: Partial<Record<Step, { ok: boolean; to: Step }>> = {
    phone: { ok: phone.length === 10, to: "code" },
    name: { ok: name.trim().length > 0, to: "gender" },
    gender: { ok: true, to: "date" },
    date: { ok: true, to: "knownTime" },
    time: { ok: true, to: "place" },
    place: { ok: place >= 0, to: "languages" },
    languages: { ok: languages.length > 0, to: "ready" },
    terms: { ok: agreed, to: "terms" },
  };
  const here = answered[step];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!here?.ok) return;
    if (step === "terms") enter();
    else go(here.to);
  }

  return (
    <main lang={lang} className={`page ${s.screen}`}>
      <Immersive />
      <ZodiacWheel bare className={s.backdropWheel} />

      <header className={`${s.top} screen-bar`}>
        <button type="button" className="icon-btn surface" aria-label={t.back} onClick={back}>
          <Icon name="arrow" size={20} className={s.flip} />
        </button>
        {medal >= 0 ? (
          /* A mala: gold beads on a thread that fills as you go, the step you're on its medallion */
          <ol className={s.mala} style={{ "--done": medal / (MEDALLIONS.length - 1) } as CSSProperties} aria-label={t.stepOf(medal + 1, MEDALLIONS.length)}>
            {MEDALLIONS.map((m, i) => (
              <li key={m.icon} className={s.bead} data-state={i === medal ? "now" : i < medal ? "done" : undefined}>
                {i === medal && (
                  <span className={s.medallion}>
                    <Icon name={m.icon} size={18} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className={s.topTitle}>{step === "terms" ? t.termsTop : t.signIn}</p>
        )}
      </header>

      <form key={step} className={s.form} data-forward={forward || undefined} onSubmit={submit}>
        {medal >= 0 && (
          <p className={`eyebrow ${s.stepLabel}`}>
            {t.stepOf(medal + 1, MEDALLIONS.length)} · {t.medallions[medal]}
          </p>
        )}
        {step === "phone" && (
          <>
            <h1 className={s.question}>{t.phoneQ}</h1>
            <p className={s.hint}>{t.phoneHint}</p>
            <label className={s.phone}>
              <span className={s.country}>+91</span>
              <span className="sr-only">{t.phoneLabel}</span>
              <input autoFocus inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" />
            </label>
          </>
        )}

        {step === "code" && (
          <>
            <h1 className={s.question}>{t.codeQ}</h1>
            <p className={s.hint}>
              {t.sentTo} +91 {phone}.{" "}
              <button type="button" className={s.textLink} onClick={back}>
                {t.change}
              </button>
            </p>
            <CodeField
              label={t.codeLabel}
              value={code}
              onChange={(v) => {
                setCode(v);
                if (v.length === CODE_LENGTH) go("name");
              }}
            />
            <p className={s.demoNote}>{t.codeDemo(CODE_LENGTH)}</p>
          </>
        )}

        {step === "name" && (
          <>
            <h1 className={s.question}>{t.nameQ}</h1>
            <p className={s.hint}>{t.nameHint}</p>
            <label className={s.card}>
              <span className="sr-only">{t.nameLabel}</span>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} autoComplete="given-name" />
            </label>
            <p className={s.quote}>&ldquo;{t.nameQuote}&rdquo;</p>
          </>
        )}

        {step === "gender" && (
          <>
            <h1 className={s.question}>{t.genderQ}</h1>
            <p className={s.hint}>{t.genderHint}</p>
            <div className={s.genders} role="radiogroup" aria-label={t.genderLabel}>
              {GENDERS.map((id) => (
                <button key={id} type="button" role="radio" aria-checked={gender === id} className={`${s.gender} pressable`} onClick={() => setGender(id)}>
                  <Image src={`/onboarding/${id}.webp`} alt="" width={64} height={64} loading="eager" className={s.genderArt} />
                  <span className={s.genderText}>
                    <strong>{t.genders[id][0]}</strong>
                    <small>{t.genders[id][1]}</small>
                  </span>
                  <span className={s.genderMark} aria-hidden>
                    <Icon name="check" size={14} />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "date" && (
          <>
            <h1 className={s.question}>{t.dateQ}</h1>
            <p className={s.hint}>{t.dateHint}</p>
            <DatePicker t={t} date={date} onChange={setDate} />
          </>
        )}

        {step === "knownTime" && (
          <>
            <h1 className={s.question}>{t.knownQ}</h1>
            <p className={s.hint}>{t.knownHint}</p>
            <div className={s.choices}>
              <button
                type="button"
                className={`${s.choice} pressable`}
                onClick={() => {
                  setTime({ ...time, unknown: false });
                  go("time");
                }}
              >
                <span className={s.choiceMark} data-yes aria-hidden>
                  <Icon name="check" size={18} />
                </span>
                {t.yes}
                <Icon name="chevron" size={18} className={s.choiceArrow} />
              </button>
              <button
                type="button"
                className={`${s.choice} pressable`}
                onClick={() => {
                  setTime({ ...time, unknown: true });
                  go("place");
                }}
              >
                <span className={s.choiceMark} aria-hidden>
                  <Icon name="close" size={18} />
                </span>
                {t.no}
                <Icon name="chevron" size={18} className={s.choiceArrow} />
              </button>
            </div>
            <p className={s.quote}>{t.knownQuote}</p>
          </>
        )}

        {step === "time" && (
          <>
            <h1 className={s.question}>{t.timeQ}</h1>
            <p className={s.hint}>{t.timeHint}</p>
            <div className={s.pickers}>
              <Picker label={t.hour} value={time.h} options={Array.from({ length: 12 }, (_, i) => [i + 1, String(i + 1)])} onChange={(h) => setTime((x) => ({ ...x, h }))} />
              <span className={s.colon} aria-hidden>
                :
              </span>
              <Picker label={t.minute} value={time.min} options={Array.from({ length: 60 }, (_, i) => [i, String(i).padStart(2, "0")])} onChange={(min) => setTime((x) => ({ ...x, min }))} />
              <Picker
                label={t.ampm}
                value={time.pm ? 1 : 0}
                options={[
                  [0, "AM"],
                  [1, "PM"],
                ]}
                onChange={(v) => setTime((x) => ({ ...x, pm: v === 1 }))}
              />
            </div>
          </>
        )}

        {step === "place" && (
          <>
            <h1 className={s.question}>{t.placeQ}</h1>
            <p className={s.hint}>{t.placeHint}</p>
            <label className={`${s.card} ${s.search}`}>
              <Icon name="search" size={20} />
              <span className="sr-only">{t.placeLabel}</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.placeSearch} />
            </label>
            <ul className={s.cities} role="radiogroup" aria-label={t.places}>
              {CITIES.map((c, i) => {
                // Either script finds it
                const q = query.trim().toLowerCase();
                if (q && !c.some((n) => n.toLowerCase().includes(q))) return null;
                const [city, state] = shown(c).split(", ");
                return (
                  <li key={c[0]}>
                    <button type="button" role="radio" aria-checked={place === i} className={s.city} onClick={() => setPlace(i)}>
                      <span>{city}</span>
                      <small>{state ?? t.india}</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {step === "languages" && (
          <>
            <h1 className={s.question}>{t.langQ}</h1>
            <p className={s.hint}>{t.langHint}</p>
            <ul className={s.languages}>
              {LANGUAGES.map((l) => {
                const on = languages.includes(l[0]);
                return (
                  <li key={l[0]}>
                    <button type="button" role="checkbox" aria-checked={on} className={s.language} onClick={() => setLanguages(on ? languages.filter((x) => x !== l[0]) : [...languages, l[0]])}>
                      {shown(l)}
                      <Icon name={on ? "check" : "plus"} size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {step === "terms" && (
          <>
            <h1 className={s.question}>{t.termsQ}</h1>
            <p className={s.hint}>{t.termsHint}</p>
            <div ref={checkRead} className={s.termsBox} tabIndex={0} onScroll={(e) => checkRead(e.currentTarget)}>
              {t.termsBody.map(([head, text]) => (
                <section key={head}>
                  <h2>{head}</h2>
                  <p>{text}</p>
                </section>
              ))}
            </div>
            <label className={s.agree} data-locked={!read || undefined}>
              <input type="checkbox" checked={agreed} disabled={!read} onChange={(e) => setAgreed(e.target.checked)} />
              <span>{read ? t.termsAgree : t.termsLocked}</span>
            </label>
          </>
        )}

        {here && (
          <button type="submit" className={`btn btn-primary ${s.wide} ${s.next}`} disabled={!here.ok}>
            {step === "terms" ? t.enter : step === "languages" ? t.reveal : step === "phone" ? t.sendCode : t.next}
            <Icon name="arrow" size={18} />
          </button>
        )}
      </form>
    </main>
  );
}

/* Six boxes over one real field, so paste and the phone's autofill just work */
function CodeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className={s.code}>
      <span className="sr-only">{label}</span>
      <input autoFocus inputMode="numeric" autoComplete="one-time-code" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))} />
      <span className={s.codeBoxes} aria-hidden>
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <span key={i} className={s.codeBox} data-now={i === value.length || undefined}>
            {value[i]}
          </span>
        ))}
      </span>
    </label>
  );
}

type BirthDate = { d: number; m: number; y: number };

function DatePicker({ t, date, onChange }: { t: Text; date: BirthDate; onChange: (update: (d: BirthDate) => BirthDate) => void }) {
  const days = new Date(date.y, date.m + 1, 0).getDate();
  // A shorter month pulls the day back into range
  useEffect(() => {
    if (date.d > days) onChange((x) => ({ ...x, d: days }));
  }, [date.d, days, onChange]);
  return (
    <div className={s.pickers}>
      <Picker label={t.month} value={date.m} options={t.months.map((m, i) => [i, m])} onChange={(m) => onChange((x) => ({ ...x, m }))} />
      <Picker label={t.day} value={Math.min(date.d, days)} options={Array.from({ length: days }, (_, i) => [i + 1, String(i + 1)])} onChange={(d) => onChange((x) => ({ ...x, d }))} />
      <Picker label={t.year} value={date.y} options={Array.from({ length: 90 }, (_, i) => [2026 - i, String(2026 - i)])} onChange={(y) => onChange((x) => ({ ...x, y }))} />
    </div>
  );
}

const ROW = 48; // one row of a picker, matching .option in the CSS

/* A scroll wheel with no library: CSS snaps the rows and whichever sits in the
   middle is the value. Tap a row or use the arrow keys to move it too. */
function Picker({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (v: number) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const index = Math.max(0, options.findIndex(([v]) => v === value));
  const moveTo = (i: number) => list.current?.scrollTo({ top: i * ROW, behavior: "smooth" });

  // Start on the value, and follow it when it changes from outside (a shorter month)
  useLayoutEffect(() => {
    const el = list.current;
    if (el && Math.round(el.scrollTop / ROW) !== index) el.scrollTop = index * ROW;
  }, [index]);

  return (
    <div
      ref={list}
      className={s.picker}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuetext={options[index]?.[1]}
      onScroll={(e) => {
        const option = options[Math.round(e.currentTarget.scrollTop / ROW)];
        if (option && option[0] !== value) onChange(option[0]);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          moveTo(Math.min(options.length - 1, Math.max(0, index + (e.key === "ArrowDown" ? 1 : -1))));
        }
      }}
    >
      {options.map(([v, text], i) => (
        <button key={v} type="button" tabIndex={-1} className={s.option} data-on={i === index || undefined} onClick={() => moveTo(i)}>
          {text}
        </button>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.640 9.200c0-.640-.060-1.250-.160-1.840H9v3.480h4.840a4.140 4.140 0 0 1-1.800 2.720v2.260h2.920c1.700-1.570 2.680-3.880 2.680-6.620z" />
      <path fill="#34A853" d="M9 18c2.430 0 4.470-.800 5.960-2.180l-2.920-2.260c-.800.540-1.830.860-3.040.860-2.340 0-4.320-1.580-5.030-3.700H.960v2.330A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.970 10.720a5.400 5.400 0 0 1 0-3.440V4.950H.960a9 9 0 0 0 0 8.100z" />
      <path fill="#EA4335" d="M9 3.580c1.320 0 2.510.450 3.440 1.350l2.580-2.580A9 9 0 0 0 .960 4.950l3.010 2.330C4.680 5.160 6.660 3.580 9 3.580z" />
    </svg>
  );
}
