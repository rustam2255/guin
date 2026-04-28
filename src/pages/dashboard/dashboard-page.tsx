import DashboardLayout from "../../app/layout/dashboard-layout";
import PrisonStatusChart from "../../components/convict-status";
import { useMemo } from "react";
import { DoughnutCard } from "../../components/AddressAndGenderCards";
import InfoCardsGrid from "../../components/OtherPrisonerInfo";
// import RegionOverviewCards from "../../components/RegionOverwievCards"
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import { useDashboardGender } from "../../entities/dashboard/hooks/use-dashboard-gender";
import { UserCheck, Users } from "lucide-react";
import DashboardStatsGrid from "../../components/DashboardStatsGrid";
import { useDashboardObjectType } from "../../entities/dashboardObjectType/hook/use-dashboard-object.api";
import { useDashboardDisease } from "../../entities/disease/hooks/use-dashboard-disease";
import { buildDashboardApiFilters } from "../../shared/lib/build-dashboard-api-filters";
import DashboardFiltersBar from "../../features/dashboard-filters/ui/dashboard-filters";
import { useStatusCount } from "../../entities/dashboardStatus/hooks/use-dashboard-status";
import { transformStatusChartData } from "../../shared/helpers/transformStatusData";
import LoadingSpinner from "../../shared/loading/loading.spinner";
import { transformObjectTypeCards } from "../../shared/helpers/transformObjectType";
import { transformGenderDoughnutItems } from "../../shared/helpers/transformGenderDoughnut";
import { transformDiseaseItems } from "../../shared/helpers/transformDiseaseItems";
import { transformGenderStatsItems } from "../../shared/helpers/transformGenderStatsItems";
import { useFilterOptions } from "../../shared/hooks/use-filter-options";
import { transformStatusResultsToDoughnut } from "../../shared/helpers/transformRegionsToDoughnut";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useStatusBreakdown } from "../../entities/regionForDashboard/hooks/use-region-status";
import { useTranslation } from "react-i18next";
export default function DashboardPage() {
  const role = useAuthStore((state) => state.profile?.role);
  const { appliedFilters } = useDashboardFiltersStore();
  const { t } = useTranslation();
  const {
    regions,
    colonies,
  } = useFilterOptions();
  const breakdownItems = useMemo(() => {
    if (role === "SUPERADMIN") {
      return regions.map((item) => ({
        id: String(item.id),
        label: item.name,
        type: "region" as const,
      }));
    }
    if (role === "MINTAQA_ADMIN") {
      return colonies.map((item) => ({
        id: String(item.id),
        label: item.name,
        type: "colony" as const,
      }));
    }
    return [];
  }, [role, regions, colonies]);
  const breakdownQueries = useStatusBreakdown(breakdownItems);
  const breakdownLoading = breakdownQueries.some((q) => q.isLoading);
  const apiFilters = useMemo(() => {
    return buildDashboardApiFilters(appliedFilters);
  }, [appliedFilters]);
  const {
    data: genderData,
    isLoading: genderLoading,
    error: genderError,
  } = useDashboardGender(apiFilters);

  const {
    data: objectTypeData,
    isLoading: objectTypeLoading,
    error: objectTypeError,
  } = useDashboardObjectType(apiFilters);
  console.log(objectTypeData);

  const {
    data: diseaseData,
    isLoading: diseaseLoading,
    isError: diseaseError,
  } = useDashboardDisease(apiFilters);

  const {
    data: statusData,
    isLoading: statusLoading,
    isError: statusError,
  } = useStatusCount(apiFilters);
  const chartData = transformStatusChartData(statusData);

  const diseaseItems = transformDiseaseItems(diseaseData);

  const genderDoughnutItems = transformGenderDoughnutItems(genderData);


  const objectTypeCards = transformObjectTypeCards(objectTypeData);
  console.log(objectTypeData);



  const genderStatsItems = transformGenderStatsItems(genderData, {
    UsersIcon: Users,
    UserCheckIcon: UserCheck,
  });
  const breakdownDoughnutItems = useMemo(() => {
    if (role === "KALONIYA_ADMIN") {
      const colors = [
        "#2d6cdf",
        "#1f9d63",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ];

      const items = Array.isArray(objectTypeData?.items)
        ? objectTypeData.items
        : Array.isArray(objectTypeData)
          ? objectTypeData
          : [];

      return items.map((item, index: number) => ({
        label: item.object_type?.name ?? "Noma'lum",
        value: item.total_count ?? 0,
        color: colors[index % colors.length],
      }));
    }

    return transformStatusResultsToDoughnut(
      breakdownQueries,
      breakdownItems.map((item) => item.label)
    );
  }, [role, objectTypeData, breakdownQueries, breakdownItems]);
  const breakdownTitle = useMemo(() => {
    if (role === "SUPERADMIN") return t("dashboard.by_region");
    if (role === "MINTAQA_ADMIN") return t("dashboard.by_colony");
    if (role === "KALONIYA_ADMIN") return t("dashboard.by_object_type");
    if (role === "PROVINCEADMIN") return t("dashboard.by_colony");
    return t("dashboard.by_region");
  }, [role, t]);

  const breakdownTableHeader = useMemo(() => {
    if (role === "SUPERADMIN") return t("filters.region");
    if (role === "MINTAQA_ADMIN") return t("filters.colony");
    if (role === "KALONIYA_ADMIN") return t("filters.object_type");
    if (role === "PROVINCEADMIN") return t("filters.colony");
    return t("filters.region");
  }, [role, t]);
  const breakdownTotalValue = useMemo(() => {
    return breakdownDoughnutItems.reduce((sum, item) => sum + item.value, 0);
  }, [breakdownDoughnutItems]);
  //   const mockDoughnutItems = [
  //   { label: "Toshkent", value: 120, percent: "30%", color: "#2d6cdf" },
  //   { label: "Samarqand", value: 80, percent: "20%", color: "#1f9d63" },
  //   { label: "Buxoro", value: 60, percent: "15%", color: "#f59e0b" },
  // ];

  // const mockBarItems = [
  //   { label: "Qamoqxona 1", value: 40, color: "#2d6cdf" },
  //   { label: "Qamoqxona 2", value: 70, color: "#1f9d63" },
  //   { label: "Qamoqxona 3", value: 30, color: "#f59e0b" },
  // ];
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[2200px] space-y-5 sm:space-y-6 xl:space-y-7 2xl:space-y-8">
        <DashboardFiltersBar />

        {genderLoading ? (
          <div className="rounded-3xl bg-white px-4 py-4 text-sm text-gray-500  sm:px-5 lg:px-6 2xl:px-8 2xl:py-5 2xl:text-base">
            <LoadingSpinner />
          </div>
        ) : genderError ? (
          <div className="rounded-3xl bg-white px-4 py-4 text-sm text-red-500 shadow-sm sm:px-5 lg:px-6 2xl:px-8 2xl:py-5 2xl:text-base">
            {t("dashboard.gender_error")}
          </div>
        ) : (
          <DashboardStatsGrid items={genderStatsItems} />
        )}
        {/* <RegionOverviewCards
  doughnutTitle="Mintaqalar kesimida"
  doughnutTableHeader="Mintaqa"
  doughnutTotalValue={260}
  doughnutItems={mockDoughnutItems}
  barTitle="Obyektlar"
  barItems={mockBarItems}
  barFooterCount={140}
  barFooterLabel="Jami"
/> */}

        {statusLoading ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:p-7 2xl:p-8 min-[1800px]:p-10">
            <div className="text-sm text-gray-500 2xl:text-base">
              <LoadingSpinner />
            </div>
          </div>
        ) : statusError ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:p-7 2xl:p-8 min-[1800px]:p-10">
            <div className="text-sm text-red-500 2xl:text-base">
              Obyekt turlari bo‘yicha statistika yuklanmadi
            </div>
          </div>
        ) : (
          <PrisonStatusChart
            title={t("dashboard.by_status")}
            total={chartData.total}
            labels={chartData.labels}
            datasets={chartData.datasets}
          />
        )}

        <section className="space-y-3 sm:space-y-4">
          <p className="text-[14px] font-medium text-[rgba(181,183,192,1)] sm:text-[15px] lg:text-[16px] 2xl:text-[18px] min-[1800px]:text-[20px]">
            {t("dashboard.by_gender")}
          </p>

          <div className="w-full max-w-full">
            <InfoCardsGrid
              columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-2"
              data={[
                { count: genderData?.male_count || 0, title: "Erkaklar" },
                { count: genderData?.female_count || 0, title: "Ayollar" },
              ]}
            />
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <p className="text-[14px] font-medium text-[rgba(181,183,192,1)] sm:text-[15px] lg:text-[16px] 2xl:text-[18px] min-[1800px]:text-[20px]">
            {t("dashboard.by_object")}
          </p>
          {objectTypeLoading ? (
            <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:p-7 2xl:p-8 min-[1800px]:p-10">
              <div className="text-sm text-gray-500 2xl:text-base">
                <LoadingSpinner />
              </div>
            </div>
          ) : objectTypeError ? (
            <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 lg:p-7 2xl:p-8 min-[1800px]:p-10">
              <div className="text-sm text-red-500 2xl:text-base">
                {t("dashboard.object_type_error")}
              </div>
            </div>
          ) : (
            <InfoCardsGrid
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5"
              data={objectTypeCards}
            />
          )}
        </section>

        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:gap-6 min-[1800px]:gap-8">
          {(role !== "KALONIYA_ADMIN" && breakdownLoading) || (role === "KALONIYA_ADMIN" && objectTypeLoading) ? (
            <div className="rounded-3xl bg-white p-5">
              <LoadingSpinner />
            </div>
          ) : (
            <DoughnutCard
              title={breakdownTitle}
              tableHeader={breakdownTableHeader}
              totalValue={breakdownTotalValue}
              items={breakdownDoughnutItems}
            />
          )}

          <DoughnutCard
            title={t("dashboard.by_gender_short")}
            tableHeader={t("dashboard.gender")}
            totalValue={genderData?.total_count}
            items={genderDoughnutItems}
          />
        </div>

        <section className="space-y-3 sm:space-y-4 mb-5">
          <p className="text-[14px] font-medium text-[rgba(181,183,192,1)] sm:text-[15px] lg:text-[16px] 2xl:text-[18px] min-[1800px]:text-[20px]">
            {t("dashboard.other_info")}
          </p>

          {diseaseLoading ? (
            <div className="  text-sm text-gray-500    2xl:text-base">
              Kasalliklar bo‘yicha ma&apos;lumotlar yuklanmoqda...
            </div>
          ) : diseaseError ? (
            <div className="   text-sm text-red-500   2xl:text-base">
              Kasalliklar bo‘yicha ma&apos;lumotlar yuklanmadi
            </div>
          ) : diseaseItems.length === 0 ? (
            <div className="  text-sm text-gray-500   2xl:text-base">
              Kasalliklar bo‘yicha ma&apos;lumotlar mavjud emas
            </div>
          ) : (
            <InfoCardsGrid
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5"
              data={diseaseItems}
            />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}