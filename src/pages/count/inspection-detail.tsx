import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowDownIcon, ArrowLeft } from "lucide-react";
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
  const [resultStatus, setResultStatus] =
  useState<AttendanceResultStatus>("");
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
          <div className="flex flex-col gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#101828]">
                {t("inspection_detail.title")}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {t("inspection_detail.selected_id")}: {attendanceTimeId}
              </p>
            </div>

            <Link
              to="/count"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              {t("common.back")}
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
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
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder={t("inspection_detail.search_placeholder")}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#1565d8] sm:w-[340px]"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="h-11 rounded-xl bg-[#1565d8] px-7 text-sm font-medium text-white hover:bg-[#1257bb]"
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
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm outline-none focus:border-[#1565d8]"
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

            <div className="flex h-11 min-w-[150px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700">
              <span>{t("registry.prisoners")}:</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f9fb] text-left text-[13px] font-semibold text-[#344054]">
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("table.id")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("registry.full_name")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("inspection_detail.face_id")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("filters.colony")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("inspection_detail.object")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("inspection_detail.date")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
                      {t("inspection_detail.recorded_at")}
                    </th>
                    <th className="border-b border-gray-200 px-5 py-5">
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
                        className="text-sm text-[#101828] hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-5 py-5">
                          {offset + index + 1}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5 font-medium">
                          {item.prisoner?.full_name || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5">
                          {item.prisoner?.face_employee_no || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5">
                          {item.colony_name || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5">
                          {item.object_name || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5">
                          {item.date || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-5 py-5">
                          {formatDateTime(item.recorded_at, i18n.language)}
                        </td>

                        <td
                          className={`border-b border-gray-100 px-5 py-5 font-semibold ${
                            statusClass[item.result_status] || "text-gray-500"
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

            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
    <div className="rounded-xl border border-gray-200 bg-[#f8f9fb] px-4 py-3">
      <p className="text-sm text-gray-500">{title}</p>
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
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}