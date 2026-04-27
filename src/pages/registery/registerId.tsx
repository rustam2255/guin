import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../app/layout/dashboard-layout";
import type { PrisonerListItem } from "../../entities/prisoners/types/prisoner.types";

type TabKey = "personal" | "family" | "court" | "crime" | "address" | "other";

type LocationState = {
  prisoner?: PrisonerListItem;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("uz-UZ");
}

function getText(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Ha" : "Yo‘q";
  return String(value);
}

function getStatusText(status: PrisonerListItem["status"]) {
  if (!status) return "-";

  if (typeof status === "string") return status;

  return status.name || "-";
}

export default function RegistryIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const prisoner = (location.state as LocationState | null)?.prisoner;

  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const tabs = useMemo(
    () => [
      { key: "personal" as TabKey, label: "Shaxsiy ma’lumotlar" },
      { key: "family" as TabKey, label: "Oila a’zolari" },
      { key: "court" as TabKey, label: "Sudlanganlik" },
      { key: "crime" as TabKey, label: "Hozirgi jinoyat" },
      { key: "address" as TabKey, label: "Manzillar" },
      { key: "other" as TabKey, label: "Boshqalar" },
    ],
    []
  );

  const currentContent = useMemo(() => {
    if (!prisoner) return [];

    switch (activeTab) {
      case "personal":
        return [
          { title: "F.I.O", text: prisoner.full_name },
          { title: "Jinsi", text: prisoner.gender_label || prisoner.gender },
          { title: "Tug‘ilgan sana", text: formatDate(prisoner.birth_date) },
          { title: "Fuqaroligi", text: prisoner.citizenship },
          { title: "PINFL", text: prisoner.pinfl },
          { title: "Pasport", text: prisoner.passport_id },
          { title: "Millati", text: prisoner.nationality },
          { title: "Telefon", text: prisoner.phone },
        ];

      case "family":
        return [
          {
            title: "Oila a’zolari haqidagi ma’lumot",
            text: prisoner.family_info,
          },
          {
            title: "Favqulodda aloqadagi shaxs",
            text: prisoner.emergency_contact_person,
          },
        ];

      case "court":
        return [
          {
            title: "Jazo boshlanish sanasi",
            text: formatDate(prisoner.date_of_sentencing),
          },
          {
            title: "Jazo tugash sanasi",
            text: formatDate(prisoner.sentence_end_date),
          },
          {
            title: "Qochish urinishlari",
            text: prisoner.escape_attempts,
          },
        ];

      case "crime":
        return [
          {
            title: "Xavf darajasi",
            text: prisoner.danger_level_label || prisoner.danger_level,
          },
          {
            title: "Psixologik baholash",
            text: prisoner.psychological_evaluation,
          },
          {
            title: "Holati",
            text: prisoner.active_prisoner ? "Faol" : "Nofaol",
          },
        ];

      case "address":
        return [
          { title: "Tug‘ilgan joyi", text: prisoner.birthplace },
          {
            title: "Doimiy yashash joyi",
            text: prisoner.permanent_residence,
          },
          {
            title: "Ro‘yxatdan o‘tgan manzil",
            text: prisoner.register_add,
          },
          {
            title: "Oxirgi yashash manzili",
            text: prisoner.last_add,
          },
          {
            title: "Mintaqa",
            text: prisoner.region?.name,
          },
          {
            title: "Viloyat",
            text: prisoner.province?.name,
          },
          {
            title: "Koloniya",
            text: prisoner.colony?.name,
          },
          {
            title: "Shartnoma obyekti",
            text: prisoner.place_object?.name,
          },
        ];

      default:
        return [
          { title: "FaceID", text: prisoner.faceid },
          { title: "Barmoq izi", text: prisoner.fingerprint },
          { title: "Nogironlik", text: prisoner.disability },
          {
            title: "Yaratilgan vaqt",
            text: formatDate(prisoner.created_at),
          },
          {
            title: "Yangilangan vaqt",
            text: formatDate(prisoner.updated_at),
          },
        ];
    }
  }, [activeTab, prisoner]);

  if (!prisoner || String(prisoner.id) !== String(id)) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-red-500">
            Mahkum ma’lumoti topilmadi
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Bu sahifaga to‘g‘ridan-to‘g‘ri kirilganda detail API bo‘lmagani
            uchun ma’lumotni olish imkoni yo‘q. Ro‘yxatdan mahkumni tanlab
            kiring.
          </p>

          <button
            type="button"
            onClick={() => navigate("/registry")}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white"
          >
            Ro‘yxatga qaytish
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full rounded-3xl bg-white p-3 shadow-sm lg:w-[260px]">
            <div className="rounded-2xl border border-[#D8E5FF] p-4">
              <img
                src={
                  prisoner.photo ||
                  "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
                }
                alt={prisoner.full_name}
                className="mx-auto h-[100px] w-[100px] rounded-full object-cover"
              />

              <h2 className="mt-3 text-center text-sm font-semibold text-[#111827]">
                {prisoner.full_name}
              </h2>
            </div>

            <div className="mt-3 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500">
              {getStatusText(prisoner.status)}
            </div>

            <div className="mt-3 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-[#1565d8] text-white"
                      : "bg-[#ECEEF2] text-[#111827]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {currentContent.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-3xl bg-white px-5 py-4 shadow-sm"
              >
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  {item.title}
                </h3>

                <p className="mt-1 max-w-[1000px] text-sm leading-6 text-[#374151]">
                  {getText(item.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}