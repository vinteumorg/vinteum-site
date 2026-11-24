import en from "@/i18n/locales/en.json";
import pt from "@/i18n/locales/pt.json";

// A typed projection of the existing LanguageContext dictionaries, not a second
// translation register. The console selects it with the site's current locale.
export const copy = {
  EN: en.donations.admin,
  BR: pt.donations.admin,
};
export type AdminCopy = typeof copy.EN;
