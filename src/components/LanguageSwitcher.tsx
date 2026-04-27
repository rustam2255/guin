import { useTranslation } from "react-i18next";
import { LANGUAGES, type AppLanguage } from "../shared/i18n/resources";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as AppLanguage;

  const handleChangeLanguage = async (lang: AppLanguage) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  return (
    <div className="flex items-center gap-2">
      {LANGUAGES.map((lang) => {
        const isActive = currentLanguage === lang.code;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleChangeLanguage(lang.code)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {lang.code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}