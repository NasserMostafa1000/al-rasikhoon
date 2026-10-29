import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { media } from "../data/media";

type Props = {
  videoId?: string;
  to?: string;
};

export default function VideoBanner({
  videoId = media.videos.banner,
  to = "/tower",
}: Props) {
  const { t } = useTranslation();
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&showinfo=0`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="relative overflow-hidden bg-ink">
        <div className="relative aspect-[21/9] min-h-[240px] w-full md:min-h-[320px]">
          <iframe
            title={t("banner.title")}
            src={src}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[180%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/25" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{t("banner.cta")}</p>
            <h2 className="mt-2 max-w-xl font-display text-3xl font-bold text-cream md:text-4xl">
              {t("banner.title")}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-cream/80 md:text-base">{t("banner.subtitle")}</p>
            <div className="mt-5">
              <Link
                to={to}
                className="inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink shadow-gold"
              >
                {t("banner.cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
