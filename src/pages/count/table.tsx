import DashboardLayout from "../../app/layout/dashboard-layout";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import StatusTable from "../../shared/statusTable";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useAttendanceObjectLevel } from "../../entities/attendance/api/use-attendance.api";
import type { AttendanceTimeType } from "../../entities/attendance/types/attendance.types";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";
import LoadingSpinner from "../../shared/loading/loading.spinner";

type InspectionTab = AttendanceTimeType | "emergency";

export type TableItem = {
  id: number;
  region: string;
  province: string;
  colony: string;
  object: string;
  sana: string;
  time: string;
  status: string;
  statusColor: string;
  total: number;
  totalAll: number;
  province_name: string;
  present: number;
  pending: number;
  attendanceTimeId: number;
  notSent: number;
  emergency_check: boolean;
  requirement_check: boolean;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("uz-UZ");
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "-";

  const startTime = new Date(start).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(end).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

function formatDateToDot(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return undefined;
  return `${day}.${month}.${year}`;
}

export default function TablePage() {
  const { t } = useTranslation();

  const profile = useAuthStore((state) => state.profile);
  const role = profile?.role || "SUPERADMIN";

  const appliedFilters = useDashboardFiltersStore(
    (state) => state.appliedFilters
  );

  const [timeType, setTimeType] = useState<InspectionTab>("day");
  
  // 🔢 PAGINATION STATE'LARI
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20); // Default backend limiti bilan bir xil: 20

  const statusMap: Record<string, { label: string; color: string }> = useMemo(
    () => ({
      active: { label: t("status.active"), color: "text-blue-500" },
      finished: { label: t("status.finished"), color: "text-green-600" },
      scheduled: { label: t("status.scheduled"), color: "text-yellow-500" },
      canceled: { label: t("status.canceled"), color: "text-red-500" },
    }),
    [t]
  );

  const timeTypeCards: { id: InspectionTab; count: number; title: string }[] = [
    { id: "day", count: 1, title: t("inspection.day") },
    { id: "night", count: 2, title: t("inspection.night") },
    { id: "emergency", count: 3, title: t("inspection.emergency") },
  ];

  // 🧮 BACKEND SWAGGER UCHUN OFFSET QIYMATINI HISOBLASH
  const currentOffset = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  // ⚙️ PARAMETRLAR BACKEND HUJJATIDAGI DIZAYNGA TO'LIQ MOSLANDI
  const objectParams = useMemo(() => {
    return {
      region: appliedFilters.regionId || undefined,
      colony: appliedFilters.colonyId || undefined,
      object: appliedFilters.placeObjectId || undefined,
      time_type: timeType === "day" || timeType === "night" ? timeType : undefined,
      emergency_check: timeType === "emergency" ? true : undefined,
      created_at_after: formatDateToDot(appliedFilters.createdAtAfter),
      created_at_before: formatDateToDot(appliedFilters.createdAtBefore),
      
      // ✅ Eski page o'rniga haqiqiy limit va offset yuborilmoqda
      limit: pageSize, 
      offset: currentOffset,
    };
  }, [
    appliedFilters.regionId,
    appliedFilters.colonyId,
    appliedFilters.placeObjectId,
    appliedFilters.createdAtAfter,
    appliedFilters.createdAtBefore,
    timeType,
    pageSize,
    currentOffset,
  ]);

  const objectLevelQuery = useAttendanceObjectLevel(role, objectParams);

  const objectLevelItems = useMemo(() => {
    return objectLevelQuery.data?.items ?? [];
  }, [objectLevelQuery.data?.items]);

  // Jami elementlar soni backend taqdim etgan "count" maydonidan olinadi
  const totalItemsCount = objectLevelQuery.data?.count ?? 0;
  const totalPages = Math.ceil(totalItemsCount / pageSize);

  const tableData: TableItem[] = useMemo(() => {
    return objectLevelItems.map((item, index) => {
      const startsAt = item.attendance_time?.starts_at;
      const endsAt = item.attendance_time?.ends_at;

      const total = Number(item.total_prisoners || 0);
      const present = Number(item.present_count || 0);
      const pending = Number(item.pending_count || 0);
      const missed = Number(item.missed_count || 0);
      const notSent = pending + missed;

      const statusKey = item.display_status || item.attendance_time?.status || "";
      const statusInfo = statusMap[statusKey] || {
        label: item.status_label || t("status.unknown"),
        color: "text-gray-400",
      };

      // ✅ Tartib raqami to'g'ri chiqishi uchun joriy global offset qo'shildi
      const globalIndex = currentOffset + index + 1;

      return {
        id: globalIndex,
        attendanceTimeId: item.attendance_time_id,
        region: item.region?.name || item.region_name || "-",
        province_name: item.province_name || "-",
        province: item.colony?.province_id
          ? `${t("filters.province")} ${item.colony.province_id}`
          : "-",
        colony: item.colony?.name || item.colony_name || "-",
        object: item.object?.name || item.object_name || "-",
        sana: item.date || formatDate(startsAt),
        time: item.time_range || formatTimeRange(startsAt, endsAt),
        status: item.status_label || statusInfo.label,
        statusColor: statusInfo.color,
        total,
        pending,
        totalAll: total,
        present,
        notSent,
        emergency_check: Boolean(item.emergency_check || item.attendance_time?.emergency_check),
        requirement_check: Boolean(item.requirement_check || item.attendance_time?.requirement_check),
      };
    });
  }, [objectLevelItems, statusMap, t, currentOffset]);

  // Stats uchun umumiy hisob-kitoblar
  const activeCount = useMemo(() => {
    return objectLevelItems.reduce((sum, item) => sum + Number(item.present_count || 0), 0);
  }, [objectLevelItems]);

  const totalAllCount = useMemo(() => {
    return objectLevelItems.reduce((sum, item) => sum + Number(item.total_prisoners || 0), 0);
  }, [objectLevelItems]);

  const isLoading = objectLevelQuery.isLoading;
  const isError = objectLevelQuery.isError;

  // Tab o'zgarganda birinchi sahifaga qaytarish
  const handleTimeTypeChange = (id: InspectionTab) => {
    setTimeType(id);
    setCurrentPage(1);
  };

  // Sahifa o'zgarganda silliq tepaga scroll qilish
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div className="relative mx-auto w-full max-w-[2200px] space-y-6 ">
        
        {/* FILTERS & STATS */}
        <div className="relative w-full">
          <DashboardFiltersBar />

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                {t("stats.active")}
              </span>
              <div className="flex h-10 min-w-[78px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4">
                <span className="text-[14px] font-bold text-green-500">{activeCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                {t("stats.total")}
              </span>
              <div className="flex h-10 min-w-[78px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4">
                <span className="text-[14px] font-bold text-gray-900">{totalAllCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TIME TYPE CARDS */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {timeTypeCards.map((item) => {
            const isActive = timeType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTimeTypeChange(item.id)}
                className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-[#3b82f6] bg-[rgba(229,241,255,1)] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#3b82f6] hover:bg-[rgba(229,241,255,1)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-[32px] min-w-[32px] items-center justify-center rounded-lg text-[14px] font-semibold transition-all duration-200 ${
                    isActive ? "bg-[#0F5FC2] text-white" : "bg-[rgba(229,241,255,1)] text-[rgba(15,95,194,1)] group-hover:bg-[#0F5FC2] group-hover:text-white"
                  }`}>
                    {item.count}
                  </div>
                  <p className="text-[16px] font-medium text-gray-800">{item.title}</p>
                </div>
                <span className={`text-xl transition-colors duration-200 ${isActive ? "text-[#0F5FC2]" : "text-gray-400 group-hover:text-[#0F5FC2]"}`}>
                  ›
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-sm flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="rounded-2xl bg-white p-6 text-center text-red-500 shadow-sm">
              {t("common.error")}
            </div>
          ) : tableData.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
              {t("common.not_found")}
            </div>
          ) : (
            <StatusTable data={tableData} />
          )}
        </div>


        {!isLoading && totalPages > 1 && (
          <div className="sticky bottom-2 left-0 right-0 z-40 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 hover:bg-white animate-fade-in-up">
            

            <div className="text-sm font-medium text-gray-600">
              {t("Ko‘rsatilmoqda")} <span className="text-gray-900 font-semibold">{currentOffset + 1}</span>-
              <span className="text-gray-900 font-semibold">{Math.min(currentOffset + pageSize, totalItemsCount)}</span> {t("of")}{" "}
              <span className="text-gray-900 font-semibold">{totalItemsCount}</span>
            </div>


            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-2 text-gray-400 font-medium">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                          currentPage === page
                            ? "bg-[#0F5FC2] text-white shadow-md shadow-blue-500/20 scale-105"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300"
              >
                ›
              </button>
            </div>


            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">{t("Ko'rsatilsin")}:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}