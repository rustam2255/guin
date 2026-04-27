import { useEffect, useRef, useState } from "react";
import {  LogOut, Phone, Shield, User } from "lucide-react";
// import { useTranslation } from "react-i18next";
import { useProfile } from "../../entities/auth/hooks/use-profile";
import { useLogout } from "../../entities/auth/hooks/use-logout";

// type AppLang = "uz" | "ru" | "uz-cyrl";

// const languages: { value: AppLang; label: string; title: string }[] = [
//   { value: "uz", label: "UZ", title: "O‘zbekcha" },
//   { value: "ru", label: "RU", title: "Русский" },
//   { value: "uz-cyrl", label: "ЎЗ", title: "Ўзбекча" },
// ];

export default function Header() {
  const [open, setOpen] = useState(false);
  // const [langOpen, setLangOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);

  // const { i18n } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // const normalizeLang = (lang?: string | null): AppLang => {
  //   if (lang === "ru" || lang?.startsWith("ru")) return "ru";
  //   if (lang === "uz-cyrl" || lang === "uz-Cyrl") return "uz-cyrl";
  //   return "uz";
  // };

  // const currentLang = normalizeLang(
  //   localStorage.getItem("app_language") || i18n.language
  // );

  // const activeLang =
  //   languages.find((lang) => lang.value === currentLang) || languages[0];

  // const changeLanguage = async (lang: AppLang) => {
  //   await i18n.changeLanguage(lang);
  //   localStorage.setItem("app_language", lang);
  //   setLangOpen(false);
  //   window.location.reload();
  // };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }

      if (langRef.current && !langRef.current.contains(target)) {
        // setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName =
    profile?.full_name ||
    [profile?.last_name, profile?.first_name].filter(Boolean).join(" ") ||
    "Foydalanuvchi";

  const roleText = profile?.role_label || profile?.role || "Admin";
  const phoneText = profile?.phone || "Telefon mavjud emas";

  return (
    <header
      className="
        relative flex items-center justify-between 
        px-4 py-3
        sm:px-5 sm:py-3.5
        lg:px-6 lg:py-4
        xl:px-8
        2xl:min-h-[96px] 2xl:px-10
        min-[1800px]:min-h-[108px] min-[1800px]:px-12
        min-[2200px]:min-h-[120px] min-[2200px]:px-14
      "
    >
      <h1
        className="
          pr-3 font-bold leading-none text-gray-900
          text-[18px]
          sm:text-[20px]
          lg:text-[22px]
          xl:text-[24px]
          2xl:text-[28px]
          min-[1800px]:text-[32px]
          min-[2200px]:text-[36px]
        "
      >
        JIEBB
      </h1>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={langRef}>
          {/* <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            className="
              flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2
              text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50
              2xl:px-4 2xl:py-3 2xl:text-[16px]
              min-[1800px]:px-5 min-[1800px]:py-3.5 min-[1800px]:text-[18px]
              cursor-pointer
            "
          >

            <span>{activeLang.label}</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition ${langOpen ? "rotate-180" : ""
                }`}
            />
          </button> */}

          {/* {langOpen && (
            <div
              className="
                absolute right-0 top-[calc(100%+10px)] z-[60]
                w-[220px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl
                2xl:w-[260px] 2xl:p-3
                min-[1800px]:w-[300px]
              "
            >
              {languages.map((lang) => {
                const isActive = activeLang.value === lang.value;

                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => changeLanguage(lang.value)}
                    className={`
                      flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition
                      2xl:px-4 2xl:py-4
                      ${isActive
                        ? "bg-[rgba(15,95,194,1)] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div>
                      <p className="text-sm font-semibold 2xl:text-[16px]">
                        {lang.title}
                      </p>
                      <p
                        className={`text-xs 2xl:text-[13px] ${isActive ? "text-gray-300" : "text-gray-400"
                          }`}
                      >
                        {lang.label}
                      </p>
                    </div>

                    {isActive && (
                      <Check className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    )}
                  </button>
                );
              })}
            </div>
          )} */}
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="
              flex items-center gap-2 rounded-2xl transition hover:bg-gray-100
              px-2 py-2
              sm:gap-3 sm:px-2.5
              lg:px-3 lg:py-2.5
              2xl:gap-4 2xl:px-4 2xl:py-3
              min-[1800px]:px-4.5 min-[1800px]:py-3.5
              cursor-pointer
            "
          >
            <div className="hidden min-w-0 text-right sm:block">
              <p
                className="
                  truncate font-semibold text-gray-900
                  text-sm
                  lg:text-[15px]
                  2xl:text-[17px]
                  min-[1800px]:text-[18px]
                  min-[2200px]:text-[20px]
                "
              >
                {isLoading ? "Yuklanmoqda..." : fullName}
              </p>
              <p
                className="
                  truncate text-gray-500
                  text-[11px]
                  lg:text-xs
                  2xl:text-[13px]
                  min-[1800px]:text-[14px]
                  min-[2200px]:text-[15px]
                "
              >
                {roleText}
              </p>
            </div>

            <img
              src={profile?.photo || "/admin.png"}
              alt="Admin"
              className="
                rounded-full border object-cover
                h-10 w-10
                sm:h-11 sm:w-11
                lg:h-12 lg:w-12
                2xl:h-14 2xl:w-14
                min-[1800px]:h-16 min-[1800px]:w-16
                min-[2200px]:h-[72px] min-[2200px]:w-[72px]
              "
            />
          </button>

          {open && (
            <div
              className="
                absolute right-0 top-[calc(100%+10px)] z-50 rounded-2xl border border-gray-200 bg-white shadow-xl
                w-[280px] p-3
                sm:w-[320px] sm:p-4
                lg:w-[340px]
                2xl:w-[380px] 2xl:p-5
                min-[1800px]:w-[420px] min-[1800px]:p-6
                min-[2200px]:w-[460px]
              "
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 2xl:gap-4 2xl:pb-5">
                <img
                  src={profile?.photo || "/admin.png"}
                  alt="Admin"
                  className="
                    rounded-full border object-cover
                    h-14 w-14
                    lg:h-15 lg:w-15
                    2xl:h-16 2xl:w-16
                    min-[1800px]:h-20 min-[1800px]:w-20
                    min-[2200px]:h-24 min-[2200px]:w-24
                  "
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900 text-base lg:text-[17px] 2xl:text-[20px] min-[1800px]:text-[22px] min-[2200px]:text-[24px]">
                    {isLoading ? "Yuklanmoqda..." : fullName}
                  </p>
                  <p className="truncate text-gray-500 text-sm 2xl:text-[15px] min-[1800px]:text-[16px] min-[2200px]:text-[17px]">
                    {roleText}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 2xl:mt-5 2xl:space-y-4">
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3 2xl:gap-4 2xl:px-4 2xl:py-4">
                  <User className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 2xl:h-6 2xl:w-6 min-[1800px]:h-7 min-[1800px]:w-7" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 2xl:text-[13px] min-[1800px]:text-[14px]">
                      F.I.O
                    </p>
                    <p className="break-words font-medium text-gray-900 text-sm lg:text-[15px] 2xl:text-[17px] min-[1800px]:text-[18px]">
                      {isLoading ? "Yuklanmoqda..." : fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3 2xl:gap-4 2xl:px-4 2xl:py-4">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 2xl:h-6 2xl:w-6 min-[1800px]:h-7 min-[1800px]:w-7" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 2xl:text-[13px] min-[1800px]:text-[14px]">
                      Lavozim / Rol
                    </p>
                    <p className="break-words font-medium text-gray-900 text-sm lg:text-[15px] 2xl:text-[17px] min-[1800px]:text-[18px]">
                      {roleText}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3 2xl:gap-4 2xl:px-4 2xl:py-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 2xl:h-6 2xl:w-6 min-[1800px]:h-7 min-[1800px]:w-7" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 2xl:text-[13px] min-[1800px]:text-[14px]">
                      Telefon raqam
                    </p>
                    <p className="break-words font-medium text-gray-900 text-sm lg:text-[15px] 2xl:text-[17px] min-[1800px]:text-[18px]">
                      {phoneText}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="
                  mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70
                  h-11 text-sm
                  lg:h-12
                  2xl:mt-5 2xl:h-14 2xl:text-[16px]
                  min-[1800px]:h-15 min-[1800px]:text-[17px]
                  min-[2200px]:h-16 min-[2200px]:text-[18px]
                  cursor-pointer
                "
              >
                <LogOut className="h-4 w-4 2xl:h-5 2xl:w-5 min-[1800px]:h-6 min-[1800px]:w-6" />
                {isLoggingOut ? "Chiqilmoqda..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}