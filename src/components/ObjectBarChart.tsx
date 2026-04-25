import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
type ObjectBarChartItem = {
  label: string;
  value: number;
  color: string;
};
type ObjectBarChartProps = {
  title: string;
  items: ObjectBarChartItem[];
  footerCount?: number | string;
  footerLabel?: string;
};
export default function ObjectBarChart({
  title,
  items,
  footerCount = 15,
  footerLabel = "Manzil kaloniya mavjud",
}: ObjectBarChartProps) {
  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        borderRadius: 8,
        borderSkipped: false as const,
        barThickness: 26,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#E5E7EB",
        titleColor: "#111827",
        bodyColor: "#111827",
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0]?.label || "",
          label: (context) => `${context.raw} ta`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 300,
        grid: {
          display: false,
          
        },
        border: {
          display: false,
        },
        ticks: {
          stepSize: 100,
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-semibold text-[#222]">{title}</h3>

      <div className="h-[180px]">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="rounded-md bg-[#E7F8EE] px-2 py-0.5 text-[14px] font-semibold text-[#07B256]">
          {footerCount}
        </span>
        <span className="text-[14px] text-[#4B5563]">{footerLabel}</span>
      </div>
    </div>
  );
}