import DashboardLayout from "../../app/layout/dashboard-layout";
import { useMemo, useState } from "react";

import StatusTable from "../../shared/statusTable";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useAttendanceObjectLevel } from "../../entities/attendance/api/use-attendance.api";
import type { AttendanceTimeType } from "../../entities/attendance/types/attendance.types";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";

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
  pending: number
  notSent: number;
};

const statusMap: Record<string, { label: string; color: string }> = {
  active: {
    label: "Faol",
    color: "text-blue-500",
  },
  finished: {
    label: "Tugatilgan",
    color: "text-green-600",
  },
  scheduled: {
    label: "Rejalashtirilgan",
    color: "text-yellow-500",
  },
  canceled: {
    label: "Bekor qilingan",
    color: "text-red-500",
  },
};

const timeTypeCards: {
  id: AttendanceTimeType | "";
  count: number;
  title: string;
}[] = [
  { id: "day", count: 1, title: "Kunduzgi sanoq" },
  { id: "night", count: 2, title: "Tungi sanoq" },
  { id: "emergency", count: 3, title: "Favqulodda sanoq" },
];

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

const TablePage = () => {
  const profile = useAuthStore((state) => state.profile);
  const role = profile?.role || "SUPERADMIN";

  const appliedFilters = useDashboardFiltersStore(
    (state) => state.appliedFilters
  );

  const [timeType, setTimeType] = useState<AttendanceTimeType | "">("day");

  const objectParams = useMemo(() => {
    return {
      region: appliedFilters.regionId || undefined,
      colony: appliedFilters.colonyId || undefined,
      object: appliedFilters.placeObjectId || undefined,
      time_type: timeType || undefined,
    };
  }, [
    appliedFilters.regionId,
    appliedFilters.colonyId,
    appliedFilters.placeObjectId,
    timeType,
  ]);

  const objectLevelQuery = useAttendanceObjectLevel(role, objectParams);
  const objectLevelItems = useMemo(() => {
  return objectLevelQuery.data?.items ?? [];
}, [objectLevelQuery.data?.items]);
console.log(objectLevelItems);

  const filteredItems = useMemo(() => {
    return objectLevelItems
      .filter((item) => {
        if (!timeType) return true;
        return item.attendance_time?.time_type === timeType;
      })
      .sort((a, b) => {
        const aTime = new Date(a.attendance_time?.starts_at || 0).getTime();
        const bTime = new Date(b.attendance_time?.starts_at || 0).getTime();

        return bTime - aTime;
      });
  }, [objectLevelItems, timeType]);

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
        label: item.status_label || "Noma’lum",
        color: "text-gray-400",
      };

      return {
        id: index + 1,
        region: item.region?.name || item.region_name || "-",
        province: item.colony?.province_id
          ? `Viloyat ${item.colony.province_id}`
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
      };
    });
  }, [filteredItems]);

  const notSentCount = useMemo(() => {
    return filteredItems.reduce((sum, item) => {
      const pending = Number(item.pending_count || 0);
      const missed = Number(item.missed_count || 0);

      return sum + pending + missed;
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
      <div className="space-y-6">
        <div className="relative w-full">
          <DashboardFiltersBar />

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                Yuborilmaganlar
              </span>

              <div className="flex h-10 min-w-[78px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4">
                <span className="text-[14px] font-bold text-red-500">
                  {notSentCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[14px] font-medium text-gray-800">
                Umumiy
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
                  ${
                    isActive
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
                      ${
                        isActive
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
                    ${
                      isActive
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
            Ma’lumotlar yuklanmoqda...
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-white p-6 text-center text-red-500 shadow-sm">
            Ma’lumotlarni yuklashda xatolik yuz berdi
          </div>
        ) : tableData.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            Ma’lumot topilmadi
          </div>
        ) : (
          <StatusTable data={tableData} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TablePage;