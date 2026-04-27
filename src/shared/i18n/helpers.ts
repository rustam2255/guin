import i18n from "./index";
import type { AppLanguage } from "./resources";

type MultilingualValue = {
  name?: string | null;
  name_uz?: string | null;
  name_ru?: string | null;
  name_uz_cyrl?: string | null;

  title?: string | null;
  title_uz?: string | null;
  title_ru?: string | null;
  title_uz_cyrl?: string | null;
};

export function getLocalizedName(item?: MultilingualValue | null): string {
  if (!item) return "";

  const lang = i18n.language as AppLanguage;

  const valueByLang: Record<AppLanguage, string | null | undefined> = {
    uz: item.name_uz,
    ru: item.name_ru,
    "uz-cyrl": item.name_uz_cyrl,
  };

  return (
    valueByLang[lang] ||
    item.name_uz ||
    item.name_uz_cyrl ||
    item.name_ru ||
    item.name ||
    ""
  );
}

export function getLocalizedTitle(item?: MultilingualValue | null): string {
  if (!item) return "";

  const lang = i18n.language as AppLanguage;

  const valueByLang: Record<AppLanguage, string | null | undefined> = {
    uz: item.title_uz,
    ru: item.title_ru,
    "uz-cyrl": item.title_uz_cyrl,
  };

  return (
    valueByLang[lang] ||
    item.title_uz ||
    item.title_uz_cyrl ||
    item.title_ru ||
    item.title ||
    ""
  );
}