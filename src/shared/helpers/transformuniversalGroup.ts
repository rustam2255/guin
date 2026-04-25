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
  "#f97316",
];

type GroupItem = {
  id: string;
  name: string;
};

export function transformGroupedStatusToDoughnut(
  groups: GroupItem[],
  results: UseQueryResult<DashboardStatusCount, Error>[]
): DoughnutLegendItem[] {
  return groups.map((group, index) => {
    const res = results[index];

    const total =
      res?.data?.items?.reduce((sum, item) => sum + item.total_count, 0) ?? 0;

    return {
      label: group.name,
      value: total,
      color: COLORS[index % COLORS.length],
      percent: "0%",
    };
  });
}