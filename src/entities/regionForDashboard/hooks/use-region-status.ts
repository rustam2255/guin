import { useQueries } from "@tanstack/react-query";
import { DashboardService } from "../../dashboardStatus/api/dashboardStatusApi";

type StatusBreakdownItem = {
  id: string;
  label: string;
  type: "region" | "colony";
};

export function useStatusBreakdown(items: StatusBreakdownItem[]) {
  return useQueries({
    queries: items.map((item) => ({
      queryKey: ["status-breakdown", item.type, item.id],
      queryFn: () =>
        DashboardService.getStatusCount(
          item.type === "region"
            ? { region: item.id }
            : { colony: item.id }
        ),
      enabled: !!item.id,
    })),
  });
}