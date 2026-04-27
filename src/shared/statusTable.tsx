import type { TableItem } from "../pages/count/table";

type Props = {
  data: TableItem[];
};

const columnClass =
  "flex min-w-0 items-center justify-center px-2 text-center";

const StatusTable = ({ data }: Props) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1100px]">
        <div className="grid grid-cols-[70px_1fr_1fr_1.2fr_1.8fr_1fr_1fr_1fr] rounded-lg border border-blue-300 bg-white px-4 py-3 text-[14px] font-medium text-black">
          <div className={columnClass}>ID</div>
          <div className={columnClass}>Mintaqa</div>
          <div className={columnClass}>Viloyat</div>
          <div className={columnClass}>Manzil kalonya</div>
          <div className={columnClass}>Shartnoma obyekti</div>
          <div className={columnClass}>Vaqt</div>
          <div className={columnClass}>Yuborilmagan</div>
          <div className={columnClass}>Status</div>
        </div>

        <div className="mt-2 space-y-2">
          {data.map((item) => (
            <div
              key={`${item.id}-${item.object}-${item.time}`}
              className="grid grid-cols-[70px_1fr_1fr_1.2fr_1.8fr_1fr_1fr_1fr] items-center rounded-xl bg-white px-4 py-3 text-[14px] shadow-sm"
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
                <span className="truncate">{item.object}</span>
              </div>

              <div className={`${columnClass} flex-col text-[12px]`}>
                <span>{item.sana}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>

              <div className={`${columnClass} font-semibold`}>
                <span className="text-red-500">{item.notSent}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-green-600">{item.totalAll}</span>
              </div>

              <div className={`${columnClass} font-semibold ${item.statusColor}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTable;