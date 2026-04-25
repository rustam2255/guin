import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import kr from "./locales/kr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: kr },
    },
  });

export default i18n;