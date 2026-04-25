import type { DashboardStatusCount } from "../../entities/dashboardStatus/types/statusTypes";


export function transformStatusChartData(data?: DashboardStatusCount) {
  if (!data) {
    return {
      total: 0,
      labels: [],
      datasets: [],
    };
  }

  return {
    total: data.count,
    labels: data.items.map((item) => item.status.name),
    datasets: [
      {
        label: "Erkaklar",
        data: data.items.map((item) => item.male_count),
        backgroundColor: "#0F5FC2",
      },
      {
        label: "Ayollar",
        data: data.items.map((item) => item.female_count),
        backgroundColor: "#10B981",
      },
    ],
  };
}