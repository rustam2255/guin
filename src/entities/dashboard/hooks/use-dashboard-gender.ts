import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../api/dashboard.service";
import type { DashboardFilters } from "../types/dashboard-gender.types";


export function useDashboardGender(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard-gender", filters],
    queryFn: () => DashboardService.getStatusCount(filters ?? {}),
  });
}