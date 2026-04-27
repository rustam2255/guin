import $api from "../../../shared/api/api";
import type {
  AttendanceDashboardParams,
  AttendanceObjectLevelResponse,
  AttendancePrisonerLevelResponse,
  UserRole,
} from "../types/attendance.types";
import { getAttendanceScopeByRole } from "../helpers/attendance.helpers";

export const AttendanceService = {
  async getObjectLevel(role: UserRole | string | undefined, params: AttendanceDashboardParams) {
    const scope = getAttendanceScopeByRole(role);

    const { data } = await $api.get<AttendanceObjectLevelResponse>(
      `/attendance/${scope}/dashboard/object-level/`,
      { params }
    );

    return data;
  },

  async getPrisonerLevel(role: UserRole | string | undefined, params: AttendanceDashboardParams) {
    const scope = getAttendanceScopeByRole(role);

    const { data } = await $api.get<AttendancePrisonerLevelResponse>(
      `/attendance/${scope}/dashboard/prisoner-level/`,
      { params }
    );

    return data;
  },
};