const KHMER_LOCALE = "km-KH-u-nu-latn";

const numbers = {
  en: new Intl.NumberFormat("en"),
  km: new Intl.NumberFormat(KHMER_LOCALE),
};
const years = new Intl.NumberFormat(KHMER_LOCALE, { useGrouping: false });

export function formatUiNumber(value, language) {
  return numbers[language].format(value);
}

export function formatYear(year) {
  return years.format(year);
}

export function khmerDateParts(date, timeZone, { includeTime = false } = {}) {
  const time = includeTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } : {};
  const formatter = new Intl.DateTimeFormat(KHMER_LOCALE, {
    day: "numeric", month: "long", year: "numeric", calendar: "gregory", timeZone, ...time,
  });
  return Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
}
