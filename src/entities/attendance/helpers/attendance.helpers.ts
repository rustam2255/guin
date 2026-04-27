import type { UserRole } from "../types/attendance.types";

export function getAttendanceScopeByRole(role?: UserRole | string) {
  if (role === "SUPERADMIN") return "guin";
  if (role === "MINTAQA_ADMIN") return "mintaqa";
  if (role === "KALONIYA_ADMIN") return "manzil-koloniya";

  return "guin";
}