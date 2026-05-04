export type UserRole = "SUPERADMIN" | "MINTAQA_ADMIN" | "KALONIYA_ADMIN";

export type AttendanceResultStatus = "present" | "missed" | "pending";

export type AttendanceTimeType = "day" | "night" | string;

export type AttendanceSessionStatus = "scheduled" | "active" | "completed" | string;

export type AttendanceDashboardParams = {
  lang?: string;

  attendance_time?: number | string;
  date?: string;

  region?: number | string;
  colony?: number | string;
  object?: number | string;

  session_status?: AttendanceSessionStatus;
  time_type?: AttendanceTimeType;

  result_status?: AttendanceResultStatus;

  emergency_check?: boolean;
  requirement_check?: boolean;

  created_at_after?: string;
  created_at_before?: string;
};

export type BaseReference = {
  id: number;
  name: string;
  unique_id?: number;
};

export type AttendanceTime = {
  id: number;
  starts_at: string;
  ends_at: string;
  status: AttendanceSessionStatus;
  time_type: AttendanceTimeType;
    emergency_check: boolean;
  requirement_check: boolean;
};

export type RegionReference = BaseReference & {
  guin?: string;
};

export type ColonyReference = BaseReference & {
  province_id?: number;
  region_id?: number;
};

export type ObjectTypeReference = BaseReference;

export type ContractObjectReference = BaseReference & {
  colony_id?: number;
  province_id?: number;
  region_id?: number;
  capacity?: number;
  object_type?: ObjectTypeReference;
};

export type AttendanceObjectLevelItem = {
  attendance_time_id: number;
  attendance_time: AttendanceTime;

  display_status?: AttendanceSessionStatus;
  status_label?: string;
  date?: string;
  time_range?: string;

  region: RegionReference;
  colony: ColonyReference;
  object: ContractObjectReference;

  region_name?: string;
  colony_name?: string;
  object_name?: string;

  attendance_object_id: number;
  total_prisoners: number;
  present_count: number;
  pending_count: number;
  missed_count: number;
  progress_percentage: number;
  progress_text?: string;
  emergency_check: boolean;
  requirement_check: boolean;
};
export type AttendanceObjectLevelSummary = {
  active_sessions_count: number;
  finished_sessions_count: number;
};

export type AttendanceObjectLevelResponse = {
  count: number;
  summary?: AttendanceObjectLevelSummary;
  items: AttendanceObjectLevelItem[];
};

export type AttendancePrisoner = {
  id: number;
  full_name: string;
  fio?: string;
  face_employee_no?: string;
};

export type AttendancePrisonerLevelItem = {
  attendance_time_id: number;
  attendance_time: AttendanceTime;
  region: RegionReference;
  colony: ColonyReference;
  object: ContractObjectReference;
  prisoner: AttendancePrisoner;
  result_status: AttendanceResultStatus;
  recorded_at: string | null;
};

export type AttendancePrisonerLevelResponse = {
  count: number;
  items: AttendancePrisonerLevelItem[];
};