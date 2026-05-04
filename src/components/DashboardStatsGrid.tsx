import { Globe2, Users } from "lucide-react";
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
    {
      id: "total-prisoners",
      label: "Moyilligi bor mahbuslar",
      value: 0,
      icon: Users,
      iconColor: "#059669",
      valueColor: "#2f2f2f",
    },
  ];

  return (
    <div className="grid grid-cols-1 overflow-visible rounded-2xl bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {finalItems.map((item, index) => {
        const Icon = item.icon;
        const isLastInRowDesktop = (index + 1) % 7 === 0;
        const isLastItem = index === finalItems.length - 1;

        return (
          <div
            key={item.id}
            className={`
              group relative flex min-w-0 cursor-pointer items-center gap-2 px-3 py-3
              ${index < finalItems.length - 1 ? "border-b border-[#e5e7eb] xl:border-b-0" : ""}
              ${!isLastInRowDesktop && !isLastItem ? "xl:border-r border-[#e5e7eb]" : ""}
              ${index % 2 === 0 && index !== finalItems.length - 1 ? "sm:border-r border-[#e5e7eb]" : ""}
              ${index < 2 ? "sm:border-b border-[#e5e7eb]" : ""}
            `}
          >
            <div className="flex h-12 w-12 min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(201.18deg,#E5F1FF_3.14%,#EFFFF6_86.04%)]">
              <Icon
                className="h-6 w-6"
                strokeWidth={1.8}
                style={{ color: item.iconColor }}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px] text-[#3f3f46]">
                {item.label}
              </p>

              <p
                className="mt-1 text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold"
                style={{ color: item.valueColor || "#2f2f2f" }}
              >
                {item.value}
              </p>
            </div>

            <div className="pointer-events-none absolute left-3 top-full z-50 mt-2 max-w-[240px] rounded-xl bg-[#111827] px-3 py-2 text-xs font-medium leading-snug text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-1 group-hover:opacity-100">
              {item.label}
              <div className="absolute -top-1 left-5 h-2 w-2 rotate-45 bg-[#111827]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}