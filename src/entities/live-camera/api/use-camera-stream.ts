
import { useQuery } from "@tanstack/react-query";
import type { UserRole } from "../../attendance/api/attendance-prisoner.service";
import { getCamerasByRole, getCameraStreamUrl } from "./live-camera.service";

export function useCamerasByRole(role: UserRole) {
  return useQuery({
    queryKey: ["live-cameras", role],
    queryFn: () => getCamerasByRole(role),
    enabled: !!role,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCameraStream(cameraId?: string) {
  return useQuery({
    queryKey: ["camera-stream", cameraId],
    queryFn: () => getCameraStreamUrl(cameraId!),
    enabled: !!cameraId,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}