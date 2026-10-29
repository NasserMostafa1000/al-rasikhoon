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

function snip(message: string, max = 90) {
  const one = message.trim().replace(/\s+/g, " ");
  return one.length <= max ? one : `${one.slice(0, max - 1)}…`;
}

function buildThinking(message: string, intent: Intent, lang: "ar" | "en") {
  const lower = message.toLowerCase();
  if (intent.isApartment) {
    if (lang === "en") {
      const lines = [
        `Visitor asked: "${snip(message)}".`,
        "This looks like an Al Watan Tower unit search.",
      ];
      if (intent.budget) lines.push(`Budget cue around AED ${intent.budget.toLocaleString("en-AE")}.`);
      if (intent.type) lines.push(`Unit type cue: ${intent.type}.`);
      if (intent.floor) lines.push(`Floor cue: ${intent.floor}.`);
      lines.push("Matching demo inventory and preparing unit cards.");
      return lines.join(" ");
    }
    const lines = [
      `الزائر سأل: "${snip(message)}".`,
      "يبدو بحث وحدة في برج الوطن.",
    ];
    if (intent.budget) lines.push(`إشارة ميزانية حوالي ${intent.budget.toLocaleString("ar-AE")} درهم.`);
    if (intent.type) lines.push(`نوع الوحدة: ${typeLabel(intent.type, "ar")}.`);
    if (intent.floor) lines.push(`تفضيل الطابق: ${intent.floor}.`);
    lines.push("أطابق المخزون التجريبي وأجهّز بطاقات الوحدات.");
    return lines.join(" ");
  }

  let topicEn = "general company enquiry";
  let topicAr = "استفسار عام عن الشركة";
  if (/مبرمج|مطور|مطوّر|programmer|developer|who (built|made|coded)|من (عمل|صنع|برمج)|مين (عمل|برمج)/i.test(lower)) {
    topicEn = "who built / programmed this website";
    topicAr = "من برمج أو طوّر هذا الموقع";
  } else if (/تفهم عربي|بتفهم عربي|understand arabic|speak arabic|عربي ولا/i.test(lower)) {
    topicEn = "whether the assistant understands Arabic";
    topicAr = "هل المساعد يفهم العربية";
  } else if (/تواصل|contact|هاتف|phone|واتس|whatsapp|ايميل|email/i.test(lower)) {
    topicEn = "company contact channels";
    topicAr = "وسائل التواصل مع الشركة";
  } else if (/موظف|team|adel|عادل|كريم|حسام|خليفة|توظيف|recruit/i.test(lower)) {
    topicEn = "team / recruitment people";
    topicAr = "الفريق أو التوظيف";
  } else if (/وطن|watan|tower|برج/i.test(lower)) {
    topicEn = "Al Watan Tower details";
    topicAr = "تفاصيل برج الوطن";
  } else if (/مشروع|project|قاسمية|سدر|صجعة/i.test(lower)) {
    topicEn = "Al Rasikhoon projects";
    topicAr = "مشاريع الراسخون";
  }

  return lang === "en"
    ? `Visitor asked: "${snip(message)}". Topic: ${topicEn}. Pull only the facts needed for this question and answer directly.`
    : `الزائر سأل: "${snip(message)}". الموضوع: ${topicAr}. أراجع فقط ما يلزم لهذا السؤال وأرد مباشرة.`;
}

function companyAnswer(message: string, lang: "ar" | "en") {
  const lower = message.toLowerCase();

  if (/مبرمج|مطور|مطوّر|programmer|developer|who (built|made|coded|developed)|من (عمل|صنع|برمج|بنى|بني)|مين (عمل|برمج)/i.test(lower)) {
    return lang === "ar"
      ? "مبرمج الموقع ده هو ناصر مصطفى. عمل الموقع ووكيل KPH كعرض قدرات لفرصة عمل في الراسخون، ودمجه مع باك إند Casco."
      : "This site was built by Nasser Mostafa. He built the site and the KPH agent as a capability demo for a role at Al Rasikhoon, integrated with the Casco backend.";
  }

  if (/تفهم عربي|بتفهم عربي|تتكلم عربي|understand arabic|speak arabic|عربي ولا/i.test(lower)) {
    return lang === "ar"
      ? "أيوه، بفهم عربي وإنجليزي. اسألني اللي تحتاجه عن الراسخون أو برج الوطن وأرد بنفس لغة سؤالك."
      : "Yes — I understand Arabic and English. Ask about Al Rasikhoon or Al Watan Tower and I’ll reply in your language.";
  }

  if (/ذكاء|openai|open ai|كاسكو|casco|وكيل|ai agent|كيف تشتغل|ازاي تشتغل/i.test(lower)) {
    return lang === "ar"
      ? "أنا KPH مساعد الراسخون. مصمم يشتغل عبر Casco مع نماذج OpenAI للرد الطبيعي، ولو الخدمة البعيدة مش متاحة بوقت معيّن أكمّل محلياً عشان الشات يفضل شغال."
      : "I’m KPH for Al Rasikhoon. I’m built to answer naturally through Casco with OpenAI models, and if the remote service is briefly unavailable I continue locally so chat stays up.";
  }

  if (/وطن|watan|tower|برج/i.test(lower)) {
    return lang === "ar"
      ? "برج الوطن على كورنيش عجمان: تملك حر، استوديو من حوالي 460 ألف درهم، غرفة وصالة من حوالي 838 ألف، غرفتين من حوالي 1.35 مليون، وثلاث غرف من حوالي 2.25 مليون. قولي ميزانيتك أو نوع الوحدة وأرشّح لك."
      : "Al Watan Tower on Ajman Corniche: freehold. Studios from about AED 460k, 1BR from about 838k, 2BR from about 1.35M, 3BR from about 2.25M. Tell me your budget or unit type and I’ll shortlist options.";
  }

  if (/موظف|team|adel|عادل|كريم|حسام|خليفة|elfaki|توظيف|recruit/i.test(lower)) {
    return lang === "ar"
      ? "من وجوه القيادة: خليفة سلطان بن حارب المهيري (المالك والمدير العام)، د. كريم أبو شليح (المبيعات)، حسام عوض (المالية والإدارة)، محمد الفكي (سوشيال)، ومهندس محمد عادل (التوظيف). careers@alrasikhoon.ae أو 8005454."
      : "Leadership includes Khalifa Sultan Bin Harib Almheiri (Owner & GM), Dr. Karim Aboushelih (Sales), Hossam Awad (Finance & Admin), Mohamed Elfaki (Social), and Eng. Mohamed Adel (Recruitment). careers@alrasikhoon.ae or 8005454.";
  }

  if (/تواصل|contact|هاتف|phone|واتس|whatsapp|ايميل|email/i.test(lower)) {
    return lang === "ar"
      ? "تقدر تتواصل على 8005454، واتساب https://wa.me/9718005454، أو info@alrasikhoon.ae — المكتب في شارع خليفة بن زايد، النعيمية 1، عجمان."
      : "Reach them on 8005454, WhatsApp https://wa.me/9718005454, or info@alrasikhoon.ae — office on Khalifa Bin Zayed St, Al Nuaimia 1, Ajman.";
  }

  if (/سوشيال|social|انستا|instagram|فيسبوك|facebook|تيك/i.test(lower)) {
    return lang === "ar"
      ? "حساباتهم: Instagram @alrasikhoon.ae · Facebook alrasikhoon.ae · TikTok @alrasikhoon.ae · LinkedIn · YouTube · X @alrasikhoon · Telegram · Linktree linktr.ee/alrasikhoon"
      : "Socials: Instagram @alrasikhoon.ae · Facebook alrasikhoon.ae · TikTok @alrasikhoon.ae · LinkedIn · YouTube · X @alrasikhoon · Telegram · Linktree linktr.ee/alrasikhoon";
  }

  if (/مشروع|project|قاسمية|سدر|صجعة|مها|باهية/i.test(lower)) {
    return lang === "ar"
      ? "من المشاريع: بوابة القاسمية، روضة السدر، بساتين السرة، الصجعة، الحليو، قرية المها، الباهية، وبرج الوطن. حابب تفاصيل مشروع معيّن؟"
      : "Projects include Al Qasimiya Gate, Rawdat Al Sidr, Basatin Al Serra, Sajaa, Al Helio, Almaha Village, Albahia, and Al Watan Tower. Want details on one of them?";
  }

  if (/عن الشركة|من هي|تأسس|founded|about (the )?company|الراسخون مين/i.test(lower)) {
    return lang === "ar"
      ? "الراسخون العقارية تأسست 10 يونيو 2002، وتقييمها 5+ نجوم في عجمان. عندهم مشاريع أراضٍ وشقق، وأبرزها حالياً برج الوطن. عايز أسعار ولا تواصل؟"
      : "Al Rasikhoon Real Estate was founded 10 June 2002 and is rated 5+ stars in Ajman. They offer land and apartment projects, notably Al Watan Tower. Want prices or contact details?";
  }

  if (/مرحبا|السلام|hello|hi\b|hey|صباح|مساء/i.test(lower)) {
    return lang === "ar"
      ? "أهلاً! أنا KPH. اسألني عن برج الوطن، ميزانية شقة، المشاريع، الفريق، أو مين برمج الموقع."
      : "Hi! I’m KPH. Ask about Al Watan Tower, a budget, projects, the team, or who built this site.";
  }

  return lang === "ar"
    ? "فهمت سؤالك. قولي بالتحديد: أسعار برج الوطن، مشروع معيّن، تواصل الشركة، الفريق، أو مين برمج الموقع — وأجاوبك مباشرة."
    : "Got it. Tell me exactly what you need: Al Watan prices, a project, company contacts, the team, or who built this site — and I’ll answer directly.";
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
  const thinking = buildThinking(message, intent, lang);
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
