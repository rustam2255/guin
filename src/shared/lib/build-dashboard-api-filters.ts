import { useAuthStore } from "../../entities/auth/model/auth.store";

export type DashboardApiFilters = {
  search?: string;
  region?: string;
  province?: string;
  colony?: string;
  place_object?: string;
  object_type?: string;
  status?: string;
  gender?: string;
  danger_level?: string;
  active_prisoner?: boolean;
};

type DashboardFilters = {
  regionId?: string;
  provinceId?: string;
  colonyId?: string;
  objectTypeId?: string;
  placeObjectId?: string;
};

export function buildDashboardApiFilters(
  filters: DashboardFilters
): DashboardApiFilters {
  const profile = useAuthStore.getState().profile;

  const params: DashboardApiFilters = {
    region: filters.regionId || undefined,
    province: filters.provinceId || undefined,
    colony: filters.colonyId || undefined,
    object_type: filters.objectTypeId || undefined,
    place_object: filters.placeObjectId || undefined,
  };

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
        province: profile.province?.id
          ? String(profile.province.id)
          : undefined,
      };

    case "KALONIYA_ADMIN":
      return {
        ...params,
        region: profile.region?.id ? String(profile.region.id) : undefined,
        province: profile.province?.id
          ? String(profile.province.id)
          : undefined,
        colony: profile.colony?.id ? String(profile.colony.id) : undefined,
      };

    default:
      return params;
  }
}