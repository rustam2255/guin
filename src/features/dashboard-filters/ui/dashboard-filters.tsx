import { Building2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useFilterOptions } from "../../../shared/hooks/use-filter-options";
import { useDashboardFiltersStore } from "../../../shared/store/dashboard-filters.store";
import LoadingSpinner from "../../../shared/loading/loading.spinner";

type SelectOption = {
  label: string;
  value: string;
};

function getObjectTypeId(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const item = value as {
      id?: string | number;
      object_type_id?: string | number;
      value?: string | number;
    };

    if (item.id !== undefined && item.id !== null) return String(item.id);
    if (item.object_type_id !== undefined && item.object_type_id !== null) {
      return String(item.object_type_id);
    }
    if (item.value !== undefined && item.value !== null) {
      return String(item.value);
    }
  }

  return null;
}

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
};

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: CustomSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          w-full h-12 rounded-xl border border-[#D9D9D9] bg-white
          px-4 pr-10 text-[15px] text-[#2B2B2B]
          outline-none appearance-none
          focus:border-[#3B82F6] transition
          disabled:bg-[#F5F5F5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed
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

export default function DashboardFiltersBar() {
  const {
    role,
    regions,
    provinces,
    colonies,
    objectTypes,
    objects,
    isLoading,
    isError,
  } = useFilterOptions();

  const {
    draftFilters,
    setRegionId,
    setProvinceId,
    setColonyId,
    setObjectTypeId,
    setPlaceObjectId,
    applyFilters,
    resetAllFilters,
  } = useDashboardFiltersStore();

  const [isPlaceObjectOpen, setIsPlaceObjectOpen] = useState(false);

  const isSuperAdmin = role === "SUPERADMIN";
  const isRegionAdmin = role === "MINTAQA_ADMIN";
  const isColonyAdmin = role === "KALONIYA_ADMIN";
  const isProvinceAdmin = role === "PROVINCEADMIN";

  const showRegion = isSuperAdmin;
  const showProvince = isSuperAdmin || isRegionAdmin;
  const showColony = isSuperAdmin || isRegionAdmin;
  const showObjectType = true;

  const regionOptions: SelectOption[] = useMemo(
    () =>
      regions.map((item) => ({
        label: item.name,
        value: String(item.id),
      })),
    [regions]
  );

  const selectedRegionId = useMemo(() => {
    if (draftFilters.regionId) return draftFilters.regionId;
    if (regions.length === 1) return String(regions[0].id);
    return "";
  }, [draftFilters.regionId, regions]);

  const provinceOptions: SelectOption[] = useMemo(() => {
    if (isColonyAdmin || isProvinceAdmin) {
      return provinces.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
    }

    if (!selectedRegionId) return [];

    return provinces
      .filter((item) => String(item.region_id) === selectedRegionId)
      .map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
  }, [provinces, selectedRegionId, isColonyAdmin, isProvinceAdmin]);

  const selectedProvinceId = useMemo(() => {
    if (draftFilters.provinceId) return draftFilters.provinceId;
    if (provinceOptions.length === 1) return provinceOptions[0].value;
    return "";
  }, [draftFilters.provinceId, provinceOptions]);

  const colonyOptions: SelectOption[] = useMemo(() => {
    if (isColonyAdmin || isProvinceAdmin) {
      return colonies.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
    }

    if (!selectedProvinceId) return [];

    return colonies
      .filter((item) => String(item.province_id) === selectedProvinceId)
      .map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
  }, [colonies, selectedProvinceId, isColonyAdmin, isProvinceAdmin]);

  const selectedColonyId = useMemo(() => {
    if (draftFilters.colonyId) return draftFilters.colonyId;
    if (colonyOptions.length === 1) return colonyOptions[0].value;
    return "";
  }, [draftFilters.colonyId, colonyOptions]);

  const scopedObjects = useMemo(() => {
    if (!selectedColonyId) return [];

    return objects.filter((item) => String(item.colony_id) === selectedColonyId);
  }, [objects, selectedColonyId]);

  const objectTypeOptions: SelectOption[] = useMemo(() => {
    if (!selectedColonyId) return [];

    const objectTypeIds = new Set(
      scopedObjects
        .map((item) => {
          return (
            getObjectTypeId(item.object_type) ??
            getObjectTypeId((item as { object_type_id?: unknown }).object_type_id)
          );
        })
        .filter(Boolean) as string[]
    );

    return objectTypes
      .filter((item) => objectTypeIds.has(String(item.id)))
      .map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
  }, [selectedColonyId, scopedObjects, objectTypes]);

  const selectedObjectTypeId = useMemo(() => {
    if (draftFilters.objectTypeId) return draftFilters.objectTypeId;
    if (objectTypeOptions.length === 1) return objectTypeOptions[0].value;
    return "";
  }, [draftFilters.objectTypeId, objectTypeOptions]);

  const placeObjectOptions: SelectOption[] = useMemo(() => {
    if (!selectedColonyId || !selectedObjectTypeId) return [];

    return scopedObjects
      .filter((item) => {
        const objectTypeId =
          getObjectTypeId(item.object_type) ??
          getObjectTypeId((item as { object_type_id?: unknown }).object_type_id);

        return objectTypeId === selectedObjectTypeId;
      })
      .map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
  }, [scopedObjects, selectedColonyId, selectedObjectTypeId]);

  const selectedPlaceObjectId = useMemo(() => {
    if (draftFilters.placeObjectId) return draftFilters.placeObjectId;
    if (placeObjectOptions.length === 1) return placeObjectOptions[0].value;
    return "";
  }, [draftFilters.placeObjectId, placeObjectOptions]);

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setIsPlaceObjectOpen(false);
  };

  const handleProvinceChange = (value: string) => {
    setProvinceId(value);
    setIsPlaceObjectOpen(false);
  };

  const handleColonyChange = (value: string) => {
    setColonyId(value);
    setIsPlaceObjectOpen(false);
  };

  const handleObjectTypeChange = (value: string) => {
    setObjectTypeId(value);
    setPlaceObjectId("");
    setIsPlaceObjectOpen(Boolean(value));
  };

  const handleApply = () => {
    if (selectedRegionId && draftFilters.regionId !== selectedRegionId) {
      setRegionId(selectedRegionId);
    }

    if (selectedProvinceId && draftFilters.provinceId !== selectedProvinceId) {
      setProvinceId(selectedProvinceId);
    }

    if (selectedColonyId && draftFilters.colonyId !== selectedColonyId) {
      setColonyId(selectedColonyId);
    }

    if (
      selectedObjectTypeId &&
      draftFilters.objectTypeId !== selectedObjectTypeId
    ) {
      setObjectTypeId(selectedObjectTypeId);
    }

    if (
      selectedPlaceObjectId &&
      draftFilters.placeObjectId !== selectedPlaceObjectId
    ) {
      setPlaceObjectId(selectedPlaceObjectId);
    }

    applyFilters();
  };

  const handleReset = () => {
    resetAllFilters();
    setIsPlaceObjectOpen(false);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="py-4 text-sm text-red-500">
          Filterlarni olishda xatolik yuz berdi
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {showRegion && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#6B7280]">Mintaqa</p>
            <CustomSelect
              value={selectedRegionId}
              onChange={handleRegionChange}
              options={regionOptions}
              placeholder="Mintaqani tanlang"
            />
          </div>
        )}

        {showProvince && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#6B7280]">Viloyat</p>
            <CustomSelect
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              options={provinceOptions}
              placeholder="Viloyatni tanlang"
              disabled={!selectedRegionId}
            />
          </div>
        )}

        {showColony && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#6B7280]">Koloniya</p>
            <CustomSelect
              value={selectedColonyId}
              onChange={handleColonyChange}
              options={colonyOptions}
              placeholder="Koloniyani tanlang"
              disabled={!selectedProvinceId}
            />
          </div>
        )}

        {showObjectType && (
          <div className="space-y-3 xl:col-span-1">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#6B7280]">Obyekt turi</p>
              <CustomSelect
                value={selectedObjectTypeId}
                onChange={(value) => {
                  handleObjectTypeChange(value);
                  setIsPlaceObjectOpen(Boolean(value));
                }}
                options={objectTypeOptions}
                placeholder="Obyekt turini tanlang"
                disabled={!selectedColonyId}
              />
            </div>

            {selectedObjectTypeId && (
              <div
                className="
              rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]
              p-3 sm:p-4 transition-all
            "
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DBEAFE]">
                    <Building2 size={18} className="text-[#2563EB]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827]">
                      Shartnoma obyektlari
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Tanlangan obyekt turiga tegishli obyektlar
                    </p>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isPlaceObjectOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <CustomSelect
                    value={selectedPlaceObjectId}
                    onChange={setPlaceObjectId}
                    options={placeObjectOptions}
                    placeholder="Shartnoma obyektini tanlang"
                    disabled={!selectedObjectTypeId}
                  />

                  {placeObjectOptions.length === 0 && (
                    <p className="mt-3 text-xs text-[#9CA3AF]">
                      Bu obyekt turi uchun shartnoma obyektlari topilmadi.
                    </p>
                  )}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsPlaceObjectOpen((prev) => !prev)}
                    className="
                  inline-flex items-center rounded-xl border border-[#D1D5DB]
                  bg-white px-3 py-2 text-sm font-medium text-[#374151]
                  transition hover:bg-[#F3F4F6]
                "
                  >
                    {isPlaceObjectOpen ? "Yopish" : "Ochish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="col-span-full flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleApply}
            className="
          h-12 rounded-2xl bg-[#2563EB] px-5 text-sm font-semibold text-white
          shadow-sm transition hover:bg-[#1D4ED8]
        "
          >
            Yuborish
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="
          h-12 rounded-2xl border border-[#D1D5DB] bg-white px-5
          text-sm font-medium text-[#374151] transition hover:bg-[#F9FAFB]
        "
          >
            Tozalash
          </button>
        </div>
      </div>
    </div>
  );
}