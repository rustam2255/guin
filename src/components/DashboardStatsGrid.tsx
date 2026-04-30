import { Globe2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatsItem = {
  id: string | number;
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  valueColor?: string;
};

type DashboardStatsGridProps = {
  items: StatsItem[];
};

export default function DashboardStatsGrid({ items }: DashboardStatsGridProps) {
  const finalItems: StatsItem[] = [
    ...items,
    {
      id: "foreign-citizens",
      label: "Chet el fuqarolari",
      value: 0,
      icon: Globe2,
      iconColor: "#2563eb",
      valueColor: "#2f2f2f",
    },
  ];

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {finalItems.map((item, index) => {
        const Icon = item.icon;
        const isLastInRowDesktop = (index + 1) % 4 === 0;
        const isLastItem = index === finalItems.length - 1;

        return (
          <div
            key={item.id}
            className={`
              flex items-center gap-4 px-6 py-4
              ${index < finalItems.length - 1 ? "border-b border-[#e5e7eb] lg:border-b-0" : ""}
              ${!isLastInRowDesktop && !isLastItem ? "lg:border-r border-[#e5e7eb]" : ""}
              ${index % 2 === 0 && index !== finalItems.length - 1 ? "sm:border-r border-[#e5e7eb] lg:border-r" : ""}
              ${index < 2 ? "sm:border-b border-[#e5e7eb] lg:border-b-0" : ""}
            `}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(201.18deg,#E5F1FF_3.14%,#EFFFF6_86.04%)]">
              <Icon
                className="h-8 w-8"
                strokeWidth={1.8}
                style={{ color: item.iconColor }}
              />
            </div>

            <div>
              <p className="text-[14px] leading-none text-[#3f3f46]">
                {item.label}
              </p>

              <p
                className="mt-2 text-[28px] font-semibold leading-none"
                style={{ color: item.valueColor || "#2f2f2f" }}
              >
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}