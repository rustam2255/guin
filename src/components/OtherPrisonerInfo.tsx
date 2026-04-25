type InfoCardItem = {
  count: number;
  title: string;
  onClick?: () => void;
};

type InfoCardsGridProps = {
  data: InfoCardItem[];
  columns?: string;
};

const InfoCardsGrid = ({
  data,
  columns = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
}: InfoCardsGridProps) => {
  return (
    <div className={`grid ${columns} gap-4 w-full`}>
      {data.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-[rgba(229,241,255,1)] hover:border-[#3b82f6] text-left"
        >
          <div className="flex items-center gap-3 ">
            <div
              className="bg-[rgba(229,241,255,1)] text-[rgba(15,95,194,1)]
              font-semibold px-3 py-1 rounded-lg
              transition-all duration-200
              group-hover:bg-[#0F5FC2] group-hover:text-white shrink-0"
            >
              {item.count}
            </div>

            <p className="text-[15px] font-medium text-gray-800 truncate">
              {item.title}
            </p>
          </div>

          <span className="text-gray-400 text-xl group-hover:text-[#0F5FC2] shrink-0">
            ›
          </span>
        </button>
      ))}
    </div>
  );
};

export default InfoCardsGrid;