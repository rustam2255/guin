import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

function getStatusText(status: PrisonerListItem["status"]) {
  if (!status) return "-";
  if (typeof status === "string") return status;
  return status.name || "-";
}

export default function RegistryIdPage() {
  const { t } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const prisoner = (location.state as LocationState | null)?.prisoner;
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const getText = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") {
      return value ? t("common.yes") : t("common.no");
    }
    return String(value);
  };

  const tabs = useMemo(
    () => [
      { key: "personal" as TabKey, label: t("registry_detail.tabs.personal") },
      { key: "family" as TabKey, label: t("registry_detail.tabs.family") },
      { key: "court" as TabKey, label: t("registry_detail.tabs.court") },
      { key: "crime" as TabKey, label: t("registry_detail.tabs.crime") },
      { key: "other" as TabKey, label: t("registry_detail.tabs.other") },
    ],
    [t]
  );

  const currentContent = useMemo(() => {
    if (!prisoner) return [];

    switch (activeTab) {
      case "personal":
        return [
          { title: t("registry.full_name"), text: prisoner.full_name },
          { title: t("dashboard.gender"), text: prisoner.gender_label || prisoner.gender },
          { title: t("registry.birth_date"), text: formatDate(prisoner.birth_date) },
          { title: t("registry_detail.fields.citizenship"), text: prisoner.citizenship },
          { title: "PINFL", text: prisoner.pinfl },
          { title: t("registry_detail.fields.passport"), text: prisoner.passport_id },
          { title: t("registry_detail.fields.nationality"), text: prisoner.nationality },
          { title: t("profile.phone"), text: prisoner.phone },
        ];

      case "family":
        return [
          {
            title: t("registry_detail.fields.family_info"),
            text: prisoner.family_info,
          },
          {
            title: t("registry_detail.fields.emergency_contact_person"),
            text: prisoner.emergency_contact_person,
          },
        ];

      case "court":
        return [
          {
            title: t("registry_detail.fields.date_of_sentencing"),
            text: formatDate(prisoner.date_of_sentencing),
          },
          {
            title: t("registry_detail.fields.sentence_end_date"),
            text: formatDate(prisoner.sentence_end_date),
          },
          {
            title: t("registry_detail.fields.escape_attempts"),
            text: prisoner.escape_attempts,
          },
        ];

      case "crime":
        return [
          {
            title: t("registry_detail.fields.danger_level"),
            text: prisoner.danger_level_label || prisoner.danger_level,
          },
          {
            title: t("registry_detail.fields.psychological_evaluation"),
            text: prisoner.psychological_evaluation,
          },
          {
            title: t("registry_detail.fields.condition"),
            text: prisoner.active_prisoner
              ? t("status.active")
              : t("status.inactive"),
          },
        ];

      case "address":
        return [
          { title: t("registry_detail.fields.birthplace"), text: prisoner.birthplace },
          {
            title: t("registry_detail.fields.permanent_residence"),
            text: prisoner.permanent_residence,
          },
          {
            title: t("registry_detail.fields.register_add"),
            text: prisoner.register_add,
          },
          {
            title: t("registry_detail.fields.last_add"),
            text: prisoner.last_add,
          },
          { title: t("filters.region"), text: prisoner.region?.name },
          { title: t("filters.province"), text: prisoner.province?.name },
          { title: t("filters.colony"), text: prisoner.colony?.name },
          { title: t("registry.object"), text: prisoner.place_object?.name },
        ];

      default:
        return [
          { title: "FaceID", text: prisoner.faceid },
          { title: t("registry_detail.fields.fingerprint"), text: prisoner.fingerprint },
          { title: t("registry_detail.fields.disability"), text: prisoner.disability },
          {
            title: t("registry_detail.fields.created_at"),
            text: formatDate(prisoner.created_at),
          },
          {
            title: t("registry_detail.fields.updated_at"),
            text: formatDate(prisoner.updated_at),
          },
        ];
    }
  }, [activeTab, prisoner, t]);

  if (!prisoner || String(prisoner.id) !== String(id)) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-red-500">
            {t("registry_detail.not_found_title")}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {t("registry_detail.not_found_description")}
          </p>

          <button
            type="button"
            onClick={() => navigate("/registry")}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white"
          >
            {t("registry_detail.back_to_registry")}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="mx-auto w-full max-w-[2200px]  rounded-3xl bg-white p-3 shadow-sm lg:w-[260px]">
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