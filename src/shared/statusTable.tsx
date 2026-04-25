import type { TableItem } from "../pages/count/table"


type Props = {
  data: TableItem[]
}

const StatusTable = ({ data }: Props) => {
  return (
    <div className="w-full">


      <div className="grid grid-cols-7 bg-white border border-blue-300 rounded-lg px-4 py-3 text-[14px] font-medium text-black">
        <div>id</div>
        <div>Mintaqa</div>
        <div>Viloyat</div>
        <div>Manzil kalonya</div>
        <div>Shartnoma obyekti</div>
        <div>Vaqt</div>
        <div>Status</div>
      </div>


      <div className="space-y-2 mt-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-7 items-center bg-white rounded-xl px-4 py-3 shadow-sm text-[14px]"
          >
            <div>{item.id}</div>
            <div>{item.region}</div>
            <div>{item.province}</div>
            <div>{item.colony}</div>
            <div>{item.object}</div>

            <div className="flex flex-col text-[12px]">
              <span>25.03.2025</span>
              <span className="text-gray-500">{item.time}</span>
            </div>

            <div
              className={`font-medium ${
                item.status === "sent"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {item.status === "sent" ? "Yuborilgan" : "Yuborilmagan"}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default StatusTable