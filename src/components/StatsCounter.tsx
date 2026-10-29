import { useEffect, useRef, useState } from "react";

type Stat = {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  labelAr: string;
  labelEn: string;
};

type Props = {
  stats: Stat[];
  lang: "ar" | "en";
};

function formatValue(n: number, decimals = 0, lang: "ar" | "en") {
  return new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
}

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [once]);

  return { ref, visible };
}

function Counter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  active,
  lang,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  active: boolean;
  lang: "ar" | "en";
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return (
    <span>
      {prefix}
      {formatValue(value, decimals, lang)}
      {suffix}
    </span>
  );
}

export default function StatsCounter({ stats, lang }: Props) {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.labelEn} className="border-s-2 border-gold ps-4">
            <p className="font-display text-3xl font-bold text-sea md:text-4xl">
              <Counter
                target={s.target}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                active={visible}
                lang={lang}
              />
            </p>
            <p className="mt-1 text-sm text-ink-muted">{lang === "ar" ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
