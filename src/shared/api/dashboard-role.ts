import type { DashboardUserRole } from "../types/userrole";


export function getDashboardPrefixByRole(role?: DashboardUserRole | string) {
  switch (role) {
    case "SUPERADMIN":
      return "/prisoners/guin/dashboard";

    case "MINTAQA_ADMIN":
      return "/prisoners/mintaqa/dashboard";

    case "KALONIYA_ADMIN":
      return "/prisoners/manzil-koloniya/dashboard";

    case "PROVINCEADMIN":
      return "/prisoners/object/dashboard";



    default:
      return "/prisoners/guin/dashboard";
  }
}

export function getDashboardStatusEndpoint(role?: DashboardUserRole | string) {
  return `${getDashboardPrefixByRole(role)}/status/`;
}
export function getDashboardDiseaseEndpoint(role?: DashboardUserRole | string) {
  return `${getDashboardPrefixByRole(role)}/disease/`;
}
export function getDashboardGenderEndpoint(role?: DashboardUserRole | string) {
  return `${getDashboardPrefixByRole(role)}/gender/`;
}
export function getDashboardObjectTypeEndpoint(role?: DashboardUserRole | string) {
  return `${getDashboardPrefixByRole(role)}/object-type/`;
} 
