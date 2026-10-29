import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ApartmentTour from "../components/tower/ApartmentTour";
import FloorCorridor from "../components/tower/FloorCorridor";
import WatanTowerScene from "../components/tower/WatanTowerScene";
import { apartmentsForFloor, towerMeta, type Apartment } from "../data/tower";
import { media } from "../data/media";

export default function Tower() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const [floor, setFloor] = useState<number | null>(null);
  const [unit, setUnit] = useState<Apartment | null>(null);

  const apartments = useMemo(() => (floor ? apartmentsForFloor(floor) : []), [floor]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {!floor && !unit ? (
        <>
          <div className="mb-8 max-w-3xl">
            <p className="text-sm tracking-[0.2em] text-gold">
              {lang === "ar" ? towerMeta.locationAr : towerMeta.locationEn}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{t("tower.title")}</h1>
            <p className="mt-3 text-ink-muted">{t("tower.subtitle")}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.75fr]">
            <WatanTowerScene selectedFloor={null} onSelectFloor={setFloor} lang={lang} />
            <aside className="space-y-6">
              <img
                src={media.tower.exterior}
                alt={lang === "ar" ? towerMeta.nameAr : towerMeta.nameEn}
                className="aspect-[4/5] w-full object-cover"
              />
              <section>
                <h2 className="font-display text-xl font-bold">{t("tower.specs")}</h2>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  <li>
                    {lang === "ar" ? "إجمالي الطوابق" : "Total floors"}: {towerMeta.totalFloors}
                  </li>
                  <li>
                    {lang === "ar" ? "طوابق سكنية" : "Residential floors"}: {towerMeta.residentialFloors}
                  </li>
                  <li>
                    {lang === "ar" ? "مواقف" : "Parking levels"}: {towerMeta.parkingFloors}
                  </li>
                  <li>
                    {lang === "ar" ? "التسليم" : "Delivery"}:{" "}
                    {lang === "ar" ? towerMeta.deliveryAr : towerMeta.deliveryEn}
                  </li>
                  <li>
                    {lang === "ar" ? "الملكية" : "Ownership"}:{" "}
                    {lang === "ar" ? towerMeta.ownershipAr : towerMeta.ownershipEn}
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="font-display text-xl font-bold">{t("tower.floors")}</h2>
                <div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-auto">
                  {Array.from({ length: towerMeta.residentialFloors }, (_, i) => i + 9).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFloor(f)}
                      className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-semibold hover:border-gold"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </>
      ) : null}

      {floor && !unit ? (
        <FloorCorridor
          floor={floor}
          apartments={apartments}
          lang={lang}
          onExit={() => setFloor(null)}
          onEnterApartment={setUnit}
        />
      ) : null}

      {unit ? (
        <ApartmentTour apartment={unit} lang={lang} onBack={() => setUnit(null)} />
      ) : null}
    </div>
  );
}
