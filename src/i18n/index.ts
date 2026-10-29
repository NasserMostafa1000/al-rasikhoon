import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      brand: "الراسخون العقارية",
      nav: {
        home: "الرئيسية",
        about: "عن الشركة",
        projects: "المشاريع",
        tower: "برج الوطن",
        team: "الفريق",
        contact: "تواصل",
        ask: "KPH",
      },
      splash: {
        loading: "نجهّز تجربتك العقارية",
      },
      hero: {
        eyebrow: "منذ 2002 · عجمان ودبي والشارقة",
        title: "الراسخون العقارية",
        subtitle: "تطوير وتسويق عقاري راسخ — من الأراضي الصناعية إلى الأبراج الساحلية.",
        ctaTower: "استكشف برج الوطن 3D",
        ctaAsk: "اسأل KPH",
        ctaProjects: "كل المشاريع",
      },
      about: {
        title: "عن الراسخون",
        journey: "رحلتنا",
        why: "لماذا الراسخون؟",
        values: "قيمنا",
      },
      projects: {
        title: "مشاريعنا",
        subtitle: "سكني · تجاري · صناعي · زراعي عبر الإمارات",
        open: "تفاصيل",
      },
      tower: {
        title: "برج الوطن",
        subtitle: "ادخل داخل البرج، امشِ في الممر، ثم تنقّل بين غرف الشقة مثل خرائط جوجل",
        floors: "الطوابق السكنية",
        selectFloor: "اختر طابقاً",
        selectUnit: "اختر شقة",
        available: "متاحة",
        reserved: "محجوزة",
        price: "السعر",
        size: "المساحة",
        view: "الإطلالة",
        back: "رجوع للبرج",
        amenities: "المرافق",
        specs: "المواصفات",
        enterFloor: "دخول الطابق",
        enterUnit: "دخول الشقة",
      },
      team: {
        title: "فريق القيادة",
        subtitle: "وجوه عامة من قيادة الشركة كما تظهر في المصادر الرسمية",
      },
      contact: {
        title: "تواصل معنا",
        office: "المكتب الرئيسي",
        hotline: "الخط المجاني",
        whatsapp: "واتساب",
        email: "البريد",
        social: "صفحاتنا على السوشيال ميديا",
        write: "راسلنا عبر واتساب",
      },
      ask: {
        title: "KPH",
        assistant: "مساعد الراسخون",
        placeholder: "اسأل عن استوديو، شقة، طابق، ميزانية، أو الشركة...",
        send: "إرسال",
        thinking: "التفكير",
        showThinking: "عرض التفكير",
        hideThinking: "إخفاء التفكير",
        welcome:
          "مرحباً — أنا KPH مساعد الراسخون العقارية. اسأل عن برج الوطن، الميزانية، المشاريع، أو وسائل التواصل، وسأرد بلغتك.",
        hint: "مثال: أبغى استوديو بميزانية 500 ألف في برج الوطن",
      },
      banner: {
        title: "برج الوطن على كورنيش عجمان",
        subtitle: "استوديو إلى 3 غرف · تملك حر · ادخل البرج ثلاثي الأبعاد الآن",
        cta: "اكتشف البرج",
      },
      footer: {
        rights: "جميع الحقوق محفوظة · الراسخون للعقارات",
      },
    },
  },
  en: {
    translation: {
      brand: "Al Rasikhoon Real Estate",
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects",
        tower: "Al Watan Tower",
        team: "Team",
        contact: "Contact",
        ask: "KPH",
      },
      splash: {
        loading: "Preparing your property experience",
      },
      hero: {
        eyebrow: "Since 2002 · Ajman, Dubai & Sharjah",
        title: "Al Rasikhoon Real Estate",
        subtitle: "Rooted real-estate development & marketing — from industrial land to coastal towers.",
        ctaTower: "Explore Al Watan Tower 3D",
        ctaAsk: "Ask KPH",
        ctaProjects: "All projects",
      },
      about: {
        title: "About Al Rasikhoon",
        journey: "Our journey",
        why: "Why Al Rasikhoon?",
        values: "Our values",
      },
      projects: {
        title: "Our projects",
        subtitle: "Residential · Commercial · Industrial · Agricultural across the UAE",
        open: "Details",
      },
      tower: {
        title: "Al Watan Tower",
        subtitle: "Go inside the tower, walk the corridor, then room-hop like Google Street View",
        floors: "Residential floors",
        selectFloor: "Select a floor",
        selectUnit: "Select an apartment",
        available: "Available",
        reserved: "Reserved",
        price: "Price",
        size: "Size",
        view: "View",
        back: "Back to tower",
        amenities: "Amenities",
        specs: "Specifications",
        enterFloor: "Enter floor",
        enterUnit: "Enter apartment",
      },
      team: {
        title: "Leadership",
        subtitle: "Publicly listed leadership roles from official company sources",
      },
      contact: {
        title: "Contact us",
        office: "Main office",
        hotline: "Free call",
        whatsapp: "WhatsApp",
        email: "Email",
        social: "Our social channels",
        write: "Message us on WhatsApp",
      },
      ask: {
        title: "KPH",
        assistant: "Al Rasikhoon assistant",
        placeholder: "Ask about a studio, apartment, floor, budget, or the company...",
        send: "Send",
        thinking: "Thinking",
        showThinking: "Show thinking",
        hideThinking: "Hide thinking",
        welcome:
          "Hello — I’m KPH, Al Rasikhoon’s assistant. Ask about Al Watan Tower, budgets, projects, or contacts and I’ll reply in your language.",
        hint: "Example: I want a studio under AED 500k in Al Watan Tower",
      },
      banner: {
        title: "Al Watan Tower on Ajman Corniche",
        subtitle: "Studios to 3BR · Freehold · Enter the interactive 3D tower now",
        cta: "Explore the tower",
      },
      footer: {
        rights: "All rights reserved · Al Rasikhoon Real Estate",
      },
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
