// src/pages/camera/cameras-page.tsx
import { useMemo } from "react";
import { Camera, VideoOff, ExternalLink } from "lucide-react";
import DashboardLayout from "../../app/layout/dashboard-layout";

// API vaqtincha o‘chirildi
// import { Loader2 } from "lucide-react";
// import { useAuthStore } from "../../entities/auth/model/auth.store";
// import type { UserRole } from "../../entities/attendance/api/attendance-prisoner.service";
// import { useCamerasByRole } from "../../entities/live-camera/api/use-camera-stream";

type LocalCamera = {
  id: number;
  name: string;
  url: string;
};

const LOCAL_CAMERAS: LocalCamera[] = [
  { id: 1, name: "Kamera 1", url: "http://192.168.88.230" },
  { id: 2, name: "Kamera 2", url: "http://192.168.88.231" },
  { id: 3, name: "Kamera 3", url: "http://192.168.88.232" },
  { id: 4, name: "Kamera 4", url: "http://192.168.88.233" },
  { id: 5, name: "Kamera 5", url: "http://192.168.88.237" },
  { id: 6, name: "Kamera 6", url: "http://192.168.88.2" },
  { id: 7, name: "Kamera 7", url: "http://192.168.88.4" },
  { id: 8, name: "Kamera 8", url: "http://192.168.88.5" },
 
];

export default function CamerasPage() {
  // API vaqtincha o‘chirildi
  // const profile = useAuthStore((state) => state.profile);
  // const role = (profile?.role ?? "SUPERADMIN") as UserRole;
  // const { data, isLoading, isError } = useCamerasByRole(role);
  // const cameras = useMemo(() => data?.items ?? [], [data?.items]);

  const cameras = useMemo(() => LOCAL_CAMERAS, []);

  const openCamera = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
            <h1 className="text-lg font-semibold text-[#101828]">
              Kameralar
            </h1>

            <p className="mt-1 text-sm text-gray-500">
               Jami: {cameras.length}
            </p>
          </div>

          {cameras.length === 0 ? (
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
                  onClick={() => openCamera(camera.url)}
                  className="rounded-2xl cursor-pointer bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Camera size={22} />
                    </div>

                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#101828]">
                    {camera.name}
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