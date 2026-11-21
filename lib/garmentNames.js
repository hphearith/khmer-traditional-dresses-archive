// An Official record has two names, nameEn and nameKh. The reader's Interface
// language decides which one leads (docs/adr/0005): Khmer readers see the
// Khmer name first, English readers the English one. Both are always shown,
// exactly as written. Plain module (no React) so the order can be tested.

/** The record's two names, leading one first, each with its own lang. */
export function garmentNames(garment, language) {
  const en = { text: garment.nameEn, lang: "en" };
  const km = { text: garment.nameKh, lang: "km" };
  return language === "km" ? [km, en] : [en, km];
}
