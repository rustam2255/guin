// src/pages/camera/cameras-page.tsx
import { useMemo } from "react";
import { Camera, Loader2, VideoOff, PlayCircle } from "lucide-react";
import DashboardLayout from "../../app/layout/dashboard-layout";

import { useAuthStore } from "../../entities/auth/model/auth.store";
import type { UserRole } from "../../entities/attendance/api/attendance-prisoner.service";
import { useCamerasByRole } from "../../entities/live-camera/api/use-camera-stream";

export default function CamerasPage() {
  const profile = useAuthStore((state) => state.profile);
  const role = (profile?.role ?? "SUPERADMIN") as UserRole;

  const { data, isLoading, isError } = useCamerasByRole(role);

  const cameras = useMemo(() => data?.items ?? [], [data?.items]);

  const openCameraInNewTab = (cameraId: number | string) => {
    window.open(`/camera/${cameraId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen mx-auto w-full max-w-[2200px]  bg-[#f5f6fa] p-3 sm:p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <h1 className="text-lg font-semibold text-[#101828]">
              Kameralar
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Jami: {isLoading ? "..." : cameras.length}
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Kameralar yuklanmoqda...
            </div>
          ) : isError ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white text-red-500">
              <VideoOff className="mb-2 h-8 w-8" />
              Kameralarni yuklashda xatolik yuz berdi
            </div>
          ) : cameras.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white text-gray-500">
              <VideoOff className="mb-2 h-8 w-8" />
              Kamera topilmadi
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  type="button"
                  onClick={() => openCameraInNewTab(camera.id)}
                  className="group overflow-hidden rounded-xl bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative flex aspect-video items-center justify-center bg-[#101828]">
                    <Camera className="h-8 w-8 text-white/70" />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                      <PlayCircle className="h-9 w-9 text-white" />
                    </div>
                  </div>

                  <div className="px-2.5 py-2">
                    <h3 className="truncate text-xs font-semibold text-[#101828] sm:text-sm">
                      {camera.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}