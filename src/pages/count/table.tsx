import DashboardLayout from "../../app/layout/dashboard-layout";
import { useMemo, useState } from "react";
import UniversalFilters from "../../shared/selectInput";
import StatusTable from "../../shared/statusTable";


export type TableItem = {
  id: number;
  fio: string;
  region: string;
  province: string;
  colony: string;
  object: string;
  status: string;
  sana: string;
  time: string;
};

const TablePage = () => {
  const [region, setRegion] = useState("all_regions");
  const [province, setProvince] = useState("all_provinces");
  const [colony, setColony] = useState("all_colonies");
  const [objectType, setObjectType] = useState("contract_objects");
  const [date, setDate] = useState("2025-03-25");
  const [time, setTime] = useState("10:00");

  const [activeShift, setActiveShift] = useState<number>(1);

  const selects = [
    {
      id: "region",
      value: region,
      onChange: setRegion,
      options: [{ label: "Barcha Mintaqalar", value: "all_regions" }],
    },
    {
      id: "province",
      value: province,
      onChange: setProvince,
      options: [{ label: "Barcha viloyatlar", value: "all_provinces" }],
    },
    {
      id: "colony",
      value: colony,
      onChange: setColony,
      options: [{ label: "Barcha manzil kalonyalar", value: "all_colonies" }],
    },
    {
      id: "objectType",
      value: objectType,
      onChange: setObjectType,
      options: [{ label: "Shartnoma obyektlari", value: "contract_objects" }],
    },
  ];

  const stats = [
    {
      id: "unsent-label",
      label: "Yuborilmaganlar",
      value: 12,
      valueClassName: "text-red-500",
    },
    {
      id: "total-count",
      value: 4000,
    },
  ];

  const shifts = [
    { id: 1, count: 1, title: "Smena" },
    { id: 2, count: 2, title: "Smena" },
    { id: 3, count: 3, title: "Smena" },
    { id: 4, count: 4, title: "Favqulodda sanoq" },
  ];

  const tableDataByShift: Record<number, TableItem[]> = {
      1: [
      {
        id: 1,
        fio: "Aliyev Sardor",
        region: "Toshkent",
        province: "Yunusobod",
        colony: "1-koloniya",
        object: "1-shartnoma obyekti",
        status: "Yuborilgan",
        sana: "25.03.2025",
        time: "10:00",
      },
      {
        id: 2,
        fio: "Karimov Aziz",
        region: "Toshkent",
        province: "Chilonzor",
        colony: "2-koloniya",
        object: "2-shartnoma obyekti",
        status: "Yuborilmagan",
        sana: "25.03.2025",
        time: "10:00",
      },
    ],
    2: [
      {
        id: 1,
        fio: "Aliyev Sardor",
        region: "Toshkent",
        province: "Yunusobod",
        colony: "1-koloniya",
        object: "1-shartnoma obyekti",
        status: "Yuborilgan",
        sana: "25.03.2025",
        time: "10:00",
      },
      {
        id: 2,
        fio: "Karimov Aziz",
        region: "Toshkent",
        province: "Chilonzor",
        colony: "2-koloniya",
        object: "2-shartnoma obyekti",
        status: "Yuborilmagan",
        sana: "25.03.2025",
        time: "10:00",
      },
    ],
    3: [
      {
        id: 1,
        fio: "Rustamov Bekzod",
        region: "Samarqand",
        province: "Urgut",
        colony: "3-koloniya",
        object: "3-shartnoma obyekti",
        status: "Yuborilgan",
        sana: "25.03.2025",
        time: "10:00",
      },
      {
        id: 2,
        fio: "Sodiqov Jasur",
        region: "Buxoro",
        province: "G'ijduvon",
        colony: "4-koloniya",
        object: "4-shartnoma obyekti",
        status: "Yuborilgan",
        sana: "25.03.2025",
        time: "10:00",
      },
    ],
    4: [
      {
        id: 1,
        fio: "Toshmatov Davron",
        region: "Andijon",
        province: "Asaka",
        colony: "5-koloniya",
        object: "5-shartnoma obyekti",
        status: "Favqulodda",
        sana: "25.03.2025",
        time: "10:00",
      },
      {
        id: 2,
        fio: "Qodirov Sanjar",
        region: "Namangan",
        province: "Chortoq",
        colony: "6-koloniya",
        object: "6-shartnoma obyekti",
        status: "Tekshiruvda",
        sana: "25.03.2025",
        time: "10:00",
      },
    ],
  };

  const currentTableData = useMemo(() => {
    return tableDataByShift[activeShift] || [];
  }, [activeShift]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
          <UniversalFilters
            selects={selects}
            dateValue={date}
            onDateChange={setDate}
            timeValue={time}
            onTimeChange={setTime}
            stats={stats}
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shifts.map((item) => {
            const isActive = activeShift === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveShift(item.id)}
                className={`
                  group flex items-center justify-between rounded-xl border px-4 py-3 text-left
                  transition-all duration-200
                  ${
                    isActive
                      ? "border-[#3b82f6] bg-[rgba(229,241,255,1)]"
                      : "border-gray-200 bg-white hover:border-[#3b82f6] hover:bg-[rgba(229,241,255,1)]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex h-[32px] min-w-[32px] items-center justify-center rounded-lg font-semibold text-[14px]
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#0F5FC2] text-white"
                          : "bg-[rgba(229,241,255,1)] text-[rgba(15,95,194,1)] group-hover:bg-[#0F5FC2] group-hover:text-white"
                      }
                    `}
                  >
                    {item.count}
                  </div>

                  <p className="text-[16px] font-medium text-gray-800">
                    {item.title}
                  </p>
                </div>

                <span
                  className={`
                    text-xl transition-colors duration-200
                    ${
                      isActive
                        ? "text-[#0F5FC2]"
                        : "text-gray-400 group-hover:text-[#0F5FC2]"
                    }
                  `}
                >
                  ›
                </span>
              </button>
            );
          })}
        </div>

        <StatusTable data={currentTableData} />
      </div>
    </DashboardLayout>
  );
};

export default TablePage;