import {  useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowDownIcon, ArrowLeft, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AttendanceResultStatus } from "../../entities/attendance/types/attendance-prisoner.types";
import DashboardLayout from "../../app/layout/dashboard-layout";
import LoadingSpinner from "../../shared/loading/loading.spinner";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import { useAttendancePrisonerLevel } from "../../entities/attendance/api/use-attendance-prisoner.api";
import type { UserRole } from "../../entities/attendance/api/attendance-prisoner.service";

const statusClass: Record<string, string> = {
  present: "text-[#17b26a]",
  missed: "text-red-500",
  pending: "text-yellow-500",
};

function formatDateTime(value?: string | null, lang: string = "uz") {
  if (!value) return "-";

  const localeMap: Record<string, string> = {
    uz: "uz-UZ",
    "uz-cyrl": "uz-Cyrl-UZ",
    ru: "ru-RU",
  };

  return new Date(value).toLocaleString(localeMap[lang] || "uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InspectionDetailPage() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()
  const { attendanceTimeId } = useParams();
  const location = useLocation();

  const attendance = location.state?.attendance;

  const profile = useAuthStore((state) => state.profile);
  const role = (profile?.role ?? "SUPERADMIN") as UserRole;

  const appliedFilters = useDashboardFiltersStore(
    (state) => state.appliedFilters
  );

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [resultStatus, setResultStatus] = useState<AttendanceResultStatus>("");
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const params = useMemo(() => {
    return {
      attendance_time: attendanceTimeId,
      region: appliedFilters.regionId || undefined,
      colony: appliedFilters.colonyId || undefined,
      object: appliedFilters.placeObjectId || undefined,
      result_status: resultStatus || undefined,
    };
  }, [
    attendanceTimeId,
    appliedFilters.regionId,
    appliedFilters.colonyId,
    appliedFilters.placeObjectId,
    resultStatus,
  ]);

  const prisonerQuery = useAttendancePrisonerLevel(role, params);

  const items = prisonerQuery.data?.items ?? [];

  const handleSearch = () => {
    setOffset(0);
    setSubmittedSearch(search.trim());
  };

  const filteredItems = useMemo(() => {
    const value = submittedSearch.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) => {
      return (
        item.prisoner?.full_name?.toLowerCase().includes(value) ||
        item.prisoner?.face_employee_no?.toLowerCase().includes(value) ||
        item.object_name?.toLowerCase().includes(value) ||
        item.colony_name?.toLowerCase().includes(value)
      );
    });
  }, [items, submittedSearch]);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(offset, offset + limit);
  }, [filteredItems, offset, limit]);

  const count = filteredItems.length;
  const canPrev = offset > 0;
  const canNext = offset + limit < count;

  const presentCount = items.filter(
    (item) => item.result_status === "present"
  ).length;

  const missedCount = items.filter(
    (item) => item.result_status === "missed"
  ).length;

  const pendingCount = items.filter(
    (item) => item.result_status === "pending"
  ).length;

  const firstItem = items[0];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[#101828] sm:text-xl">
                {t("inspection_detail.title")}
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t("inspection_detail.selected_id")}: {attendanceTimeId}
              </p>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => navigate(`/camera`)}
                className="
    flex items-center cursor-pointer justify-center
    rounded-xl bg-blue-50 text-blue-600
    hover:bg-blue-100 transition
    h-5  w-10
    sm:h-5 sm:w-11
    lg:h-7 lg:w-12
    2xl:h-11 2xl:w-14
  "
              >
                <Camera className="h-5 w-5" />
              </button>

              <Link
                to="/count"
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:h-11"
              >
                <ArrowLeft size={18} />
                {t("common.back")}
              </Link>
            </div>

          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                title={t("filters.region")}
                value={attendance?.region || firstItem?.region_name || "-"}
              />

              <InfoCard
                title={t("filters.colony")}
                value={attendance?.colony || firstItem?.colony_name || "-"}
              />

              <InfoCard
                title={t("inspection_detail.object")}
                value={attendance?.object || firstItem?.object_name || "-"}
              />

              <InfoCard
                title={t("inspection_detail.date_time")}
                value={
                  attendance
                    ? `${attendance.sana || "-"} ${attendance.time || ""}`
                    : firstItem
                      ? `${firstItem.date || "-"} ${firstItem.time_range || ""}`
                      : "-"
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard title={t("common.total")} value={items.length} />

            <StatCard
              title={t("attendance_status.present")}
              value={presentCount}
              color="text-[#17b26a]"
            />

            <StatCard
              title={t("attendance_status.missed")}
              value={missedCount}
              color="text-red-500"
            />

            <StatCard
              title={t("attendance_status.pending")}
              value={pendingCount}
              color="text-yellow-500"
            />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <input
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  if (!value.trim()) {
                    setSubmittedSearch("");
                    setOffset(0);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder={t("inspection_detail.search_placeholder")}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#1565d8] sm:w-[300px] lg:w-[340px] xl:h-11"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="h-10 rounded-xl bg-[#1565d8] px-6 text-sm font-medium text-white hover:bg-[#1257bb] xl:h-11"
              >
                {t("filters.search")}
              </button>

              <div className="relative">
                <select
                  value={resultStatus}
                  onChange={(e) => {
                    setResultStatus(e.target.value as AttendanceResultStatus);
                    setOffset(0);
                  }}
                  className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm outline-none focus:border-[#1565d8] sm:w-[180px] xl:h-11"
                >
                  <option value="">{t("common.all")}</option>
                  <option value="present">
                    {t("attendance_status.present")}
                  </option>
                  <option value="missed">
                    {t("attendance_status.missed")}
                  </option>
                  <option value="pending">
                    {t("attendance_status.pending")}
                  </option>
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <ArrowDownIcon size={18} />
                </div>
              </div>
            </div>

            <div className="flex h-10 min-w-[140px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 xl:h-11">
              <span>{t("registry.prisoners")}:</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 xl:min-w-[980px]">
                <thead>
                  <tr className="bg-[#f8f9fb] text-left text-[11px] font-semibold text-[#344054] xl:text-[13px]">
                    <th className="w-[45px] border-b border-gray-200 px-2 py-3 text-center xl:px-4 xl:py-4">
                      {t("table.id")}
                    </th>
                    <th className="border-b border-gray-200 px-2 py-3 xl:px-4 xl:py-4">
                      {t("registry.full_name")}
                    </th>
                    <th className="w-[80px] border-b border-gray-200 px-2 py-3 xl:w-[100px] xl:px-4 xl:py-4">
                      {t("inspection_detail.face_id")}
                    </th>
                    <th className="w-[95px] border-b border-gray-200 px-2 py-3 xl:w-[130px] xl:px-4 xl:py-4">
                      {t("filters.colony")}
                    </th>
                    <th className="border-b border-gray-200 px-2 py-3 xl:px-4 xl:py-4">
                      {t("inspection_detail.object")}
                    </th>
                    <th className="w-[95px] border-b border-gray-200 px-2 py-3 xl:w-[115px] xl:px-4 xl:py-4">
                      {t("inspection_detail.date")}
                    </th>
                    <th className="w-[120px] border-b border-gray-200 px-2 py-3 xl:w-[150px] xl:px-4 xl:py-4">
                      {t("inspection_detail.recorded_at")}
                    </th>
                    <th className="w-[95px] border-b border-gray-200 px-2 py-3 xl:w-[115px] xl:px-4 xl:py-4">
                      {t("table.status")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {prisonerQuery.isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : prisonerQuery.isError ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-red-500"
                      >
                        {t("common.error")}
                      </td>
                    </tr>
                  ) : paginatedItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        {t("common.not_found")}
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item, index) => (
                      <tr
                        key={`${item.attendance_prisoner_id}-${item.prisoner?.id}`}
                        className="text-[11px] text-[#101828] hover:bg-gray-50 xl:text-sm"
                      >
                        <td className="border-b border-gray-100 px-2 py-3 text-center xl:px-4 xl:py-4">
                          {offset + index + 1}
                        </td>

                        <td className="max-w-[140px] border-b border-gray-100 px-2 py-3 font-medium xl:max-w-[220px] xl:px-4 xl:py-4">
                          <span className="block truncate">
                            {item.prisoner?.full_name || "-"}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 px-2 py-3 xl:px-4 xl:py-4">
                          <span className="block truncate">
                            {item.prisoner?.face_employee_no || "-"}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 px-2 py-3 xl:px-4 xl:py-4">
                          <span className="block truncate">
                            {item.colony_name || "-"}
                          </span>
                        </td>

                        <td className="max-w-[150px] border-b border-gray-100 px-2 py-3 xl:max-w-[240px] xl:px-4 xl:py-4">
                          <span className="block truncate">
                            {item.object_name || "-"}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 px-2 py-3 xl:px-4 xl:py-4">
                          {item.date || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-2 py-3 xl:px-4 xl:py-4">
                          <span className="block leading-4">
                            {formatDateTime(item.recorded_at, i18n.language)}
                          </span>
                        </td>

                        <td
                          className={`border-b border-gray-100 px-2 py-3 font-semibold xl:px-4 xl:py-4 ${statusClass[item.result_status] || "text-gray-500"
                            }`}
                        >
                          {item.result_status
                            ? t(`attendance_status.${item.result_status}`, {
                              defaultValue: item.result_status,
                            })
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {t("common.total")}:{" "}
                <span className="font-semibold text-gray-900">{count}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.prev")}
                </button>

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="h-10 rounded-xl bg-[#1565d8] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#f8f9fb] px-3 py-3 sm:px-4">
      <p className="text-xs text-gray-500 sm:text-sm">{title}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#101828]">
        {value}
      </p>
    </div>
  );
}

function StatCard({
  title,
  value,
  color = "text-[#101828]",
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
      <p className="text-xs text-gray-500 sm:text-sm">{title}</p>
      <p className={`mt-2 text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
    </div>
  );
}