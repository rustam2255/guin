import {
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Hexagon,
  KeyRound,
  Menu,
  Table2,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDashboardFiltersStore } from "../../shared/store/dashboard-filters.store";
import { useFilterOptions } from "../../shared/hooks/use-filter-options";

const activeClass =
  "bg-gradient-to-r from-[rgba(15,95,194,1)] to-[rgba(3,186,107,1)] text-white shadow";

const inactiveClass = "text-black hover:bg-gray-100";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const { regions, provinces, isLoading } = useFilterOptions();

  const {
    draftFilters,
    setRegionAndApply,
    setRegionProvinceAndApply,
  } = useDashboardFiltersStore();

  const staticMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <KeyRound size={18} /> },
    { label: "Sanoq", path: "/count", icon: <FileText size={18} /> },
    { label: "Ro‘yxat", path: "/registry", icon: <Table2 size={18} /> },
  ];

  const regionMenus = useMemo(() => {
    return regions.map((region) => {
      const regionProvinces = provinces.filter(
        (province) => String(province.region_id) === String(region.id)
      );

      return {
        label: region.name,
        regionId: String(region.id),
        icon: <Globe size={18} />,
        children: regionProvinces.map((province) => ({
          label: province.name,
          provinceId: String(province.id),
        })),
      };
    });
  }, [regions, provinces]);

  useEffect(() => {
    const currentOpen: Record<string, boolean> = {};

    regionMenus.forEach((item) => {
      if (draftFilters.regionId === item.regionId) {
        currentOpen[item.label] = true;
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...currentOpen }));
  }, [draftFilters.regionId, regionMenus]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const handleRegionClick = (regionId: string, label: string) => {
    setRegionAndApply(regionId);

    setOpenMenus((prev) => ({
      ...prev,
      [label]: true,
    }));

    navigate(`/dashboard?region=${regionId}`);
    closeMobileSidebar();
  };

  const handleProvinceClick = (
    regionId: string,
    provinceId: string,
    label: string
  ) => {
    setRegionProvinceAndApply(regionId, provinceId);

    setOpenMenus((prev) => ({
      ...prev,
      [label]: true,
    }));

    navigate(`/dashboard?region=${regionId}&province=${provinceId}`);
    closeMobileSidebar();
  };

  const renderMenuContent = () => (
    <>
      <div
        className="
          mb-3 flex flex-col items-center justify-center gap-1.5
          px-4 sm:px-5 lg:px-6 2xl:px-7
        "
      >
        <div className="relative w-full lg:hidden">
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="absolute right-0 top-0 rounded-xl p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <img
          src="/rename.png"
          alt="Logo"
          className="
            h-[72px] w-[72px] object-contain
            sm:h-[80px] sm:w-[80px]
            lg:h-[90px] lg:w-[90px]
            2xl:h-[104px] 2xl:w-[104px]
            min-[1800px]:h-[118px] min-[1800px]:w-[118px]
          "
        />

        <div className="flex items-center gap-2">
          <Hexagon className="h-[18px] w-[18px] sm:h-[19px] sm:w-[19px] lg:h-[20px] lg:w-[20px]" />
          <h2
            className="
              text-base font-bold leading-tight
              sm:text-lg
              2xl:text-[22px]
              min-[1800px]:text-[24px]
            "
          >
            Raqamli Nazoratchi
          </h2>
        </div>

        <p className="flex w-full justify-end text-[11px] text-gray-500 sm:text-xs 2xl:text-sm">
          v1.0
        </p>
      </div>

      <nav className="space-y-1 px-2 2xl:px-3">
        {staticMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              className={`
                flex items-center justify-between rounded-xl font-medium transition-all duration-200
                px-3 py-2.5 text-[14px]
                sm:px-3.5  sm:text-[15px]
                lg:px-4  lg:text-[16px]
                2xl:px-5 2 2xl:text-[17px]
                ${isActive ? activeClass : inactiveClass}
              `}
            >
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={18} className="shrink-0" />}
            </Link>
          );
        })}

        {isLoading ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            Mintaqalar yuklanmoqda...
          </div>
        ) : (
          regionMenus.map((item) => {
            const isActive = draftFilters.regionId === item.regionId;
            const isOpen = openMenus[item.label];

            return (
              <div key={item.regionId}>
                <div
                  className={`
                    flex items-center justify-between rounded-xl font-medium transition-all duration-200
                    px-3 py-2.5 text-[14px]
                    sm:px-3.5 sm:text-[15px]
                    lg:px-4 lg:text-[16px]
                    2xl:px-5  2xl:text-[17px]
                    ${isActive ? activeClass : inactiveClass}
                  `}
                >
                  <button
                    type="button"
                    onClick={() => handleRegionClick(item.regionId, item.label)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>

                  {!!item.children.length && (
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      className="ml-2 shrink-0 rounded-md p-1"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {!!item.children.length && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "mt-1.5 max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="space-y-1.5 pl-3 sm:pl-4 lg:pl-5">
                      {item.children.map((child) => {
                        const childActive =
                          draftFilters.regionId === item.regionId &&
                          draftFilters.provinceId === child.provinceId;

                        return (
                          <button
                            key={child.provinceId}
                            type="button"
                            onClick={() =>
                              handleProvinceClick(
                                item.regionId,
                                child.provinceId,
                                item.label
                              )
                            }
                            className={`
                              flex w-full items-center justify-between rounded-xl text-left transition-all duration-200
                              px-3 py-2 text-[13px]
                              sm:px-3.5 sm:py-2.5 sm:text-[14px]
                              lg:px-4 lg:py-2.5 lg:text-[14px]
                              2xl:px-4.5 2xl:py-3 2xl:text-[15px]
                              ${
                                childActive
                                  ? "bg-[rgba(229,241,255,1)] font-semibold text-[rgba(15,95,194,1)]"
                                  : "text-gray-700 hover:bg-gray-100"
                              }
                            `}
                          >
                            <span className="truncate">{child.label}</span>
                            {childActive && (
                              <ChevronRight size={16} className="shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </>
  );

  return (
    <>
    
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center
          rounded-xl border border-gray-200 bg-white text-gray-800 shadow-lg
          transition hover:bg-gray-50 lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      <div
        onClick={closeMobileSidebar}
        className={`
          fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />


      <aside
        className={`
          fixed left-0 top-0 z-[65] h-screen w-[min(85vw,340px)] overflow-y-auto border-r border-gray-200 bg-white py-6 shadow-2xl
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {renderMenuContent()}
      </aside>

     
      <aside
        className="
           app-scrollbar sticky top-0 hidden h-screen shrink-0 overflow-y-auto border-r border-gray-200 bg-white
          lg:block lg:w-[280px]
          xl:w-[300px]
          2xl:w-[340px]
          min-[1800px]:w-[380px]
          min-[2200px]:w-[420px]
          py-6 lg:py-8 2xl:py-10
        "
      >
        {renderMenuContent()}
      </aside>
    </>
  );
}