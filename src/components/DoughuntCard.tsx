import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
export type DoughnutLegendItem = {
  label: string;
  value: number;
  percent?: string;
  color: string;
};
type DoughnutCardProps = {
  title: string;
  tableHeader: string;
  items: DoughnutLegendItem[];
  totalValue: number | string;
};
const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "58%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
};
function createCenterTextPlugin(totalValue: number | string): Plugin<"doughnut"> {
  return {
    id: "centerTextPlugin",
    afterDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta?.data?.length) return;

      const x = meta.data[0].x;
      const y = meta.data[0].y;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "#111827";
      ctx.font = "700 24px sans-serif";
      ctx.fillText(String(totalValue), x, y);

      ctx.restore();
    },
  };
}
export function DoughnutCard({
  title, 
  items,
  totalValue,
}: DoughnutCardProps) {
  const chartData = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 2,
      },
    ],
  };
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-semibold text-[#222]">{title}</h3>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[170px_1fr]">
        <div className="mx-auto h-[150px] w-[150px]">
          <Doughnut
            data={chartData}
            options={doughnutOptions}
            plugins={[createCenterTextPlugin(totalValue)]}
          />
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] items-center gap-4 text-[15px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#2F2F2F]">{item.label}</span>
              </div>

              <span className="font-medium text-[#2F2F2F]">
                {item.value} ta
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}