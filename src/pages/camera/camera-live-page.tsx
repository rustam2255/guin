// src/pages/camera/camera-live-page.tsx
import {  useParams } from "react-router-dom";
import {
 
  ExternalLink,
  Loader2,
  MonitorPlay,
  VideoOff,
} from "lucide-react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { useCameraStream } from "../../entities/live-camera/api/use-camera-stream";

export default function CameraLivePage() {
  const { cameraId } = useParams();


  const { data, isLoading, isError } = useCameraStream(cameraId);

  const openLive = () => {
    if (!data?.live_url) return;
    window.open(data.live_url, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen mx-auto w-full max-w-[2200px]  bg-[#f5f6fa] p-3 sm:p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[#101828]">
                Kamera live translyatsiya
              </h1>
            </div>

    
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {isLoading ? (
              <div className="flex h-[70vh] items-center justify-center text-gray-500">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Stream URL olinmoqda...
              </div>
            ) : isError || !data?.live_url ? (
              <div className="flex h-[70vh] flex-col items-center justify-center text-gray-500">
                <VideoOff className="mb-3 h-10 w-10 text-red-400" />
                <p>Live video topilmadi yoki server javob bermadi</p>
              </div>
            ) : (
              <div className="flex h-[70vh] flex-col items-center justify-center bg-[#101828] p-5 text-center text-white">
                <MonitorPlay className="mb-4 h-14 w-14 text-white/80" />

                <h2 className="text-xl font-semibold">
                  {data.camera?.name || "Kamera live"}
                </h2>


                <button
                  type="button"
                  onClick={openLive}
                  className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#101828] transition hover:bg-gray-100"
                >
                  <ExternalLink size={18} />
                  Live kamerani ochish
                </button>

             
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}