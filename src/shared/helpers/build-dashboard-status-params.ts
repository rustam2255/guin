import type { DashboardStatusParams } from "../../entities/dashboardStatus/types/statusTypes";
import type { DashboardUserScope } from "../types/userrole";

export function buildDashboardStatusParams(
  rawParams: DashboardStatusParams = {},
  profile?: DashboardUserScope | null
): DashboardStatusParams {
  const params: DashboardStatusParams = { ...rawParams };

  switch (profile?.role) {
    case "SUPERADMIN":
      return params;

    case "MINTAQA_ADMIN":
      return {
        ...params,
        region: profile.region?.id ? String(profile.region.id) : undefined,
      };

    case "PROVINCEADMIN":
      return {
        ...params,
        region: profile.region?.id ? String(profile.region.id) : undefined,
        province: profile.province?.id ? String(profile.province.id) : undefined,
      };

    case "KALONIYA_ADMIN":
      return {
        ...params,
        region: profile.region?.id ? String(profile.region.id) : undefined,
        province: profile.province?.id ? String(profile.province.id) : undefined,
        colony: profile.colony?.id ? String(profile.colony.id) : undefined,
      };

    default:
      return params;
  }
}