import { company } from "../data/company";

/** Official brand marks from Simple Icons, stored locally under /images/social */
const iconSrc: Record<string, string> = {
  instagram: "/images/social/instagram.svg",
  facebook: "/images/social/facebook.svg",
  x: "/images/social/x.svg",
  youtube: "/images/social/youtube.svg",
  linkedin: "/images/social/linkedin.svg",
  tiktok: "/images/social/tiktok.svg",
  telegram: "/images/social/telegram.svg",
  threads: "/images/social/threads.svg",
  whatsapp: "/images/social/whatsapp.svg",
  linktree: "/images/social/linktree.svg",
};

type Props = {
  variant?: "footer" | "grid" | "row";
  className?: string;
};

export default function SocialIcons({ variant = "row", className = "" }: Props) {
  if (variant === "grid") {
    return (
      <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
        {company.social.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-white px-4 py-4 text-sm font-semibold ring-1 ring-ink/5 transition hover:ring-gold"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream ring-1 ring-ink/5">
              <img src={iconSrc[s.id]} alt="" className="h-6 w-6 object-contain" />
            </span>
            <span>{s.label}</span>
          </a>
        ))}
      </div>
    );
  }

  const onDark = variant === "footer";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {company.social.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          title={s.label}
          aria-label={s.label}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-105 ${
            onDark ? "bg-white/95 ring-1 ring-cream/20 hover:ring-gold" : "bg-white shadow-soft ring-1 ring-ink/5"
          }`}
        >
          <img src={iconSrc[s.id]} alt={s.label} className="h-5 w-5 object-contain" />
        </a>
      ))}
    </div>
  );
}
