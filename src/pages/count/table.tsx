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

function itemSafeDate(value?: string | null) {
  return value || 0;
}

export default function TablePage() {
  const { t } = useTranslation();

  const profile = useAuthStore((state) => state.profile);
  const role = profile?.role || "SUPERADMIN";

  const appliedFilters = useDashboardFiltersStore(
    (state) => state.appliedFilters
  );

  const [timeType, setTimeType] = useState<InspectionTab>("day");

  const statusMap: Record<string, { label: string; color: string }> = useMemo(
    () => ({
      active: {
        label: t("status.active"),
        color: "text-blue-500",
      },
      finished: {
        label: t("status.finished"),
        color: "text-green-600",
      },
      scheduled: {
        label: t("status.scheduled"),
        color: "text-yellow-500",
      },
      canceled: {
        label: t("status.canceled"),
        color: "text-red-500",
      },
    }),
    [t]
  );

  const timeTypeCards: {
    id: InspectionTab;
    count: number;
    title: string;
  }[] = [
      { id: "day", count: 1, title: t("inspection.day") },
      { id: "night", count: 2, title: t("inspection.night") },
      { id: "emergency", count: 3, title: t("inspection.emergency") },
    ];

  const objectParams = useMemo(() => {
    return {
      region: appliedFilters.regionId || undefined,
      colony: appliedFilters.colonyId || undefined,
      object: appliedFilters.placeObjectId || undefined,

      time_type:
        timeType === "day" || timeType === "night" ? timeType : undefined,

      emergency_check: timeType === "emergency" ? true : undefined,

      created_at_after: formatDateToDot(appliedFilters.createdAtAfter),
      created_at_before: formatDateToDot(appliedFilters.createdAtBefore),
    };
  }, [
    appliedFilters.regionId,
    appliedFilters.colonyId,
    appliedFilters.placeObjectId,
    appliedFilters.createdAtAfter,
    appliedFilters.createdAtBefore,
    timeType,
  ]);

  const objectLevelQuery = useAttendanceObjectLevel(role, objectParams);

  const objectLevelItems = useMemo(() => {
    return objectLevelQuery.data?.items ?? [];
  }, [objectLevelQuery.data?.items]);

  const filteredItems = useMemo(() => {
    return objectLevelItems
      .filter((item) => {
        const isEmergency =
          item.emergency_check === true ||
          item.attendance_time?.emergency_check === true;

        if (timeType === "emergency") {
          return isEmergency;
        }

        if (isEmergency) {
          return false;
        }

        return item.attendance_time?.time_type === timeType;
      })
      .filter((item) => {
        const itemDate = item.date;

        if (!itemDate) return false;

        if (appliedFilters.createdAtAfter) {
          if (itemDate < appliedFilters.createdAtAfter) return false;
        }

        if (appliedFilters.createdAtBefore) {
          if (itemDate > appliedFilters.createdAtBefore) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aTime = new Date(
          itemSafeDate(a.attendance_time?.starts_at)
        ).getTime();
        const bTime = new Date(
          itemSafeDate(b.attendance_time?.starts_at)
        ).getTime();

        return bTime - aTime;
      });
  }, [
    objectLevelItems,
    timeType,
    appliedFilters.createdAtAfter,
    appliedFilters.createdAtBefore,
  ]);

  const tableData: TableItem[] = useMemo(() => {
    return filteredItems.map((item, index) => {
      const startsAt = item.attendance_time?.starts_at;
      const endsAt = item.attendance_time?.ends_at;

      const total = Number(item.total_prisoners || 0);
      const present = Number(item.present_count || 0);
      const pending = Number(item.pending_count || 0);
      const missed = Number(item.missed_count || 0);
      const notSent = pending + missed;

      const statusKey =
        item.display_status || item.attendance_time?.status || "";

      const statusInfo = statusMap[statusKey] || {
        label: item.status_label || t("status.unknown"),
        color: "text-gray-400",
      };

      return {
        id: index + 1,
        attendanceTimeId: item.attendance_time_id,
        region: item.region?.name || item.region_name || "-",
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
        emergency_check: Boolean(
          item.emergency_check || item.attendance_time?.emergency_check
        ),
        requirement_check: Boolean(
          item.requirement_check || item.attendance_time?.requirement_check
        ),
      };
    });
  }, [filteredItems, statusMap, t]);

  const activeCount = useMemo(() => {
    return filteredItems.reduce((sum, item) => {
      return sum + Number(item.present_count || 0);
    }, 0);
  }, [filteredItems]);

  const totalAllCount = useMemo(() => {
    return filteredItems.reduce((sum, item) => {
      return sum + Number(item.total_prisoners || 0);
    }, 0);
  }, [filteredItems]);

  const isLoading = objectLevelQuery.isLoading;
  const isError = objectLevelQuery.isError;

  return (
    <DashboardLayout>
      <div className="space-y-6 mx-auto w-full max-w-[2200px] ">
        <div className="relative w-full">
          <DashboardFiltersBar />

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                {t("stats.active")}
              </span>

              <div className="flex h-10 min-w-[78px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4">
                <span className="text-[14px] font-bold text-green-500">
                  {activeCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                {t("stats.total")}
              </span>

              <div className="flex h-10 min-w-[78px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4">
                <span className="text-[14px] font-bold text-gray-900">
                  {totalAllCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {timeTypeCards.map((item) => {
            const isActive = timeType === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeType(item.id)}
                className={`
                  group flex items-center justify-between rounded-xl border px-4 py-3 text-left
                  transition-all duration-200
                  ${isActive
                    ? "border-[#3b82f6] bg-[rgba(229,241,255,1)]"
                    : "border-gray-200 bg-white hover:border-[#3b82f6] hover:bg-[rgba(229,241,255,1)]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex h-[32px] min-w-[32px] items-center justify-center rounded-lg text-[14px] font-semibold
                      transition-all duration-200
                      ${isActive
                        ? "bg-[#0F5FC2] text-white"
                        : "bg-[rgba(229,241,255,1)] text-[rgba(15,95,194,1)] group-hover:bg-[#0F5FC2] group-hover:text-white"
                      }
                    `}
                  >
                    {item.count}
                  </div>

                  <p className="text-[16px] font-medium text-gray-800">
                    {item.title}
                  </p>
                </div>

                <span
                  className={`
                    text-xl transition-colors duration-200
                    ${isActive
                      ? "text-[#0F5FC2]"
                      : "text-gray-400 group-hover:text-[#0F5FC2]"
                    }
                  `}
                >
                  ›
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
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
    </DashboardLayout>
  );
}