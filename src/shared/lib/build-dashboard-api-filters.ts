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

  created_at_after?: string;
  created_at_before?: string;
};

type DashboardFilters = {
  regionId?: string;
  provinceId?: string;
  colonyId?: string;
  objectTypeId?: string;
  placeObjectId?: string;

  createdAtAfter?: string;
  createdAtBefore?: string;
};

export function buildDashboardApiFilters(
  filters: DashboardFilters
): DashboardApiFilters {
  const profile = useAuthStore.getState().profile;
  function formatDateToDot(value?: string) {
    if (!value) return undefined;

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) return undefined;

    return `${day}.${month}.${year}`;
  }
  const params: DashboardApiFilters = {
    region: filters.regionId || undefined,
    province: filters.provinceId || undefined,
    colony: filters.colonyId || undefined,
    object_type: filters.objectTypeId || undefined,
    place_object: filters.placeObjectId || undefined,

    created_at_after: formatDateToDot(filters.createdAtAfter),
    created_at_before: formatDateToDot(filters.createdAtBefore),
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