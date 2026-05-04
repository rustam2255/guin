import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DashboardFilters } from "../types/filter.types";

const initialFilters: DashboardFilters = {
  regionId: "",
  provinceId: "",
  colonyId: "",
  objectTypeId: "",
  placeObjectId: "",
  createdAtAfter: "",
  createdAtBefore: "",
};

type DashboardFiltersStore = {
  draftFilters: DashboardFilters;
  appliedFilters: DashboardFilters;

  setRegionId: (value: string) => void;
  setProvinceId: (value: string) => void;
  setColonyId: (value: string) => void;
  setObjectTypeId: (value: string) => void;
  setPlaceObjectId: (value: string) => void;
  setCreatedAtAfter: (value: string) => void;
  setCreatedAtBefore: (value: string) => void;

  setRegionAndApply: (regionId: string) => void;
  setRegionProvinceAndApply: (regionId: string, provinceId: string) => void;

  applyFilters: () => void;
  resetDraftFilters: () => void;
  resetAllFilters: () => void;
};

export const useDashboardFiltersStore = create<DashboardFiltersStore>()(
  persist(
    (set) => ({
      draftFilters: initialFilters,
      appliedFilters: initialFilters,

      setRegionId: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            regionId: value,
            provinceId: "",
            colonyId: "",
            objectTypeId: "",
            placeObjectId: "",
          },
        })),

      setProvinceId: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            provinceId: value,
            colonyId: "",
            objectTypeId: "",
            placeObjectId: "",
          },
        })),

      setColonyId: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            colonyId: value,
            objectTypeId: "",
            placeObjectId: "",
          },
        })),

      setObjectTypeId: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            objectTypeId: value,
            placeObjectId: "",
          },
        })),

      setPlaceObjectId: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            placeObjectId: value,
          },
        })),

      setCreatedAtAfter: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            createdAtAfter: value,
          },
        })),

      setCreatedAtBefore: (value) =>
        set((state) => ({
          draftFilters: {
            ...state.draftFilters,
            createdAtBefore: value,
          },
        })),

      setRegionAndApply: (regionId) =>
        set((state) => {
          const nextFilters: DashboardFilters = {
            ...state.draftFilters,
            regionId,
            provinceId: "",
            colonyId: "",
            objectTypeId: "",
            placeObjectId: "",
          };

          return {
            draftFilters: nextFilters,
            appliedFilters: nextFilters,
          };
        }),

      setRegionProvinceAndApply: (regionId, provinceId) =>
        set((state) => {
          const nextFilters: DashboardFilters = {
            ...state.draftFilters,
            regionId,
            provinceId,
            colonyId: "",
            objectTypeId: "",
            placeObjectId: "",
          };

          return {
            draftFilters: nextFilters,
            appliedFilters: nextFilters,
          };
        }),

      applyFilters: () =>
        set((state) => ({
          appliedFilters: {
            ...state.draftFilters,
          },
        })),

      resetDraftFilters: () =>
        set(() => ({
          draftFilters: initialFilters,
        })),

      resetAllFilters: () =>
        set(() => ({
          draftFilters: initialFilters,
          appliedFilters: initialFilters,
        })),
    }),
    {
      name: "dashboard-filters-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draftFilters: state.draftFilters,
        appliedFilters: state.appliedFilters,
      }),
    }
  )
);