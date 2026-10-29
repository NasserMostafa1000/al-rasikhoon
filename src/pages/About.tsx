import { useTranslation } from "react-i18next";
import { company } from "../data/company";

const journey = [
  {
    ar: "التأسيس",
    en: "Founded",
    bodyAr: "في 10 يونيو 2002 تأسست الراسخون للعقارات في إمارة دبي كلبنة أولى لمسيرة عقارية طويلة.",
    bodyEn: "On 10 June 2002, Al Rasikhoon Real Estate was founded in Dubai — the first brick of a lasting journey.",
  },
  {
    ar: "التوسع",
    en: "Expansion",
    bodyAr: "انتقلت الشركة من المعاملات العقارية إلى تسويق الأراضي السكنية والتجارية والصناعية وبناء قاعدة عملاء وفية.",
    bodyEn: "From brokerage into marketing residential, commercial and industrial land — with a loyal client base.",
  },
  {
    ar: "الصمود",
    en: "Resilience",
    bodyAr: "خلال الأزمة المالية العالمية خرجت الشركة أقوى بخبرة إدارية أعمق وتركيز أوضح على رضا العميل.",
    bodyEn: "Through the global financial crisis the company emerged stronger, wiser, and more client-focused.",
  },
  {
    ar: "الشراكات",
    en: "Partnerships",
    bodyAr: "شراكات استراتيجية خليجية وعلاقات راقية مع العملاء أوصلت رسالة الراسخون إلى المستثمر النهائي.",
    bodyEn: "Gulf partnerships and refined client relations carried the Al Rasikhoon message to end investors.",
  },
];

const values = [
  { ar: "الاحترافية", en: "Professionalism" },
  { ar: "النزاهة", en: "Integrity" },
  { ar: "التميز", en: "Excellence" },
  { ar: "الشراكة", en: "Partnership" },
  { ar: "رضا العملاء", en: "Client satisfaction" },
];

export default function About() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm tracking-[0.2em] text-gold">{company.foundedLabelAr}</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold md:text-6xl">{t("about.title")}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-soft">
        {ar
          ? "شركة الراسخون العقارية، التي تأسست في دبي عام 2002، أصبحت رمزاً للتميز في الاستثمار العقاري والتسويق بالإمارات. نفخر بتفانينا في إرضاء العملاء وبناء شراكات استراتيجية، ونلتزم بمشاريع ترفع جودة الحياة في عجمان والإمارات."
          : "Founded in Dubai in 2002, Al Rasikhoon Real Estate has become a mark of excellence in UAE property investment and marketing — devoted to clients, strategic partnerships, and projects that raise living standards across Ajman and the Emirates."}
      </p>
      <p className="mt-4 text-sm font-semibold text-sea">{ar ? company.ratingAr : company.ratingEn}</p>

      <h2 className="mt-16 font-display text-3xl font-bold">{t("about.journey")}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {journey.map((item) => (
          <article key={item.en} className="border-t border-gold/50 pt-5">
            <h3 className="font-display text-xl font-bold text-sea">{ar ? item.ar : item.en}</h3>
            <p className="mt-3 leading-7 text-ink-soft">{ar ? item.bodyAr : item.bodyEn}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl font-bold">{t("about.values")}</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {values.map((v) => (
          <span key={v.en} className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold">
            {ar ? v.ar : v.en}
          </span>
        ))}
      </div>
    </div>
  );
}
