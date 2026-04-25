import { useQuery } from "@tanstack/react-query";

import type { DashboardApiFilters } from "../dashObjectType.types";
import { DashboardObjectTypeService } from "../api/dashboardObjectType.service";


export function useDashboardObjectType(filters?: DashboardApiFilters) {
  return useQuery({
    queryKey: ["dashboard-object-type", filters],
    queryFn: () => DashboardObjectTypeService.getStatusCount(filters ?? {}),
  });
}