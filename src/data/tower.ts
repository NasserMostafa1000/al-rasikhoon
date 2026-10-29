import { media } from "./media";

export type UnitType = "studio" | "1br" | "2br" | "3br";

export type Apartment = {
  id: string;
  floor: number;
  unit: string;
  type: UnitType;
  beds: number;
  baths: number;
  sizeSqft: number;
  priceAed: number;
  viewAr: string;
  viewEn: string;
  available: boolean;
  images: string[];
};

export const towerMeta = {
  nameAr: "برج الوطن",
  nameEn: "Al Watan Tower",
  locationAr: "طريق كورنيش عجمان — الخط الأول للبحر",
  locationEn: "Ajman Corniche Road — first-line waterfront",
  developerAr: "KBH للتطوير العقاري · تسويق الراسخون",
  developerEn: "KBH Development · marketed by Al Rasikhoon",
  totalFloors: 48,
  residentialFloors: 39,
  parkingFloors: 7,
  amenitiesFloor: 1,
  deliveryAr: "الربع الرابع 2028 (حسب بيانات السوق)",
  deliveryEn: "Q4 2028 (market-reported)",
  ownershipAr: "تملك حر",
  ownershipEn: "Freehold",
  amenitiesAr: [
    "مسابح منفصلة للرجال والنساء والأطفال",
    "جاكوزي",
    "صالات رياضية منفصلة",
    "ملعب بادل",
    "حضانة أطفال",
    "قاعة مناسبات",
    "مواقف متعددة الطوابق",
    "محلات في الطابق الأرضي",
  ],
  amenitiesEn: [
    "Separate pools for men, women & children",
    "Jacuzzi",
    "Separate gyms",
    "Padel court",
    "Nursery",
    "Events hall",
    "Multi-level parking",
    "Ground-floor retail",
  ],
  priceGuide: {
    studioFrom: 460_000,
    oneBrFrom: 838_000,
    twoBrFrom: 1_350_000,
    threeBrFrom: 2_253_000,
  },
} as const;

const sampleImages = [
  media.interior.living,
  media.interior.kitchen,
  media.interior.bedroom,
  media.interior.bathroom,
  media.interior.balcony,
  media.tower.gallery[0],
  media.tower.gallery[1],
  media.tower.pool,
];

const unitBlueprints: Array<Omit<Apartment, "id" | "floor" | "unit" | "available">> = [
  {
    type: "studio",
    beds: 0,
    baths: 1,
    sizeSqft: 575,
    priceAed: 460_000,
    viewAr: "إطلالة مدينة",
    viewEn: "City view",
    images: [sampleImages[0], sampleImages[1], sampleImages[4]],
  },
  {
    type: "studio",
    beds: 0,
    baths: 1,
    sizeSqft: 615,
    priceAed: 518_000,
    viewAr: "إطلالة جزئية على البحر",
    viewEn: "Partial sea view",
    images: [sampleImages[0], sampleImages[2], sampleImages[4]],
  },
  {
    type: "1br",
    beds: 1,
    baths: 2,
    sizeSqft: 1369,
    priceAed: 838_000,
    viewAr: "إطلالة بحرية",
    viewEn: "Sea view",
    images: [sampleImages[0], sampleImages[1], sampleImages[2], sampleImages[4]],
  },
  {
    type: "1br",
    beds: 1,
    baths: 2,
    sizeSqft: 1180,
    priceAed: 796_000,
    viewAr: "إطلالة كورنيش",
    viewEn: "Corniche view",
    images: [sampleImages[0], sampleImages[1], sampleImages[3]],
  },
  {
    type: "2br",
    beds: 2,
    baths: 3,
    sizeSqft: 1772,
    priceAed: 1_350_000,
    viewAr: "إطلالة بحرية مباشرة",
    viewEn: "Direct sea view",
    images: [sampleImages[0], sampleImages[1], sampleImages[2], sampleImages[4]],
  },
  {
    type: "2br",
    beds: 2,
    baths: 3,
    sizeSqft: 1819,
    priceAed: 1_538_000,
    viewAr: "إطلالة بانورامية",
    viewEn: "Panoramic view",
    images: [sampleImages[0], sampleImages[2], sampleImages[3], sampleImages[4]],
  },
  {
    type: "3br",
    beds: 3,
    baths: 4,
    sizeSqft: 2253,
    priceAed: 2_253_000,
    viewAr: "إطلالة بحرية واسعة",
    viewEn: "Wide sea view",
    images: [sampleImages[0], sampleImages[1], sampleImages[2], sampleImages[3], sampleImages[4]],
  },
];

/** Residential floors: 9–47 (39 floors) for interactive browsing */
export const residentialFloorNumbers = Array.from({ length: towerMeta.residentialFloors }, (_, i) => i + 9);

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function apartmentsForFloor(floor: number): Apartment[] {
  const count = floor < 18 ? 12 : 8;
  const list: Apartment[] = [];
  for (let i = 0; i < count; i += 1) {
    const blueprint = unitBlueprints[Math.floor(seeded(floor * 17 + i) * unitBlueprints.length)];
    const priceJitter = Math.round((seeded(floor * 31 + i * 3) - 0.4) * 40_000);
    const available = seeded(floor * 41 + i * 7) > 0.28;
    list.push({
      ...blueprint,
      id: `F${floor}-U${String(i + 1).padStart(2, "0")}`,
      floor,
      unit: `${floor}${String(i + 1).padStart(2, "0")}`,
      priceAed: Math.max(420_000, blueprint.priceAed + priceJitter),
      available,
    });
  }
  return list;
}

export const allDummyApartments: Apartment[] = residentialFloorNumbers.flatMap(apartmentsForFloor);

export function typeLabel(type: UnitType, lang: "ar" | "en") {
  const map = {
    studio: { ar: "استوديو", en: "Studio" },
    "1br": { ar: "غرفة وصالة", en: "1 Bedroom" },
    "2br": { ar: "غرفتين وصالة", en: "2 Bedrooms" },
    "3br": { ar: "ثلاث غرف وصالة", en: "3 Bedrooms" },
  } as const;
  return map[type][lang];
}
