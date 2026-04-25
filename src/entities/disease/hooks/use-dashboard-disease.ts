
import { useQuery } from "@tanstack/react-query";

import { DiseaseDashboardService } from "../api/disease.service";
import type { DashboardDiseaseFilter } from "../types/disease.types";


export function useDashboardDisease(filters: DashboardDiseaseFilter) {
  return useQuery({
    queryKey: ["dashboard-disease", filters],
    queryFn: () => DiseaseDashboardService.getStatusCount(filters),
  });
}