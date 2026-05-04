export type UserRole =
  | "SUPERADMIN"
  | "MINTAQA_ADMIN"
  | "KALONIYA_ADMIN"
  | "PROVINCEADMIN";

export type CameraEventType = string;

export type CameraEvent = {
  id: number;
  name: string;
  description?: string;
  timestamp: string;
  event_type: CameraEventType;
  is_simulated: boolean;
  is_read: boolean;
  notified_at?: string | null;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  camera?: {
    id: number;
    name: string;
  };
};

export type CameraEventsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CameraEvent[];
};

export type CameraEventsParams = {
  limit?: number;
  offset?: number;
  lang?: string;
  search?: string;

  event_type?: string;
  is_simulated?: boolean;
  is_read?: boolean;

  camera_device?: number | string;
  region?: number | string;
  colony?: number | string;
  place_object?: number | string;

  timestamp_after?: string;
  timestamp_before?: string;
  created_at_after?: string;
  created_at_before?: string;
};