export function formatAed(value: number, lang: "ar" | "en") {
  return new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSqft(value: number, lang: "ar" | "en") {
  const n = new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE").format(value);
  return lang === "ar" ? `${n} قدم²` : `${n} sqft`;
}
