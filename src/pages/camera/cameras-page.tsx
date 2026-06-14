import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Camera, Loader2, VideoOff } from "lucide-react";

import DashboardLayout from "../../app/layout/dashboard-layout";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import type { UserRole } from "../../entities/attendance/api/attendance-prisoner.service";

import {
  useCamerasByRole,
  useCameraStream,
  useStopCameraStream,
} from "../../entities/live-camera/api/use-camera-stream";

export default function CamerasPage() {
  const profile = useAuthStore((state) => state.profile);
  const role = (profile?.role ?? "SUPERADMIN") as UserRole;


  const { data, isLoading, isError } = useCamerasByRole(role);


  const cameras = useMemo(() => {
    const rawCameras = data?.items ?? [];
    return [...rawCameras].sort((a, b) => {
      if (a.id === 1) return -1;
      if (b.id === 1) return 1;
      return 0;
    });
  }, [data]);

  const [selectedCameraId, setSelectedCameraId] = useState<string | number | null>(null);


  const selectedCameraIdRef = useRef<string | number | null>(null);
  useEffect(() => {
    selectedCameraIdRef.current = selectedCameraId;
  }, [selectedCameraId]);

  const stopStream = useStopCameraStream();

  useEffect(() => {
    if (cameras.length > 0 && selectedCameraId === null) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);


  const {
    data: streamData,
    isLoading: streamLoading,
    isFetching: streamFetching,
    isError: streamError,
  } = useCameraStream(selectedCameraId);


  const handleSelectCamera = useCallback(async (cameraId: number | string) => {
    if (selectedCameraIdRef.current === cameraId) return;

    if (selectedCameraIdRef.current) {
      try {
        await stopStream.refetch();
      } catch (err) {
        console.error("Stop stream error:", err);
      }
    }

    setSelectedCameraId(cameraId);
  }, [stopStream]);


  useEffect(() => {
    return () => {
      if (selectedCameraIdRef.current) {
        stopStream.refetch();
      }
    };
  }, [stopStream]);

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-[#f5f6fa] p-3 sm:p-4">
        <div className="mx-auto max-w-[2200px] space-y-4">

   
          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
            <h1 className="text-xl font-semibold text-[#101828]">Kameralar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Jami kameralar: {isLoading ? "..." : cameras.length}
            </p>
          </div>


          {isLoading ? (
            <div className="flex h-52 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#1565d8]" />
              <span className="text-sm text-gray-500">Kameralar yuklanmoqda...</span>
            </div>
          ) : isError ? (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
              <VideoOff className="mb-3 h-10 w-10 text-red-500" />
              <p className="text-sm text-red-500">Kameralarni yuklashda xatolik yuz berdi</p>
            </div>
          ) : cameras.length === 0 ? (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
              <VideoOff className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-500">Kamera topilmadi</p>
            </div>
          ) : (
            <>
    
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {cameras.map((camera) => {
                  const active = selectedCameraId === camera.id;

                  return (
                    <button
                      key={camera.id}
                      type="button"
                      onClick={() => handleSelectCamera(camera.id)}
                      className={`flex h-14 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-200 ${active
                          ? "border-[#1565d8] bg-[#1565d8] text-white shadow-md"
                          : "border-gray-200 bg-white text-[#101828] hover:border-[#1565d8] hover:shadow-sm"
                        }`}
                    >
                      <Camera className="mb-1 h-4 w-4" />
                      {camera.name || `Kamera ${camera.id}`}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[78vh] overflow-hidden rounded-2xl bg-black shadow-sm">

                {(streamLoading || streamFetching || !selectedCameraId) && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Loader2 className="mr-2 h-7 w-7 animate-spin text-white" />
                    <span className="text-sm text-white">Video oqimi yuklanmoqda...</span>
                  </div>
                )}

  
                {selectedCameraId && (streamError || !streamData?.live_url) ? (
                  <div className="flex h-full flex-col items-center justify-center text-white">
                    <VideoOff className="mb-3 h-12 w-12 text-red-400" />
                    <p className="text-sm px-4 text-center">
                      Live video topilmadi yoki server javob bermadi
                    </p>
                  </div>
                ) : (
         
                  streamData?.live_url && (
                    <iframe
                      key={selectedCameraId}
                      src={streamData.live_url}
                      title={streamData.camera?.name || "Live Camera"}
      
                      className="absolute top-0 left-0 border-0 scale-[1.7] origin-top-left"
                      style={{ width: "100%", height: "100%" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 