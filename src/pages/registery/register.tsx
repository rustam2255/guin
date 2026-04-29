import { useMemo, useState } from "react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";
import { usePrisonersList } from "../../entities/prisoners/api/use-prisoners.api";

type SmenaValue = "" | "BIRINCHI" | "IKKINCHI" | "UCHINCHI";

const smenaOptions: { label: string; value: SmenaValue }[] = [
  { label: "Barchasi", value: "" },
  { label: "1-smena", value: "BIRINCHI" },
  { label: "2-smena", value: "IKKINCHI" },
  { label: "3-smena", value: "UCHINCHI" },
];

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("uz-UZ");
}

function getStatusText(status: unknown) {
  if (!status) return "-";
  if (typeof status === "string") return status;

  if (typeof status === "object") {
    const item = status as { name?: string; label?: string };
    return item.name || item.label || "-";
  }

  return "-";
}

export default function RegistryPage() {
  const { t } = useTranslation();

  const profile = useAuthStore((state) => state.profile);
  const role = profile?.role || "SUPERADMIN";

  const appliedFilters = useDashboardFiltersStore(
    (state) => state.appliedFilters
  );

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedSmena, setSelectedSmena] = useState<SmenaValue>("");

  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const params = useMemo(() => {
    return {
      limit,
      offset,
      search: submittedSearch || undefined,
      smena: selectedSmena || undefined,

      region: appliedFilters.regionId || undefined,
      province: appliedFilters.provinceId || undefined,
      colony: appliedFilters.colonyId || undefined,
      place_object: appliedFilters.placeObjectId || undefined,
      object_type: appliedFilters.objectTypeId || undefined,
    };
  }, [limit, offset, submittedSearch, selectedSmena, appliedFilters]);

  const prisonersQuery = usePrisonersList(role, params);

  const prisoners = prisonersQuery.data?.results ?? [];
  const count = prisonersQuery.data?.count ?? 0;

  const handleSearch = () => {
    setOffset(0);
    setSubmittedSearch(search.trim());
  };

  const handleSmenaChange = (value: SmenaValue) => {
    setOffset(0);
    setSelectedSmena(value);
  };

  const canPrev = offset > 0;
  const canNext = offset + limit < count;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] px-2 py-3 sm:px-3 lg:px-0 lg:py-0">
        <div className="mx-auto w-full max-w-[1800px] space-y-3 sm:space-y-4">
          <DashboardFiltersBar />

          <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4 lg:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full flex-col gap-2 lg:flex-row xl:max-w-[760px]">
                <div className="flex w-full gap-2 lg:max-w-[360px]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearch(value);

                      if (!value.trim()) {
                        setOffset(0);
                        setSubmittedSearch("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder={t("registry.search_placeholder")}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#1565d8] sm:h-11 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="h-10 shrink-0 rounded-xl bg-[#1565d8] px-4 text-xs font-medium text-white transition hover:bg-[#1257bb] sm:h-11 sm:px-5 sm:text-sm"
                  >
                    {t("filters.search")}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 lg:w-auto">
                  {smenaOptions.map((item) => {
                    const active = selectedSmena === item.value;

                    return (
                      <button
                        key={item.value || "all"}
                        type="button"
                        onClick={() => handleSmenaChange(item.value)}
                        className={[
                          "h-10 rounded-xl border px-3 text-xs font-semibold transition sm:h-11 sm:px-4 sm:text-sm",
                          active
                            ? "border-[#1565d8] bg-[#1565d8] text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#1565d8] hover:text-[#1565d8]",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:w-auto">
                <button className="h-10 rounded-xl bg-[#18b368] px-5 text-xs font-medium text-white transition hover:bg-[#139357] sm:h-11 sm:px-8 sm:text-sm">
                  {t("registry.download")}
                </button>

                <div className="flex h-10 min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-700 sm:h-11 sm:min-w-[155px] sm:px-4 sm:text-sm">
                  <span className="truncate">{t("registry.prisoners")}:</span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {prisonersQuery.isLoading ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                {t("common.loading")}
              </div>
            ) : prisonersQuery.isError ? (
              <div className="px-4 py-10 text-center text-sm text-red-500">
                {t("registry.error")}
              </div>
            ) : prisoners.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                {t("common.not_found")}
              </div>
            ) : (
              <>
                <div className="grid gap-3 p-3 md:hidden">
                  {prisoners.map((item, index) => (
                    <Link
                      key={item.id}
                      to={`/registry/${item.id}`}
                      state={{ prisoner: item }}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.99]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-[11px] font-medium text-gray-400">
                            #{offset + index + 1}
                          </p>

                          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
                            {item.full_name}
                          </h3>
                        </div>

                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#1565d8]">
                          {item.smena_label || "-"}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                          <span className="text-gray-500">
                            {t("registry.birth_date")}
                          </span>
                          <span className="text-right font-medium text-gray-900">
                            {formatDate(item.birth_date)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Smena</span>
                          <span className="text-right font-medium text-gray-900">
                            {item.smena_label || item.smena || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="shrink-0 text-gray-500">
                            {t("registry.colony")}
                          </span>
                          <span className="line-clamp-1 text-right font-medium text-gray-900">
                            {item.colony?.name || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="shrink-0 text-gray-500">
                            {t("registry.object")}
                          </span>
                          <span className="line-clamp-1 text-right font-medium text-gray-900">
                            {item.place_object?.name || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            {t("registry.start_date")}
                          </span>
                          <span className="text-right font-medium text-gray-900">
                            {formatDate(item.date_of_sentencing)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            {t("table.status")}
                          </span>
                          <span className="text-right font-medium text-[#17b26a]">
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1040px] border-separate border-spacing-0 xl:min-w-full">
                    <thead>
                      <tr className="bg-[#f8f9fb] text-left text-[11px] font-semibold text-gray-600 lg:text-xs 2xl:text-[13px]">
                        <th className="w-[55px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("table.id")}
                        </th>
                        <th className="min-w-[180px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.full_name")}
                        </th>
                        <th className="min-w-[105px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.birth_date")}
                        </th>
                        <th className="min-w-[130px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.colony")}
                        </th>
                        <th className="min-w-[135px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.object")}
                        </th>
                      
                        <th className="min-w-[105px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.start_date")}
                        </th>
                        <th className="min-w-[120px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("registry.passport")}
                        </th>
                        <th className="min-w-[110px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                          {t("table.status")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {prisoners.map((item, index) => (
                        <tr
                          key={item.id}
                          className="text-[11px] text-gray-700 transition hover:bg-gray-50 lg:text-xs 2xl:text-sm"
                        >
                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            {offset + index + 1}
                          </td>

                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            <Link
                              to={`/registry/${item.id}`}
                              state={{ prisoner: item }}
                              className="line-clamp-2 cursor-pointer font-medium text-gray-900 hover:underline"
                              title={item.full_name}
                            >
                              {item.full_name}
                            </Link>
                          </td>

                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            {formatDate(item.birth_date)}
                          </td>

                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            <span className="line-clamp-2">
                              {item.colony?.name || "-"}
                            </span>
                          </td>

                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            <span className="line-clamp-2">
                              {item.place_object?.name || "-"}
                            </span>
                          </td>


                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            {formatDate(item.date_of_sentencing)}
                          </td>

                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            {item.pinfl || "-"}
                          </td>

                          <td className="border-b border-gray-100 px-2 py-3 font-medium text-[#17b26a] lg:px-3 xl:px-4 xl:py-4">
                            <span className="line-clamp-2">
                              {getStatusText(item.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
              <p className="text-xs text-gray-500 sm:text-sm">
                {t("common.total")}:{" "}
                <span className="font-semibold text-gray-900">{count}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                  className="h-9 rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4 sm:text-sm"
                >
                  {t("common.prev")}
                </button>

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="h-9 rounded-xl bg-[#1565d8] px-3 text-xs font-medium text-white transition hover:bg-[#1257bb] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4 sm:text-sm"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}