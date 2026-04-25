import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/model/auth.store";
import type { DashboardStatusParams } from "../types/statusTypes";
import { DashboardService } from "../api/dashboardStatusApi";

export const useStatusCount = (params: DashboardStatusParams) => {
  const profile = useAuthStore((state) => state.profile);

  return useQuery({
    queryKey: [
      "status-count",
      profile?.role,
      profile?.region?.id,
      profile?.province?.id,
      profile?.colony?.id,
      params,
    ],
    queryFn: () => DashboardService.getStatusCount(params),
    enabled: !!profile?.role,
  });
};