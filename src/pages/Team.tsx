import { useState } from "react";
import { useTranslation } from "react-i18next";
import { team } from "../data/company";

function TeamPhoto({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0);

  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-ink-wash font-display text-5xl font-bold text-gold">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="aspect-[4/5] w-full object-cover object-top"
      onError={() => setFailed(true)}
    />
  );
}

export default function Team() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h1 className="font-display text-4xl font-bold md:text-5xl">{t("team.title")}</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">{t("team.subtitle")}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {team.map((person) => {
          const name = ar ? person.nameAr : person.nameEn;
          return (
            <article key={person.id} className="overflow-hidden bg-white/70 ring-1 ring-ink/5">
              <TeamPhoto src={person.photo} name={name} />
              <div className="p-5">
                <h2 className="font-display text-lg font-bold leading-snug">{name}</h2>
                <p className="mt-2 text-sm text-sea">{ar ? person.titleAr : person.titleEn}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
