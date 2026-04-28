import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

export type DoughnutLegendItem = {
  label: string;
  value: number;
  color: string;
};

type DoughnutCardProps = {
  title: string;
  tableHeader: string;
  items: DoughnutLegendItem[];
  totalValue?: number;
  buttonText?: string;
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

function createCenterTextPlugin(
  getTotal: () => number,
  totalLabel: string
): Plugin<"doughnut"> {
  return {
    id: "centerTextPlugin",
    afterDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!meta?.data?.length) return;

      const x = meta.data[0].x;
      const y = meta.data[0].y;
      const totalValue = getTotal();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "#6B7280";
      ctx.font = "500 12px sans-serif";
      ctx.fillText(totalLabel, x, y - 12);

      ctx.fillStyle = "#111827";
      ctx.font = "700 22px sans-serif";
      ctx.fillText(String(totalValue), x, y + 10);

      ctx.restore();
    },
  };
}

export function DoughnutCard({
  title,
  tableHeader,
  items,
  totalValue,
}: DoughnutCardProps) {
  const { t } = useTranslation();

  const calculatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const finalTotal = totalValue ?? calculatedTotal;

  const chartData = useMemo(() => {
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.value),
          backgroundColor: items.map((item) => item.color),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [items]);

  const centerTextPlugin = useMemo(() => {
    return createCenterTextPlugin(
      () => finalTotal,
      t("dashboard.total")
    );
  }, [finalTotal, t]);

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#222]">{title}</h3>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[180px_1fr]">
        <div className="mx-auto h-[160px] w-[160px]">
          <Doughnut
            key={`${finalTotal}-${t("dashboard.total")}`}
            data={chartData}
            options={doughnutOptions}
            plugins={[centerTextPlugin]}
          />
        </div>

        <div className="w-full">
          <div className="mb-2 grid grid-cols-[minmax(0,1fr)_90px_70px] items-center border-b border-gray-200 pb-2 text-[13px] font-medium text-gray-500">
            <p>{tableHeader}</p>
            <p className="text-right">{t("registry.prisoners")}</p>
            <p className="text-right">%</p>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const percent =
                finalTotal > 0
                  ? Math.round((item.value / finalTotal) * 100)
                  : 0;

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_90px_70px] items-center text-[14px]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-gray-700">
                      {item.label}
                    </span>
                  </div>

                  <p className="text-right font-medium text-gray-900">
                    {item.value}
                  </p>

                  <p className="whitespace-nowrap text-right font-medium text-gray-500">
                    {percent}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}