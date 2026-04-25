

export type DashboardUserRole =
  | "SUPERADMIN"
  | "MINTAQA_ADMIN"
  | "PROVINCEADMIN"
  | "KALONIYA_ADMIN";

export type DashboardUserScope = {
  role?: DashboardUserRole | string;
  region?: { id: number; name: string } | null;
  province?: { id: number; name: string } | null;
  colony?: { id: number; name: string } | null;
};