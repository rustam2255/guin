import { useMemo, useState } from "react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";
import { usePrisonersList } from "../../entities/prisoners/api/use-prisoners.api";

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
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const params = useMemo(() => {
    return {
      limit,
      offset,
      search: submittedSearch || undefined,
      region: appliedFilters.regionId || undefined,
      province: appliedFilters.provinceId || undefined,
      colony: appliedFilters.colonyId || undefined,
      place_object: appliedFilters.placeObjectId || undefined,
      object_type: appliedFilters.objectTypeId || undefined,
    };
  }, [limit, offset, submittedSearch, appliedFilters]);

  const prisonersQuery = usePrisonersList(role, params);

  const prisoners = prisonersQuery.data?.results ?? [];
  const count = prisonersQuery.data?.count ?? 0;

  const handleSearch = () => {
    setOffset(0);
    setSubmittedSearch(search.trim());
  };

  const canPrev = offset > 0;
  const canNext = offset + limit < count;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="space-y-4">
          <DashboardFiltersBar />

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 sm:w-[260px]"
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-11 rounded-xl bg-[#1565d8] px-7 text-sm font-medium text-white hover:bg-[#1257bb]"
                >
                  {t("filters.search")}
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="h-11 rounded-xl bg-[#18b368] px-8 text-sm font-medium text-white hover:bg-[#139357]">
                  {t("registry.download")}
                </button>

                <div className="flex h-11 min-w-[150px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700">
                  <span>{t("registry.prisoners")}:</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f9fb] text-left text-[13px] font-medium text-gray-600">
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("table.id")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("registry.full_name")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4 min-w-[140px]">
                      {t("registry.birth_date")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("registry.colony")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("registry.object")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("registry.start_date")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("registry.passport")}
                    </th>
                    <th className="border-b border-gray-200 px-4 py-4">
                      {t("table.status")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {prisonersQuery.isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        {t("common.loading")}
                      </td>
                    </tr>
                  ) : prisonersQuery.isError ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-red-500"
                      >
                        {t("registry.error")}
                      </td>
                    </tr>
                  ) : prisoners.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        {t("common.not_found")}
                      </td>
                    </tr>
                  ) : (
                    prisoners.map((item, index) => (
                      <tr
                        key={item.id}
                        className="text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-4 py-4">
                          {offset + index + 1}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4 whitespace-nowrap">
                          <Link
                            to={`/registry/${item.id}`}
                            state={{ prisoner: item }}
                            className="cursor-pointer font-medium hover:underline"
                          >
                            {item.full_name}
                          </Link>
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          {formatDate(item.birth_date)}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          {item.colony?.name || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          {item.place_object?.name || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          {formatDate(item.date_of_sentencing)}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          {item.pinfl || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4 font-medium text-[#17b26a]">
                          {getStatusText(item.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                {t("common.total")}:{" "}
                <span className="font-semibold text-gray-900">{count}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                  className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.prev")}
                </button>

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="h-10 rounded-xl bg-[#1565d8] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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