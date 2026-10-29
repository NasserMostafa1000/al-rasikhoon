import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { projects } from "../data/company";

export default function Projects() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h1 className="font-display text-4xl font-bold md:text-5xl">{t("projects.title")}</h1>
      <p className="mt-3 text-ink-muted">{t("projects.subtitle")}</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="flex flex-col">
            <div className="relative aspect-[16/11] overflow-hidden">
              <img src={p.image} alt={ar ? p.nameAr : p.nameEn} className="h-full w-full object-cover" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-gold">
              {ar ? p.placeAr : p.placeEn} · {ar ? p.tagAr : p.tagEn}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">{ar ? p.nameAr : p.nameEn}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{ar ? p.blurbAr : p.blurbEn}</p>
            {p.id === "watan" ? (
              <Link to="/tower" className="mt-4 inline-flex text-sm font-bold text-sea underline-offset-4 hover:underline">
                {t("hero.ctaTower")}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
