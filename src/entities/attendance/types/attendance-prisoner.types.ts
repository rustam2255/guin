export type AttendanceResultStatus = "present" | "missed" | "pending" | "";
export type UserRole = "SUPERADMIN" | "MINTAQA_ADMIN" | "KALONIYA_ADMIN";
export type AttendancePrisonerLevelParams = {
  lang?: string;
  attendance_time?: number | string;
  date?: string;
  region?: number | string;
  colony?: number | string;
  object?: number | string;
  session_status?: string;
  time_type?: string;
  result_status?: AttendanceResultStatus;
};

export type AttendancePrisonerLevelItem = {
  attendance_time_id: number;
  attendance_object_id: number;
  attendance_prisoner_id: number;

  display_status: string;
  status_label: string;
  date: string;
  time_range: string;

  region_name: string;
  colony_name: string;
  object_name: string;
  attendance_time: boolean;
  prisoner: {
    id: number;
    full_name: string;
    face_employee_no?: string;
  };

  result_status: "present" | "missed" | "pending";
  recorded_at: string | null;
};

export type AttendancePrisonerLevelResponse = {
  count: number;
  items: AttendancePrisonerLevelItem[];
};