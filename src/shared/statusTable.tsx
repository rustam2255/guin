import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // 🔥 SHU QATOR QO‘SHILDI
import type { TableItem } from "../pages/count/table";

type Props = {
  data: TableItem[];
};

const columnClass =
  "flex min-w-0 items-center justify-center px-2 text-center";

const StatusTable = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1100px]">
        {/* HEADER */}
        <div className="grid grid-cols-[70px_1fr_1fr_1.2fr_1.8fr_1fr_1fr_1fr] rounded-lg border border-blue-300 bg-white px-4 py-3 text-[14px] font-medium text-black">
          <div className={columnClass}>{t("table.id")}</div>
          <div className={columnClass}>{t("table.region")}</div>
          <div className={columnClass}>{t("table.province")}</div>
          <div className={columnClass}>{t("table.colony_address")}</div>
          <div className={columnClass}>{t("table.object")}</div>
          <div className={columnClass}>{t("table.time")}</div>
          <div className={columnClass}>{t("table.count")}</div>
          <div className={columnClass}>{t("table.status")}</div>
        </div>

        {/* BODY */}
        <div className="mt-2 space-y-2">
          {data.map((item) => (
            <Link
              key={`${item.id}-${item.object}-${item.time}`}
              to={`/inspection/${item.attendanceTimeId}`} // 🔥 ASOSIY JOY
              state={{ attendance: item }}
              className="grid grid-cols-[70px_1fr_1fr_1.2fr_1.8fr_1fr_1fr_1fr] items-center rounded-xl bg-white px-4 py-3 text-[14px] shadow-sm hover:bg-blue-50 transition"
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

              {/* 🔥 OBJECT BOSILADI */}
              <div className={columnClass}>
                <span className="truncate font-medium text-blue-600 hover:underline">
                  {item.object}
                </span>
              </div>

              <div className={`${columnClass} flex-col text-[12px]`}>
                <span>{item.sana}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>

              <div className={`${columnClass} font-semibold`}>
                <span className="text-green-500">{item.present}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-blue-600">{item.totalAll}</span>
              </div>

              <div
                className={`${columnClass} font-semibold ${item.statusColor}`}
              >
                {item.status}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTable;