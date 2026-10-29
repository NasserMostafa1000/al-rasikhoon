import { useTranslation } from "react-i18next";
import SocialIcons from "../components/SocialIcons";
import { company, whatsappLink } from "../data/company";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h1 className="font-display text-4xl font-bold md:text-5xl">{t("contact.title")}</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gold">{t("contact.office")}</p>
            <p className="mt-2 text-lg leading-8">{ar ? company.addressAr : company.addressEn}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold">{t("contact.hotline")}</p>
            <a href={`tel:${company.hotlineIntl}`} className="mt-2 block text-2xl font-bold">
              {company.hotlineIntl}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold">{t("contact.whatsapp")}</p>
            <a href={whatsappLink()} className="mt-2 block text-lg" target="_blank" rel="noreferrer">
              {company.hotlineIntl}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-gold">{t("contact.email")}</p>
            <a href={`mailto:${company.email}`} className="mt-2 block text-lg">
              {company.email}
            </a>
            <a href={`mailto:${company.careersEmail}`} className="mt-1 block text-sm text-ink-muted">
              {company.careersEmail}
            </a>
          </div>
          <a
            href={whatsappLink(ar ? "السلام عليكم، تواصلت عبر موقع الراسخون الجديد." : "Hello, I reached you via the new Al Rasikhoon site.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-gold px-6 py-3 font-bold text-ink shadow-gold"
          >
            {t("contact.write")}
          </a>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-gold">{t("contact.social")}</p>
          <SocialIcons variant="grid" />
          <p className="mt-6 text-xs text-ink-muted">
            {ar
              ? `رخصة ${company.license} · قيد ${company.registry} · تصريح إعلان ${company.adPermit}`
              : `License ${company.license} · Registry ${company.registry} · Ad permit ${company.adPermit}`}
          </p>
        </div>
      </div>
    </div>
  );
}
