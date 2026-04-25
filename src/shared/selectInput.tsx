import { ChevronDown } from "lucide-react";

type SelectOption = {
  label: string;
  value: string;
};

type FilterSelectItem = {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  minWidth?: string;
  disabled?: boolean;
};

type StatItem = {
  id: string;
  label?: string;
  value: string | number;
  valueClassName?: string;
  boxClassName?: string;
};

type UniversalFiltersProps = {
  selects?: FilterSelectItem[];
  stats?: StatItem[];
  className?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLoading?: boolean;

  dateValue?: string;
  onDateChange?: (value: string) => void;
  timeValue?: string;
  onTimeChange?: (value: string) => void;
};

function SingleSelect({ item }: { item: FilterSelectItem }) {
  return (
    <div
      className="relative flex-1"
      style={{ minWidth: item.minWidth || "180px" }}
    >
      <select
        value={item.value}
        onChange={(e) => item.onChange(e.target.value)}
        disabled={item.disabled}
        className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14px] text-gray-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {item.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

function StatBox({ item }: { item: StatItem }) {
  return (
    <div className="flex items-center gap-2">
      {item.label ? (
        <span className="whitespace-nowrap text-[14px] text-gray-700">
          {item.label}
        </span>
      ) : null}

      <div
        className={`min-w-[56px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-[14px] font-medium text-gray-800 ${item.boxClassName || ""}`}
      >
        <span className={item.valueClassName || ""}>{item.value}</span>
      </div>
    </div>
  );
}

export default function UniversalFilters({
  selects = [],
  stats = [],
  className = "",
  onSubmit,
  submitDisabled = false,
  submitLoading = false,
}: UniversalFiltersProps) {
  return (
    <div className={`rounded-2xl p-2 ${className}`}>
      <div className="flex flex-col gap-3">
        {selects.length > 0 && (
          <div className="flex flex-wrap items-start gap-3">
            {selects.map((item) => (
              <SingleSelect key={item.id} item={item} />
            ))}
          </div>
        )}

        {(stats.length > 0 || onSubmit) && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {onSubmit && (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitDisabled || submitLoading}
                  className="rounded-xl bg-[#0d6efd] px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLoading ? "Yuklanmoqda..." : "Yuborish"}
                </button>
              )}
            </div>

            {stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {stats.map((item) => (
                  <StatBox key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}