
import $api from "../../../shared/api/api";
import type {
  CameraEventsParams,
  CameraEventsResponse,
  UserRole,
} from "../types/camera-events.types";

const CAMERA_EVENT_SCOPE: Record<UserRole, string> = {
  SUPERADMIN: "guin",
  MINTAQA_ADMIN: "mintaqa",
  KALONIYA_ADMIN: "manzil-koloniya",
  PROVINCEADMIN: "object",
};

function cleanParams(params?: CameraEventsParams) {
  const cleaned: Record<string, unknown> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

export async function getCameraEvents(
  role: UserRole,
  params?: CameraEventsParams
): Promise<CameraEventsResponse> {
  const scope = CAMERA_EVENT_SCOPE[role];

  const res = await $api.get<CameraEventsResponse>(
    `/cameras/${scope}/events/`,
    {
      params: cleanParams(params),
    }
  );

  return res.data;
}