import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { company } from "../data/company";
import LanguageSwitcher from "./LanguageSwitcher";
import SocialIcons from "./SocialIcons";

const links = [
  ["/", "nav.home"],
  ["/about", "nav.about"],
  ["/projects", "nav.projects"],
  ["/tower", "nav.tower"],
  ["/team", "nav.team"],
  ["/contact", "nav.contact"],
] as const;

export default function Layout() {
  const { t, i18n } = useTranslation();
  const brand = i18n.language.startsWith("ar") ? company.nameAr : company.nameEn;

  return (
    <div className="min-h-screen bg-coastal-wash text-ink">
      <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={company.logo} alt="" className="h-11 w-11 object-contain" />
            <span className="font-display text-sm font-bold tracking-wide text-ink md:text-base">{brand}</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm transition ${
                    isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-white/70"
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href="#ask-ai"
              className="hidden rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink shadow-gold md:inline-flex"
            >
              {t("nav.ask")}
            </a>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {links.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                  isActive ? "bg-ink text-cream" : "bg-white/70 text-ink-soft"
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-ink/10 bg-ink-wash text-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
          <div>
            <img src={company.logo} alt="" className="mb-4 h-14 w-14 object-contain" />
            <p className="font-display text-xl font-bold text-gold">{brand}</p>
            <p className="mt-2 text-sm text-cream/70">
              {i18n.language.startsWith("ar") ? company.addressAr : company.addressEn}
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold text-gold">{t("contact.hotline")}</p>
            <a className="block text-lg" href={`tel:${company.hotlineIntl}`}>
              {company.hotlineIntl}
            </a>
            <a className="mt-2 block" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <div>
            <p className="mb-3 font-semibold text-gold">{t("contact.social")}</p>
            <SocialIcons variant="footer" />
          </div>
        </div>
        <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/55">
          © {new Date().getFullYear()} {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
}
