import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import uzCryl from "./locales/uz-cyrl.json";

export const resources = {
  uz: {
    translation: uz,
  },
  ru: {
    translation: ru,
  },
  "uz-cyrl": {
    translation: uzCryl,
  },
} as const;

export type AppLanguage = keyof typeof resources;

export const DEFAULT_LANGUAGE: AppLanguage = "uz";

export const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "uz-cyrl", label: "Ўзбекча" },
  { code: "ru", label: "Русский" },
];