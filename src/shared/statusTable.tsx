import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { TableItem } from "../pages/count/table";
import {  CircleX, LucideCircleCheck,  } from "lucide-react";

type Props = {
  data: TableItem[];
};

const columnClass =
  "flex min-w-0 items-center justify-center max-w-[140px] xl:max-w-[220px] px-1 text-center sm:px-2";

const StatusTable = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[860px] lg:min-w-[980px] xl:min-w-[1120px]">
        <div className="grid grid-cols-[42px_0.8fr_0.8fr_1fr_1.45fr_0.85fr_0.75fr_0.75fr_0.8fr] rounded-lg border border-blue-300 bg-white px-2 py-2 text-[11px] font-medium text-black sm:px-3 sm:text-[12px] lg:px-4 lg:py-3 lg:text-[14px]">
          <div className={columnClass}>{t("table.id")}</div>
          <div className={columnClass}>{t("table.region")}</div>
          <div className={columnClass}>{t("table.province")}</div>
          <div className={columnClass}>{t("table.colony_address")}</div>
          <div className={columnClass}>{t("table.object")}</div>
          <div className={columnClass}>{t("table.time")}</div>
          <div className={columnClass}>{t("table.count")}</div>
          <div className={columnClass}>Majburiymi</div>
          <div className={columnClass}>{t("table.status")}</div>
        </div>

        <div className="mt-2 space-y-2">
          {data.map((item) => (
            <Link
              key={`${item.id}-${item.object}-${item.time}`}
              to={`/inspection/${item.attendanceTimeId}`}
              state={{ attendance: item }}
              className="grid grid-cols-[42px_0.8fr_0.8fr_1fr_1.45fr_0.85fr_0.75fr_0.75fr_0.8fr] items-center rounded-xl bg-white px-2 py-2 text-[11px] shadow-sm transition hover:bg-blue-50 sm:px-3 sm:text-[12px] lg:px-4 lg:py-3 lg:text-[14px]"
            >
              <div className={columnClass}>{item.id}</div>

              <div className={columnClass}>
                <span className="truncate">{item.region}</span>
              </div>

              <div className={columnClass}>
                <span className="truncate">{item.province}</span>
              </div>

              <div className={columnClass}>
                <span className="truncate">{item.colony}</span>
              </div>

              <div className={columnClass}>
                <span className="truncate font-medium text-blue-600 hover:underline">
                  {item.object}
                </span>
              </div>

              <div
                className={`${columnClass} flex-col text-[10px] sm:text-[11px] lg:text-[12px]`}
              >
                <span className="truncate">{item.sana}</span>
                <span className="truncate text-gray-500">{item.time}</span>
              </div>

              <div className={`${columnClass} font-semibold`}>
                <span className="text-green-500">{item.present}</span>
                <span className="mx-0.5 text-gray-400 sm:mx-1">/</span>
                <span className="text-blue-600">{item.totalAll}</span>
              </div>

              <div className={`${columnClass}`}>
                {item.requirement_check ? (
                  <LucideCircleCheck
                    className="h-7 w-7 rounded-full fill-green-500 text-white"
                    strokeWidth={3}
                  />
                ) : (
                  <CircleX
                    className="h-7 w-7 rounded-full fill-red-500 text-white"
                    strokeWidth={3}
                  />
                )}
              </div>

              <div
                className={`${columnClass} font-semibold ${item.statusColor}`}
              >
                <span className="truncate">{item.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTable;