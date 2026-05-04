import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCameraEvents } from "../api/camera-events.api";
import type {
  CameraEventsParams,
  UserRole,
} from "../types/camera-events.types";

export function useCameraEvents(
  role?: string,
  params?: CameraEventsParams
) {
  const { i18n } = useTranslation();

  const enabledRole =
    role === "SUPERADMIN" ||
    role === "MINTAQA_ADMIN" ||
    role === "KALONIYA_ADMIN" ||
    role === "PROVINCEADMIN";

  return useQuery({
    queryKey: ["camera-events", role, params, i18n.language],
    queryFn: () =>
      getCameraEvents(role as UserRole, {
        ...params,
        lang: i18n.language,
      }),
    enabled: enabledRole,
    staleTime: 30_000,
  });
}