import { useQuery } from "@tanstack/react-query";
import { AttendanceService } from "./attendance.service";
import type {
  AttendanceDashboardParams,
  UserRole,
} from "../types/attendance.types";

export function useAttendanceObjectLevel(
  role: UserRole | string | undefined,
  params: AttendanceDashboardParams
) {
  return useQuery({
    queryKey: ["attendance-object-level", role, params],
    queryFn: () => AttendanceService.getObjectLevel(role, params),
    enabled: Boolean(role),
  });
}

export function useAttendancePrisonerLevel(
  role: UserRole | string | undefined,
  params: AttendanceDashboardParams
) {
  return useQuery({
    queryKey: ["attendance-prisoner-level", role, params],
    queryFn: () => AttendanceService.getPrisonerLevel(role, params),
    enabled: Boolean(role),
  });
}