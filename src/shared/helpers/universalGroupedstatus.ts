import { useQueries } from "@tanstack/react-query";
import type { DashboardStatusParams } from "../../entities/dashboardStatus/types/statusTypes";
import { DashboardService } from "../../entities/dashboardStatus/api/dashboardStatusApi";


type FilterKey = "region" | "province" | "colony" | "place_object";

type GroupItem = {
  id: string;
  name: string;
};

export function useGroupedStatus(
  items: GroupItem[],
  filterKey: FilterKey,
  extraParams?: Omit<DashboardStatusParams, FilterKey>
) {
  return useQueries({
    queries: items.map((item) => ({
      queryKey: ["grouped-status", filterKey, item.id, extraParams],
      queryFn: () =>
        DashboardService.getStatusCount({
          ...extraParams,
          [filterKey]: item.id,
        }),
      enabled: !!item.id,
    })),
  });
}