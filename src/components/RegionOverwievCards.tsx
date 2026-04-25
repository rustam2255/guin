import { DoughnutCard } from "./AddressAndGenderCards";
import ObjectBarChart from "./ObjectBarChart";

type DoughnutItem = {
  label: string;
  value: number;
  percent?: string;
  color: string;
};

type BarItem = {
  label: string;
  value: number;
  color: string;
};

type RegionOverviewCardsProps = {
  doughnutTitle: string;
  doughnutTableHeader: string;
  doughnutTotalValue: number | string;
  doughnutItems: DoughnutItem[];

  barTitle: string;
  barItems: BarItem[];
  barFooterCount?: number | string;
  barFooterLabel?: string;
};

export default function RegionOverviewCards({
  doughnutTitle,
  doughnutTableHeader,
  doughnutTotalValue,
  doughnutItems,
  barTitle,
  barItems,
  barFooterCount,
  barFooterLabel,
}: RegionOverviewCardsProps) {
  const normalizedDoughnutItems = doughnutItems.map((item) => ({
    ...item,
    percent: item.percent ?? "0%",
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <DoughnutCard
        title={doughnutTitle}
        tableHeader={doughnutTableHeader}
        totalValue={doughnutTotalValue}
        items={normalizedDoughnutItems}
      />

      <ObjectBarChart
        title={barTitle}
        items={barItems}
        footerCount={barFooterCount}
        footerLabel={barFooterLabel}
      />
    </div>
  );
}