import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import uzCyrl from "./locales/uz-cyrl.json";

export const resources = {
  uz: {
    translation: uz,
  },
  ru: {
    translation: ru,
  },
  "uz-Cyrl": {
    translation: uzCyrl,
  },
} as const;

export type AppLanguage = keyof typeof resources;

export const DEFAULT_LANGUAGE: AppLanguage = "uz";

export const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "uz-Cyrl", label: "Ўзбекча" },
  { code: "ru", label: "Русский" },
];