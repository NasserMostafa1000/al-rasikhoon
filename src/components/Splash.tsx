import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { company } from "../data/company";

type Props = {
  onDone: () => void;
};

export default function Splash({ onDone }: Props) {
  const { t, i18n } = useTranslation();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveAt = window.setTimeout(() => setLeaving(true), 2800);
    const doneAt = window.setTimeout(onDone, 3600);
    return () => {
      window.clearTimeout(leaveAt);
      window.clearTimeout(doneAt);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex bg-ink-wash text-cream"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={leaving}
    >
      <div className="relative flex w-full flex-col items-center justify-center gap-8 md:w-1/2 md:border-e md:border-gold/20">
        <div className="logo-spin-stage">
          <div className="logo-spin-inner">
            <img
              src={company.logo}
              alt={company.nameAr}
              className="h-40 w-40 object-contain drop-shadow-[0_20px_60px_rgba(207,186,130,0.45)] md:h-56 md:w-56"
            />
          </div>
        </div>
        <div className="px-8 text-center">
          <p className="font-display text-2xl font-bold tracking-wide text-gold md:text-3xl">
            {i18n.language === "ar" ? company.nameAr : company.nameEn}
          </p>
          <p className="mt-2 text-sm text-cream/70">{t("splash.loading")}</p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden md:block md:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(207,186,130,0.2),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(126,184,212,0.18),transparent_40%)]" />
        <div className="absolute inset-x-12 bottom-16 top-16 rounded-[2rem] border border-gold/25 bg-gradient-to-b from-sea-glass/20 via-transparent to-gold/10 shadow-gold" />
        <div className="absolute left-1/2 top-1/2 h-[70%] w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-sea-mist/40 via-sea/30 to-gold/40 blur-sm" />
        <div className="absolute left-1/2 top-[18%] h-[64%] w-16 -translate-x-1/2 rounded-t-[2rem] bg-gradient-to-b from-sea-glass/80 via-sea/50 to-gold-deep/70 shadow-[0_0_40px_rgba(207,186,130,0.35)]" />
      </div>
    </motion.div>
  );
}
