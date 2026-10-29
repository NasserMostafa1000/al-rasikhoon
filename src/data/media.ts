/** Local assets under /public/images — no remote CDN dependency for homepage. */
export const media = {
  hero: "/images/tower/exterior-render.jpg",
  /** Official Al Rasikhoon YouTube videos used on their site */
  videos: {
    banner: "tYYqu8SDpZw",
    secondary: "l70fs2mRd2E",
  },
  tower: {
    exterior: "/images/tower/exterior-render.jpg",
    pool: "/images/tower/hero.jpg",
    gallery: [
      "/images/tower/palmera-0.jpg",
      "/images/tower/palmera-1.jpg",
      "/images/tower/palmera-2.jpg",
      "/images/tower/palmera-3.jpg",
      "/images/tower/palmera-4.jpg",
      "/images/tower/palmera-5.jpg",
      "/images/tower/palmera-6.jpg",
      "/images/tower/palmera-7.jpg",
      "/images/tower/exterior-render.jpg",
      "/images/tower/hero.jpg",
    ],
  },
  interior: {
    lobby: "/images/interior/lobby.jpg",
    corridor: "/images/interior/corridor.jpg",
    living: "/images/interior/living.jpg",
    kitchen: "/images/interior/kitchen.jpg",
    bedroom: "/images/interior/bedroom.jpg",
    bathroom: "/images/interior/bathroom.jpg",
    balcony: "/images/interior/balcony.jpg",
  },
  projects: {
    qasimiya: "/images/projects/qasimiya.webp",
    watan: "/images/tower/exterior-render.jpg",
    sidr: "/images/projects/sidr.webp",
    basatin: "/images/projects/basatin.webp",
    sajaa: "/images/projects/sajaa.webp",
    heilo: "/images/projects/heilo.webp",
    maha: "/images/projects/sidr.webp",
    bahia: "/images/projects/heilo.webp",
  },
} as const;

export type TourRoom = {
  id: string;
  labelAr: string;
  labelEn: string;
  image: string;
  links: Array<{ to: string; x: number; y: number; labelAr: string; labelEn: string }>;
};

/** Street-View style graph of rooms inside an apartment */
export const apartmentTourGraph: TourRoom[] = [
  {
    id: "living",
    labelAr: "الصالة",
    labelEn: "Living room",
    image: media.interior.living,
    links: [
      { to: "kitchen", x: 72, y: 58, labelAr: "المطبخ", labelEn: "Kitchen" },
      { to: "bedroom", x: 28, y: 52, labelAr: "غرفة النوم", labelEn: "Bedroom" },
      { to: "balcony", x: 50, y: 78, labelAr: "الشرفة", labelEn: "Balcony" },
    ],
  },
  {
    id: "kitchen",
    labelAr: "المطبخ",
    labelEn: "Kitchen",
    image: media.interior.kitchen,
    links: [
      { to: "living", x: 22, y: 55, labelAr: "الصالة", labelEn: "Living" },
      { to: "bathroom", x: 78, y: 48, labelAr: "الحمام", labelEn: "Bathroom" },
    ],
  },
  {
    id: "bedroom",
    labelAr: "غرفة النوم",
    labelEn: "Bedroom",
    image: media.interior.bedroom,
    links: [
      { to: "living", x: 18, y: 55, labelAr: "الصالة", labelEn: "Living" },
      { to: "bathroom", x: 82, y: 50, labelAr: "الحمام", labelEn: "Bathroom" },
      { to: "balcony", x: 55, y: 80, labelAr: "الشرفة", labelEn: "Balcony" },
    ],
  },
  {
    id: "bathroom",
    labelAr: "الحمام",
    labelEn: "Bathroom",
    image: media.interior.bathroom,
    links: [
      { to: "bedroom", x: 30, y: 55, labelAr: "غرفة النوم", labelEn: "Bedroom" },
      { to: "kitchen", x: 70, y: 55, labelAr: "المطبخ", labelEn: "Kitchen" },
    ],
  },
  {
    id: "balcony",
    labelAr: "الشرفة",
    labelEn: "Balcony",
    image: media.interior.balcony,
    links: [
      { to: "living", x: 48, y: 70, labelAr: "الصالة", labelEn: "Living" },
      { to: "bedroom", x: 70, y: 55, labelAr: "غرفة النوم", labelEn: "Bedroom" },
    ],
  },
];
