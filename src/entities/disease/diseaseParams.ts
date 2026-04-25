import type { DashboardFilters } from "../../shared/types/filter.types";



export function buildDashboardParams(filters: DashboardFilters) {
  const params: Record<string, string> = {};

  if (filters.regionId) params.region = filters.regionId;
  if (filters.provinceId) params.province = filters.provinceId;
  if (filters.colonyId) params.colony = filters.colonyId;
  if (filters.objectTypeId) params.object_type = filters.objectTypeId;

  return params;
}