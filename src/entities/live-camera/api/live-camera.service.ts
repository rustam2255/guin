// src/entities/live-camera/api/live-camera.service.ts
import $api from "../../../shared/api/api";
import type { UserRole } from "../../attendance/api/attendance-prisoner.service";

export type LiveCamera = {
  id: number;
  name: string;
  ipv4_address: string;
  port: number;
  username: string;
  object_id: number;
  colony_id: number;
  region_id: number;
  stream_url_endpoint: string;
};

export type CamerasResponse = {
  count: number;
  items: LiveCamera[];
};

export type CameraStreamResponse = {
  camera: LiveCamera;
  client_id: string;
  live_url: string;
};

function getCamerasEndpointByRole(role: UserRole) {
  switch (role) {
    case "SUPERADMIN":
      return "/live-camera/guin-cameras/";

    case "MINTAQA_ADMIN":
    
      return "/live-camera/mintaqa-cameras/";

    case "KALONIYA_ADMIN":
      return "/live-camera/manzil-koloniya-cameras/";

    default:
      return "/live-camera/guin-cameras/";
  }
}

export async function getCamerasByRole(role: UserRole) {
  const endpoint = getCamerasEndpointByRole(role);
  const res = await $api.get<CamerasResponse>(endpoint);
  return res.data;
}

export async function getCameraStreamUrl(cameraId: string | number) {
  const res = await $api.get<CameraStreamResponse>(
    `/live-camera/cameras/${cameraId}/stream-url/`
  );

  return res.data;
}