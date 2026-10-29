import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");

  function setLang(lang: "ar" | "en") {
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }

  return (
    <div className="inline-flex overflow-hidden rounded-full border border-ink/10 bg-white/70 text-xs font-semibold backdrop-blur">
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`px-3 py-1.5 transition ${isAr ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"}`}
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 transition ${!isAr ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"}`}
      >
        EN
      </button>
    </div>
  );
}
