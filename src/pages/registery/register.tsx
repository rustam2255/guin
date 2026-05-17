import { useMemo, useState } from "react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";
import { usePrisonersList } from "../../entities/prisoners/api/use-prisoners.api";
import { useStatusCount } from "../../entities/dashboardStatus/hooks/use-dashboard-status";
import { useDashboardDisease } from "../../entities/disease/hooks/use-dashboard-disease";

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
  
  // Propensity state turi o'zgartirildi: boolean | undefined
  const [filters, setFilters] = useState({
    status: "",
    has_propensity: undefined as boolean | undefined, 
    smena: "",
    has_disease: undefined as boolean | undefined,
    disease: "",
  });

  const params = useMemo(() => {
    return {
      limit,
      offset,
      search: submittedSearch || undefined,
      smena: filters.smena || undefined,
      status: filters.status || undefined,
      has_propensity: filters.has_propensity, // To'g'ridan-to'g'ri boolean qiymat ketadi
      has_disease: filters.has_disease,
      disease: filters.disease || undefined,

      region: appliedFilters.regionId || undefined,
      province: appliedFilters.provinceId || undefined,
      colony: appliedFilters.colonyId || undefined,
      place_object: appliedFilters.placeObjectId || undefined,
      object_type: appliedFilters.objectTypeId || undefined,

      created_at_after: appliedFilters.createdAtAfter,
      created_at_before: appliedFilters.createdAtBefore,
    };
  }, [limit, offset, submittedSearch, filters, appliedFilters]);

  const prisonersQuery = usePrisonersList(role, params);
  const { data: statusData } = useStatusCount(params);
  const { data: diseaseData } = useDashboardDisease(params);

  const diseaseOptions = diseaseData?.items ?? [];
  const prisoners = prisonersQuery.data?.results ?? [];
  const count = prisonersQuery.data?.count ?? 0;
  const statusOptions = statusData?.items ?? [];

  const handleSearch = () => {
    setOffset(0);
    setSubmittedSearch(search.trim());
  };

  const canPrev = offset > 0;
  const canNext = offset + limit < count;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] px-2 py-3 sm:px-3 lg:px-0 lg:py-0">
        <div className="mx-auto w-full max-w-[2200px] space-y-3 sm:space-y-4">
          <DashboardFiltersBar />
          <div className="rounded-2xl bg-white px-4 shadow-sm" style={{ height: '92px', display: 'flex', alignItems: 'center' }}>
            <div className="flex items-center gap-2 w-full overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              
              {/* Qidiruv bo'limi */}
              <div className="flex h-10 shrink-0 items-center rounded-xl border border-gray-200 px-3 gap-2 w-[200px]">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 shrink-0">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    if (!value.trim()) { setOffset(0); setSubmittedSearch(""); }
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder={t("registry.search_placeholder")}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 min-w-0"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="h-10 shrink-0 rounded-xl bg-[#1565d8] px-4 text-sm font-medium text-white hover:bg-[#1257bb] flex items-center gap-1.5"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                {t("filters.search")}
              </button>

              {/* Smena filtri */}
              <div className="relative shrink-0">
                <select
                  value={filters.smena}
                  onChange={(e) => { setFilters(f => ({ ...f, smena: e.target.value })); setOffset(0); }}
                  className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 pt-3" 
                >
                  <option value="">Umumiy</option>
                  <option value="BIRINCHI">1-smena</option>
                  <option value="IKKINCHI">2-smena</option>
                  <option value="UCHINCHI">3-smena</option>
                </select>
                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1565d8]" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="pointer-events-none absolute left-8 top-1.5 text-[10px] text-gray-400 leading-none">Smena</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </div>

              {/* Status filtri */}
              <div className="relative shrink-0">
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters((f) => ({ ...f, status: e.target.value }));
                    setOffset(0);
                  }}
                  className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 pt-3 w-[120px]"
                >
                  <option value="">Umumiy</option>
                  {statusOptions.map((item) => (
                    <option key={item.status.id} value={item.status.id}>
                      {item.status.name}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#17b26a" strokeWidth="2" />
                  <path d="m9 12 2 2 4-4" stroke="#17b26a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="pointer-events-none absolute left-8 top-1.5 text-[10px] text-gray-400 leading-none">Status</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </div>

              {/* TUKATILGAN: Propensity (Moyillik) filtri */}
              <div className="relative shrink-0">
                <select
                  value={filters.has_propensity === undefined ? "" : String(filters.has_propensity)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters(f => ({ ...f, has_propensity: val === "" ? undefined : val === "true" }));
                    setOffset(0);
                  }}
                  className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 pt-3 w-[120px]"
                >
                  <option value="">Umumiy</option>
                  <option value="true">Moyilligi bor mahkumlar</option>
                  <option value="false">Moyilligi yo'q mahkumlar</option>
                </select>
                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="12" width="4" height="9" rx="1" stroke="#7c3aed" strokeWidth="2" />
                  <rect x="9" y="7" width="4" height="14" rx="1" stroke="#7c3aed" strokeWidth="2" />
                  <rect x="16" y="3" width="4" height="18" rx="1" stroke="#7c3aed" strokeWidth="2" />
                </svg>
                <span className="pointer-events-none absolute left-8 top-1.5 text-[10px] text-gray-400 leading-none">Moyillik holati</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </div>

              {/* Kasallik holati */}
              <div className="relative shrink-0">
                <select
                  value={filters.has_disease === undefined ? "" : String(filters.has_disease)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters(f => ({ ...f, has_disease: val === "" ? undefined : val === "true" }));
                    setOffset(0);
                  }}
                  className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 pt-3"
                >
                  <option value="">Umumiy</option>
                  <option value="true">Kasal mahkumlar</option>
                  <option value="false">Sog'lom mahkumlar</option>
                </select>
                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="pointer-events-none absolute left-8 top-1.5 text-[10px] text-gray-400 leading-none">Kasallik holati</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </div>

              {/* Kasallik turi */}
              <div className="relative shrink-0">
                <select
                  value={filters.disease}
                  onChange={(e) => {
                    setFilters((f) => ({ ...f, disease: e.target.value }));
                    setOffset(0);
                  }}
                  className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 pt-3"
                >
                  <option value="">Umumiy</option>
                  {diseaseOptions.map((item) => (
                    <option key={item.disease.id} value={String(item.disease.id)}>
                      {item.disease.name}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="pointer-events-none absolute left-8 top-1.5 text-[10px] text-gray-400 leading-none">Kasallik turi</span>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </div>

              <div className="flex-1" />
              <button className="h-10 shrink-0 rounded-xl bg-[#18b368] px-4 text-sm font-medium text-white hover:bg-[#139357] flex items-center gap-1.5">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("registry.download")}
              </button>
            </div>
          </div>

          {/* Mahkumlar jadvali va qolgan qismlar (O'zgarishsiz qoldi) */}
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
                {/* Mobile ko'rinish */}
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
                          <span className="text-gray-500">{t("registry.birth_date")}</span>
                          <span className="text-right font-medium text-gray-900">{formatDate(item.birth_date)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Smena</span>
                          <span className="text-right font-medium text-gray-900">{item.smena_label || item.smena || "-"}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="shrink-0 text-gray-500">{t("registry.colony")}</span>
                          <span className="line-clamp-1 text-right font-medium text-gray-900">{item.colony?.name || "-"}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="shrink-0 text-gray-500">{t("registry.object")}</span>
                          <span className="line-clamp-1 text-right font-medium text-gray-900">{item.place_object?.name || "-"}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">{t("registry.start_date")}</span>
                          <span className="text-right font-medium text-gray-900">{formatDate(item.date_of_sentencing)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">{t("table.status")}</span>
                          <span className="text-right font-medium text-[#17b26a]">{getStatusText(item.status)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop ko'rinish */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1040px] border-separate border-spacing-0 xl:min-w-full">
                    <thead>
                      <tr className="bg-[#f8f9fb] text-left text-[11px] font-semibold text-gray-600 lg:text-xs 2xl:text-[13px]">
                        <th className="w-[55px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("table.id")}</th>
                        <th className="min-w-[180px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.full_name")}</th>
                        <th className="min-w-[105px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.birth_date")}</th>
                        <th className="min-w-[130px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.colony")}</th>
                        <th className="min-w-[135px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.object")}</th>
                        <th className="min-w-[105px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.start_date")}</th>
                        <th className="min-w-[120px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("registry.passport")}</th>
                        <th className="min-w-[110px] border-b border-gray-200 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{t("table.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prisoners.map((item, index) => (
                        <tr key={item.id} className="text-[11px] text-gray-700 transition hover:bg-gray-50 lg:text-xs 2xl:text-sm">
                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{offset + index + 1}</td>
                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">
                            <Link to={`/registry/${item.id}`} state={{ prisoner: item }} className="line-clamp-2 cursor-pointer font-medium text-gray-900 hover:underline" title={item.full_name}>
                              {item.full_name}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{formatDate(item.birth_date)}</td>
                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4"><span className="line-clamp-2">{item.colony?.name || "-"}</span></td>
                          <td className="border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4"><span className="line-clamp-2">{item.place_object?.name || "-"}</span></td>
                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{formatDate(item.date_of_sentencing)}</td>
                          <td className="whitespace-nowrap border-b border-gray-100 px-2 py-3 lg:px-3 xl:px-4 xl:py-4">{item.pinfl || "-"}</td>
                          <td className="border-b border-gray-100 px-2 py-3 font-medium text-[#17b26a] lg:px-3 xl:px-4 xl:py-4"><span className="line-clamp-2">{getStatusText(item.status)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
              <p className="text-xs text-gray-500 sm:text-sm">
                {t("common.total")}: <span className="font-semibold text-gray-900">{count}</span>
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