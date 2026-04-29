// src/pages/camera/cameras-page.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2, VideoOff } from "lucide-react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import type { UserRole } from "../../entities/attendance/api/attendance-prisoner.service";
import { useCamerasByRole } from "../../entities/live-camera/api/use-camera-stream";


export default function CamerasPage() {
  const navigate = useNavigate();

  const profile = useAuthStore((state) => state.profile);
  const role = (profile?.role ?? "SUPERADMIN") as UserRole;

  const { data, isLoading, isError } = useCamerasByRole(role);

  const cameras = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <h1 className="text-lg font-semibold text-[#101828]">
              Kameralar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Role: {role} | Jami: {data?.count ?? 0}
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-[#1565d8]" />
            </div>
          ) : isError ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white text-red-500">
              <VideoOff className="mb-2 h-8 w-8" />
              Kameralarni yuklab bo‘lmadi
            </div>
          ) : cameras.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white text-gray-500">
              <VideoOff className="mb-2 h-8 w-8" />
              Kamera topilmadi
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  type="button"
                  onClick={() => navigate(`/camera/${camera.id}`)}
                  className="rounded-2xl cursor-pointer bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Camera size={22} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#101828]">
                    {camera.name || `Kamera ${camera.id}`}
                  </h3>

                
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}