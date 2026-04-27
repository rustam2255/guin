import axios from "axios";
import i18n from "../i18n";

const rawApiUrl = import.meta.env.VITE_API_URL;

export const RAW_API_URL =
  typeof rawApiUrl === "string" && rawApiUrl.trim()
    ? rawApiUrl
    : "http://109.123.247.72:8222/uz/api/v1/";

type AppLang = "uz" | "ru" | "uz-cyrl";

export function getCurrentLang(): AppLang {
  const lang = i18n.language || localStorage.getItem("app_language") || "uz";

  if (lang === "ru") return "ru";
  if (lang === "uz-cyrl") return "uz-cyrl";

  return "uz";
}

export function getApiBaseUrl() {
  const lang = getCurrentLang();

  const cleanBaseUrl = String(RAW_API_URL)
    .trim()
    .replace(/\/(uz|ru|uz-cyrl)\/api\/v1\/?$/, "");

  return `${cleanBaseUrl}/${lang}/api/v1/`;
}

export const API_URL = getApiBaseUrl();

export const $axios = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});