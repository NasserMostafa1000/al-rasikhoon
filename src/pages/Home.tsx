import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StatsCounter from "../components/StatsCounter";
import VideoBanner from "../components/VideoBanner";
import { company, projects } from "../data/company";
import { media } from "../data/media";

export default function Home() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");
  const featured = projects.filter((p) => "featured" in p && p.featured).concat(projects.slice(0, 3));
  const unique = Array.from(new Map(featured.map((p) => [p.id, p])).values()).slice(0, 3);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={media.hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-sea-deep/35" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-sm tracking-[0.2em] text-gold"
          >
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl font-display text-5xl font-extrabold leading-[1.05] text-cream md:text-7xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-lg text-cream/80 md:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/tower" className="rounded-full bg-gold px-6 py-3 font-bold text-ink shadow-gold">
              {t("hero.ctaTower")}
            </Link>
            <a href="#ask-ai" className="rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream">
              {t("hero.ctaAsk")}
            </a>
            <Link to="/projects" className="rounded-full bg-white/10 px-6 py-3 font-semibold text-cream backdrop-blur">
              {t("hero.ctaProjects")}
            </Link>
          </motion.div>
        </div>
      </section>

      <VideoBanner />

      <StatsCounter stats={[...company.stats]} lang={ar ? "ar" : "en"} />

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{t("projects.title")}</h2>
            <p className="mt-2 text-ink-muted">{t("projects.subtitle")}</p>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-sea underline-offset-4 hover:underline">
            {t("projects.open")}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {unique.map((p, index) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={ar ? p.nameAr : p.nameEn}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold">{ar ? p.tagAr : p.tagEn}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{ar ? p.nameAr : p.nameEn}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-cream/75">{ar ? p.blurbAr : p.blurbEn}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
