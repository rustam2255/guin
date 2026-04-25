import { ChevronDown } from "lucide-react";
import type { SelectOption } from "../types/filter.types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
};

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          w-full h-12 rounded-[12px] border border-[#D9D9D9] bg-white
          px-4 pr-10 text-[15px] text-[#2B2B2B]
          outline-none appearance-none
          disabled:bg-[#F5F5F5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed
          focus:border-[#3B82F6] transition
        "
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
      />
    </div>
  );
}