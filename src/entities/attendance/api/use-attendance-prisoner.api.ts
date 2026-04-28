import { useQuery } from "@tanstack/react-query";
import { AttendancePrisonerService, type UserRole } from "./attendance-prisoner.service";
import type { AttendancePrisonerLevelParams } from "../types/attendance-prisoner.types";

export function useAttendancePrisonerLevel(
  role: UserRole,
  params: AttendancePrisonerLevelParams
) {
  return useQuery({
    queryKey: ["attendance-prisoner-level", role, params],
    queryFn: () => AttendancePrisonerService.getPrisonerLevel(role, params),
    enabled: Boolean(params.attendance_time),
  });
}