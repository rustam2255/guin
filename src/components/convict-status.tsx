import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type PrisonStatusChartProps = {
  title?: string;
  total: number | string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

export default function PrisonStatusChart({
  title,
  total,
  labels,
  datasets,
}: PrisonStatusChartProps) {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;
  const isUltraWide = screenWidth >= 1800;

  const chartHeight = useMemo(() => {
    const perItem = isMobile ? 28 : isTablet ? 34 : isUltraWide ? 44 : 38;
    const base = isMobile ? 30 : 40;

    return Math.max(isMobile ? 180 : 240, labels.length * perItem + base);
  }, [labels.length, isMobile, isTablet, isUltraWide]);

  const barThickness = useMemo(() => {
    if (isMobile) return 8;
    if (isTablet) return 10;
    if (isUltraWide) return 16;
    return 12;
  }, [isMobile, isTablet, isUltraWide]);

  const valueInsideBarPlugin: Plugin<"bar"> = useMemo(
    () => ({
      id: "valueInsideBarPlugin",

      afterDatasetsDraw(chart) {
        const { ctx } = chart;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${
          isMobile ? 8 : isTablet ? 9 : isUltraWide ? 13 : 10
        }px Inter, sans-serif`;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.data.forEach((bar, index) => {
            const value = Number(dataset.data[index]);

            if (!value || value <= 0) return;

            const props = bar.getProps(["x", "y", "base"], true);
            const barWidth = Math.abs(props.x - props.base);

            if (barWidth < 18) return;

            const x = props.base + (props.x - props.base) / 2;
            const y = props.y;

            ctx.fillText(String(value), x, y);
          });
        });

        ctx.restore();
      },
    }),
    [isMobile, isTablet, isUltraWide]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: {
        padding: {
          top: 2,
          right: isMobile ? 4 : isUltraWide ? 16 : 8,
          bottom: 2,
          left: 0,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            color: "#e5e7eb",
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: isMobile ? 9 : isTablet ? 10 : isUltraWide ? 14 : 11,
            },
            callback: (value) => {
              const numericValue = Number(value);

              if (numericValue === 0) return "0";
              if (numericValue >= 1000) return numericValue / 1000 + "K";

              return String(numericValue);
            },
          },
        },
        y: {
          stacked: true,
          grid: { display: false },
          border: {
            display: false,
          },
          ticks: {
            color: "#374151",
            autoSkip: false,
            font: {
              size: isMobile ? 9 : isTablet ? 10 : isUltraWide ? 15 : 12,
            },
          },
        },
      },
    }),
    [isMobile, isTablet, isUltraWide]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: datasets.map((dataset) => ({
        ...dataset,
        borderRadius: 4,
        barThickness,
        maxBarThickness: barThickness,
        categoryPercentage: 0.58,
        barPercentage: 0.82,
      })),
    }),
    [labels, datasets, barThickness]
  );

  return (
    <div
      className="
        rounded-3xl bg-white shadow-sm
        p-4
        sm:p-5
        lg:p-6
        xl:p-6
        2xl:p-7
        min-[1800px]:p-8
        min-[2200px]:p-10
      "
    >
      <div className="mb-3 sm:mb-4 lg:mb-5 min-[1800px]:mb-6">
        <p
          className="
            text-gray-600
            text-[12px]
            sm:text-[13px]
            lg:text-[14px]
            2xl:text-[15px]
            min-[1800px]:text-[17px]
            min-[2200px]:text-[18px]
          "
        >
          {title}
        </p>

        <h2
          className="
            font-semibold leading-tight text-gray-900
            text-[24px]
            sm:text-[30px]
            lg:text-[36px]
            2xl:text-[42px]
            min-[1800px]:text-[50px]
            min-[2200px]:text-[56px]
          "
        >
          {total}
        </h2>
      </div>

      <div
        className="w-full"
        style={{
          height: `${chartHeight}px`,
        }}
      >
        <Bar
          data={data}
          options={options}
          plugins={[valueInsideBarPlugin]}
        />
      </div>
    </div>
  );
}