// src/pages/camera/camera-live-page.tsx
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, VideoOff } from "lucide-react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { useCameraStream } from "../../entities/live-camera/api/use-camera-stream";


export default function CameraLivePage() {
  const { cameraId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCameraStream(cameraId);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
            <div>
              <h1 className="text-lg font-semibold text-[#101828]">
                Kamera live translyatsiya
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Kamera ID: {cameraId || "-"}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Orqaga
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
            {isLoading ? (
              <div className="flex h-[70vh] items-center justify-center text-white">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Stream yuklanmoqda...
              </div>
            ) : isError || !data?.live_url ? (
              <div className="flex h-[70vh] flex-col items-center justify-center text-white">
                <VideoOff className="mb-3 h-10 w-10 text-red-400" />
                <p>Live video topilmadi yoki server javob bermadi</p>
              </div>
            ) : (
              <iframe
                src={data.live_url}
                title={`camera-${cameraId}`}
                className="h-[70vh] w-full border-0 bg-black"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}