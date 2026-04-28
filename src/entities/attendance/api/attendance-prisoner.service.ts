import $api from "../../../shared/api/api";
import type {
  AttendancePrisonerLevelParams,
  AttendancePrisonerLevelResponse,
} from "../types/attendance-prisoner.types";

export type UserRole = "SUPERADMIN" | "MINTAQA_ADMIN" | "KALONIYA_ADMIN";

function getPrisonerLevelUrl(role: UserRole) {
  if (role === "SUPERADMIN") {
    return "/attendance/guin/dashboard/prisoner-level/";
  }

  if (role === "MINTAQA_ADMIN") {
    return "/attendance/mintaqa/dashboard/prisoner-level/";
  }

  return "/attendance/manzil-koloniya/dashboard/prisoner-level/";
}

export const AttendancePrisonerService = {
  async getPrisonerLevel(
    role: UserRole,
    params: AttendancePrisonerLevelParams
  ) {
    const { data } = await $api.get<AttendancePrisonerLevelResponse>(
      getPrisonerLevelUrl(role),
      { params }
    );

    return data;
  },
};