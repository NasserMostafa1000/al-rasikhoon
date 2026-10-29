export type AptCard = {
  id: string;
  floor: number;
  unit: string;
  type: string;
  priceAed: number;
  sizeSqft: number;
  images: string[];
  available: boolean;
};

export type KphReply = {
  thinking: string;
  answer: string;
  apartments: AptCard[];
};

type Intent = {
  isApartment: boolean;
  type: string | null;
  floor: number | null;
  budget: number | null;
};

const inventory: AptCard[] = [
  { id: "F12-U03", floor: 12, unit: "1203", type: "studio", priceAed: 460_000, sizeSqft: 575, available: true, images: ["/images/interior/living.jpg", "/images/interior/kitchen.jpg"] },
  { id: "F14-U01", floor: 14, unit: "1401", type: "studio", priceAed: 518_000, sizeSqft: 615, available: true, images: ["/images/interior/living.jpg", "/images/tower/exterior-render.jpg"] },
  { id: "F15-U07", floor: 15, unit: "1507", type: "studio", priceAed: 485_000, sizeSqft: 590, available: true, images: ["/images/interior/balcony.jpg", "/images/interior/living.jpg"] },
  { id: "F10-U08", floor: 10, unit: "1008", type: "studio", priceAed: 445_000, sizeSqft: 575, available: true, images: ["/images/interior/kitchen.jpg", "/images/interior/bathroom.jpg"] },
  { id: "F18-U02", floor: 18, unit: "1802", type: "1br", priceAed: 838_000, sizeSqft: 1369, available: true, images: ["/images/interior/living.jpg", "/images/interior/bedroom.jpg"] },
  { id: "F20-U05", floor: 20, unit: "2005", type: "1br", priceAed: 796_000, sizeSqft: 1180, available: true, images: ["/images/interior/bedroom.jpg", "/images/interior/balcony.jpg"] },
  { id: "F22-U04", floor: 22, unit: "2204", type: "1br", priceAed: 910_000, sizeSqft: 1350, available: true, images: ["/images/interior/living.jpg", "/images/interior/kitchen.jpg"] },
  { id: "F25-U01", floor: 25, unit: "2501", type: "2br", priceAed: 1_350_000, sizeSqft: 1772, available: true, images: ["/images/interior/living.jpg", "/images/interior/bedroom.jpg"] },
  { id: "F28-U03", floor: 28, unit: "2803", type: "2br", priceAed: 1_538_000, sizeSqft: 1819, available: true, images: ["/images/interior/balcony.jpg", "/images/interior/living.jpg"] },
  { id: "F30-U06", floor: 30, unit: "3006", type: "2br", priceAed: 1_420_000, sizeSqft: 1690, available: true, images: ["/images/interior/kitchen.jpg", "/images/interior/bedroom.jpg"] },
  { id: "F35-U02", floor: 35, unit: "3502", type: "3br", priceAed: 2_253_000, sizeSqft: 2253, available: true, images: ["/images/interior/living.jpg", "/images/interior/bedroom.jpg", "/images/interior/balcony.jpg"] },
  { id: "F38-U01", floor: 38, unit: "3801", type: "3br", priceAed: 2_480_000, sizeSqft: 2400, available: true, images: ["/images/interior/living.jpg", "/images/tower/exterior-render.jpg"] },
];

function detectLang(message: string, preferred?: string): "ar" | "en" {
  if (preferred?.startsWith("en")) return "en";
  if (preferred?.startsWith("ar")) return "ar";
  return /[\u0600-\u06FF]/.test(message) ? "ar" : "en";
}

function parseBudget(message: string): number | null {
  const cleaned = message.replace(/,/g, "").replace(/،/g, "");
  const hasBudgetWord = /ميزاني|budget|سعر|price|under|اقل|أقل|within|درهم|aed/i.test(cleaned);
  const scaled = cleaned.match(/(\d+(?:\.\d+)?)\s*(k|ألف|الف|مليون|million|m)\b/i);
  if (scaled) {
    let n = Number(scaled[1]);
    const unit = scaled[2].toLowerCase();
    if (unit === "k" || unit === "ألف" || unit === "الف") n *= 1000;
    else n *= 1_000_000;
    return n >= 100_000 && n <= 20_000_000 ? Math.round(n) : null;
  }
  if (!hasBudgetWord) return null;
  const plain = cleaned.match(/(\d{3,8})/);
  if (!plain) return null;
  let n = Number(plain[1]);
  if (n < 10_000) n *= 1000;
  return n >= 100_000 && n <= 20_000_000 ? n : null;
}

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();
  let type: string | null = null;
  if (/studio|استوديو/.test(lower)) type = "studio";
  else if (/3\s*b|ثلاث|ثلاثة غرف|3br/.test(lower)) type = "3br";
  else if (/2\s*b|غرفتين|2br/.test(lower)) type = "2br";
  else if (/1\s*b|غرفة وصالة|غرفه وصاله|one bedroom|1br/.test(lower)) type = "1br";

  let floor: number | null = null;
  const floorMatch = message.match(/(?:floor|طابق)\s*(\d{1,2})/i) || message.match(/(\d{1,2})\s*(?:طابق|floor)/i);
  if (floorMatch) floor = Number(floorMatch[1]);

  const budget = parseBudget(message);
  let isApartment =
    /studio|استوديو|شقه|شقة|طابق|غرفة|غرفتين|bedroom|apartment|unit|floor|ميزاني|budget|درهم|aed/i.test(lower) ||
    Boolean(type || floor || budget);

  if (!budget && !type && !floor && !/ميزاني|budget|سعر|price|under|اقل|أقل|within/i.test(lower)) {
    isApartment = isApartment && /studio|استوديو|شقه|شقة|apartment|غرفة|غرفتين|bedroom/i.test(lower);
  }

  return { isApartment, type, floor, budget };
}

function typeLabel(type: string, lang: "ar" | "en") {
  const map: Record<string, { ar: string; en: string }> = {
    studio: { ar: "استوديو", en: "Studio" },
    "1br": { ar: "غرفة وصالة", en: "1 Bedroom" },
    "2br": { ar: "غرفتين وصالة", en: "2 Bedrooms" },
    "3br": { ar: "ثلاث غرف", en: "3 Bedrooms" },
  };
  return map[type]?.[lang] || type;
}

function matchApartments(intent: Intent): AptCard[] {
  let list = inventory.filter((a) => a.available);
  if (intent.type) list = list.filter((a) => a.type === intent.type);
  if (intent.floor != null) list = list.filter((a) => Math.abs(a.floor - intent.floor!) <= 2);
  if (intent.budget != null) list = list.filter((a) => a.priceAed <= intent.budget! * 1.05);
  list = list.sort((a, b) => a.priceAed - b.priceAed);
  if (!list.length && intent.isApartment) {
    list = inventory
      .filter((a) => a.available && (!intent.type || a.type === intent.type))
      .sort((a, b) => a.priceAed - b.priceAed)
      .slice(0, 3);
  }
  return list.slice(0, 4);
}

function buildThinking(intent: Intent, lang: "ar" | "en") {
  if (lang === "en") {
    const lines = [
      "Reading the visitor message and detecting language…",
      `Query focus: ${intent.isApartment ? "unit search in Al Watan Tower" : "company / general enquiry"}.`,
    ];
    if (intent.budget) lines.push(`Budget signal detected around AED ${intent.budget.toLocaleString("en-AE")}.`);
    if (intent.type) lines.push(`Preferred unit type: ${intent.type}.`);
    if (intent.floor) lines.push(`Floor preference: ${intent.floor}.`);
    lines.push("Checking Al Rasikhoon knowledge + Al Watan inventory…");
    lines.push("Preparing a clear reply in English.");
    return lines.join(" ");
  }
  const lines = [
    "أقرأ رسالة الزائر وأحدد اللغة…",
    `محور السؤال: ${intent.isApartment ? "بحث وحدة في برج الوطن" : "استفسار عن الشركة / معلومات عامة"}.`,
  ];
  if (intent.budget) lines.push(`إشارة ميزانية حوالي ${intent.budget.toLocaleString("ar-AE")} درهم.`);
  if (intent.type) lines.push(`نوع الوحدة المفضّل: ${typeLabel(intent.type, "ar")}.`);
  if (intent.floor) lines.push(`تفضيل الطابق: ${intent.floor}.`);
  lines.push("أراجع معرفة الراسخون ومخزون برج الوطن…");
  lines.push("أجهّز رداً واضحاً بالعربية.");
  return lines.join(" ");
}

function companyAnswer(message: string, lang: "ar" | "en") {
  const lower = message.toLowerCase();
  if (/موظف|team|موظف|adel|عادل|كريم|حسام|خليفة|elfaki|توظيف|recruit/i.test(lower)) {
    return lang === "ar"
      ? "من وجوه القيادة في الراسخون: خليفة سلطان بن حارب المهيري (المالك والمدير العام)، د. كريم أبو شليح (مدير المبيعات)، حسام عوض (المالية والإدارة)، محمد الفكي (سوشيال ميديا)، ومهندس محمد عادل (مسؤول التوظيف). للتواصل: 8005454 أو careers@alrasikhoon.ae"
      : "Leadership includes Khalifa Sultan Bin Harib Almheiri (Owner & GM), Dr. Karim Aboushelih (Sales Director), Hossam Awad (Finance & Admin), Mohamed Elfaki (Social Media), and Eng. Mohamed Adel (Recruitment). Call 8005454 or careers@alrasikhoon.ae";
  }
  if (/تواصل|contact|هاتف|phone|واتس|whatsapp|ايميل|email/i.test(lower)) {
    return lang === "ar"
      ? "تواصل الراسخون: الخط المجاني 8005454 · واتساب https://wa.me/9718005454 · info@alrasikhoon.ae · المكتب: شارع خليفة بن زايد، النعيمية 1، عجمان."
      : "Contact Al Rasikhoon: free call 8005454 · WhatsApp https://wa.me/9718005454 · info@alrasikhoon.ae · Office: Khalifa Bin Zayed St, Al Nuaimia 1, Ajman.";
  }
  if (/سوشيال|social|انستا|instagram|فيسبوك|facebook|تيك/i.test(lower)) {
    return lang === "ar"
      ? "صفحاتنا: Instagram @alrasikhoon.ae · Facebook alrasikhoon.ae · TikTok @alrasikhoon.ae · LinkedIn · YouTube · X @alrasikhoon · Telegram · Linktree linktr.ee/alrasikhoon"
      : "Social: Instagram @alrasikhoon.ae · Facebook alrasikhoon.ae · TikTok @alrasikhoon.ae · LinkedIn · YouTube · X @alrasikhoon · Telegram · Linktree linktr.ee/alrasikhoon";
  }
  if (/مشروع|project|قاسمية|سدر|صجعة|مها|باهية/i.test(lower)) {
    return lang === "ar"
      ? "من مشاريع الراسخون: بوابة القاسمية، روضة السدر، بساتين السرة، الصجعة الصناعية، الحليو، قرية المها، الباهية، وبرج الوطن على كورنيش عجمان. اسألني عن أي مشروع أو عن ميزانية شقة في برج الوطن."
      : "Projects include Al Qasimiya Gate, Rawdat Al Sidr, Basatin Al Serra, Sajaa Industrial, Al Helio, Almaha Village, Albahia, and Al Watan Tower on Ajman Corniche. Ask about any project or a unit budget in Al Watan Tower.";
  }
  if (/مرحبا|السلام|hello|hi|hey|صباح|مساء/i.test(lower)) {
    return lang === "ar"
      ? "أهلاً بك! أنا KPH مساعد الراسخون. اسأل عن برج الوطن، الميزانية، المشاريع، الفريق، أو وسائل التواصل."
      : "Welcome! I’m KPH for Al Rasikhoon. Ask about Al Watan Tower, budgets, projects, the team, or contact channels.";
  }
  return lang === "ar"
    ? "الراسخون العقارية تأسست 10 يونيو 2002. تقييم 5+ نجوم بعجمان. أبرز العروض حالياً تشمل برج الوطن (استوديو من حوالي 460 ألف درهم) ومشاريع أراضٍ في الشارقة وعجمان وأم القيوين. للاستفسار: 8005454."
    : "Al Rasikhoon Real Estate was founded 10 June 2002, rated 5+ stars in Ajman. Highlights include Al Watan Tower (studios from about AED 460k) and land projects across Sharjah, Ajman and UAQ. Call 8005454.";
}

function apartmentAnswer(matches: AptCard[], lang: "ar" | "en") {
  if (!matches.length) {
    return lang === "ar"
      ? "ما لقيت وحدة مطابقة حالياً في المخزون التجريبي. جرّب رفع الميزانية أو تغيير النوع، أو واتساب 8005454."
      : "No matching unit in the demo inventory. Try raising the budget or changing type, or WhatsApp 8005454.";
  }
  if (lang === "en") {
    const lines = ["Here are available Al Watan Tower options:"];
    for (const m of matches) {
      lines.push(`• Apt ${m.unit} · Floor ${m.floor} · ${typeLabel(m.type, "en")} · AED ${m.priceAed.toLocaleString("en-AE")} · ${m.sizeSqft} sqft`);
    }
    lines.push("Photos are attached below. For booking: WhatsApp 8005454.");
    return lines.join("\n");
  }
  const lines = ["هذه وحدات متاحة من برج الوطن:"];
  for (const m of matches) {
    lines.push(`• شقة ${m.unit} · طابق ${m.floor} · ${typeLabel(m.type, "ar")} · ${m.priceAed.toLocaleString("ar-AE")} درهم · ${m.sizeSqft} قدم²`);
  }
  lines.push("الصور مرفقة بالأسفل. للحجز واتساب 8005454.");
  return lines.join("\n");
}

export function buildKphReply(message: string, preferredLang?: string): KphReply {
  const lang = detectLang(message, preferredLang);
  const intent = detectIntent(message);
  const thinking = buildThinking(intent, lang);
  if (intent.isApartment) {
    const apartments = matchApartments(intent);
    return { thinking, answer: apartmentAnswer(apartments, lang), apartments };
  }
  return { thinking, answer: companyAnswer(message, lang), apartments: [] };
}

function* chars(text: string) {
  const seg = typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)
    : null;
  if (seg) {
    for (const s of seg) yield s.segment;
  } else {
    for (const ch of text) yield ch;
  }
}

export type KphStreamEvent =
  | { thinkingToken: string }
  | { thinkingDone: true }
  | { token: string }
  | { apartments: AptCard[] }
  | { done: true };

export async function streamKphReply(
  message: string,
  preferredLang: string | undefined,
  onEvent: (ev: KphStreamEvent) => void,
  signal?: AbortSignal,
) {
  const packed = buildKphReply(message, preferredLang);
  for (const ch of chars(packed.thinking)) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    onEvent({ thinkingToken: ch });
    await delay(10);
  }
  onEvent({ thinkingDone: true });
  await delay(80);
  for (const ch of chars(packed.answer)) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    onEvent({ token: ch });
    await delay(8);
  }
  if (packed.apartments.length) onEvent({ apartments: packed.apartments });
  onEvent({ done: true });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
