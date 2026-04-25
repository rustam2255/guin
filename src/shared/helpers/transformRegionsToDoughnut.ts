import type { UseQueryResult } from "@tanstack/react-query";
import type { DoughnutLegendItem } from "../../components/AddressAndGenderCards";
import type { DashboardStatusCount } from "../../entities/dashboardStatus/types/statusTypes";

const COLORS = [
  "#2d6cdf",
  "#1f9d63",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
  "#f43f5e",
  "#84cc16",
  "#a855f7",
];

export function transformStatusResultsToDoughnut(
  results: UseQueryResult<DashboardStatusCount, Error>[],
  labels: string[]
): DoughnutLegendItem[] {
  return results.map((res, index) => {
    const total =
      res.data?.items?.reduce((sum, item) => sum + item.total_count, 0) ?? 0;

    return {
      label: labels[index] ?? `Item ${index + 1}`,
      value: total,
      color: COLORS[index % COLORS.length],
    };
  });
}