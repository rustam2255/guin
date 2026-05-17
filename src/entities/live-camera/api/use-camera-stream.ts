// src/entities/live-camera/api/use-camera-stream.ts
import { useQuery } from "@tanstack/react-query";
import type { UserRole } from "../../attendance/api/attendance-prisoner.service";
import { getCamerasByRole, getCameraStreamUrl, stopCameraStream } from "./live-camera.service";

export function useCamerasByRole(role: UserRole) {
  return useQuery({
    queryKey: ["live-cameras", role],
    queryFn: () => getCamerasByRole(role),
    enabled: !!role,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCameraStream(cameraId: string | number | null) {
  return useQuery({
    queryKey: ["camera-stream", cameraId],
    queryFn: () => getCameraStreamUrl(cameraId!),
    // ID aniq bo'lmasa yoki null bo'lsa serverga mutlaqo so'rov ketmaydi!
    enabled: cameraId !== null && cameraId !== undefined,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useStopCameraStream(enabled: boolean = false) {
  return useQuery({
    queryKey: ["stop-camera-stream"],
    queryFn: stopCameraStream,
    enabled,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}