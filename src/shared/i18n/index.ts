import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, resources } from "./resources";

const savedLang = localStorage.getItem("app_language") || DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  resources,

  lng: savedLang,
  fallbackLng: DEFAULT_LANGUAGE,

  supportedLngs: ["uz", "ru", "uz-Cyrl"],

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;