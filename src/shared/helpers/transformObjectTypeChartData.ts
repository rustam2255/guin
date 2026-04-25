import type { DoughnutLegendItem } from "../../components/AddressAndGenderCards";
import type { DashboardObjectTypeResponse } from "../../entities/dashboardObjectType/dashObjectType.types";

const COLORS = [
  "#2d6cdf",
  "#1f9d63",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export function transformObjectTypeDoughnutItems(
  data: DashboardObjectTypeResponse | undefined
): DoughnutLegendItem[] {
  const items = data?.items ?? [];

  return items.map((item, index) => ({
    label: item.object_type?.name ?? "Noma'lum",
    value: item.total_count ?? 0,
    color: COLORS[index % COLORS.length],
  }));
}