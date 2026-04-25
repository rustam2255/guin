import $api from "./api";
import type {
  RegionItem,
  ProvinceItem,
  ColonyItem,
  ObjectTypeItem,
  ObjectItem,
} from "../types/filter.types";

export type UserRole =
  | "SUPERADMIN"
  | "MINTAQA_ADMIN"
  | "KALONIYA_ADMIN"
  | "PROVINCEADMIN";

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const data = payload as {
      results?: T[];
      items?: T[];
      data?: T[];
    };

    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
  }

  return [];
}

export const FilterService = {
  async getRegions(role: UserRole) {
    switch (role) {
      case "SUPERADMIN": {
        const { data } = await $api.get("/common/guin/dashboard/regions/");
        return normalizeList<RegionItem>(data);
      }

      case "MINTAQA_ADMIN": {
        const { data } = await $api.get("/common/mintaqa/dashboard/region/");
        return data ? [data as RegionItem] : [];
      }

      case "KALONIYA_ADMIN":
      case "PROVINCEADMIN":
        return [];

      default:
        return [];
    }
  },

  async getProvinces(role: UserRole) {
    switch (role) {
      case "SUPERADMIN": {
        const { data } = await $api.get("/common/guin/dashboard/provinces/");
        return normalizeList<ProvinceItem>(data);
      }

      case "MINTAQA_ADMIN": {
        const { data } = await $api.get("/common/mintaqa/dashboard/provinces/");
        return normalizeList<ProvinceItem>(data);
      }

      case "KALONIYA_ADMIN": {
        const { data } = await $api.get("/common/manzil-koloniya/dashboard/colony/");
        const colony = data as ColonyItem & {
          province?: ProvinceItem;
        };

        return colony?.province ? [colony.province] : [];
      }

      case "PROVINCEADMIN": {
        const { data } = await $api.get("/common/object/dashboard/colony/");
        const colony = data as ColonyItem & {
          province?: ProvinceItem;
        };

        return colony?.province ? [colony.province] : [];
      }

      default:
        return [];
    }
  },

  async getColonies(role: UserRole) {
    switch (role) {
      case "SUPERADMIN": {
        const { data } = await $api.get("/common/guin/dashboard/colonies/");
        return normalizeList<ColonyItem>(data);
      }

      case "MINTAQA_ADMIN": {
        const { data } = await $api.get("/common/mintaqa/dashboard/colonies/");
        return normalizeList<ColonyItem>(data);
      }

      case "KALONIYA_ADMIN": {
        const { data } = await $api.get("/common/manzil-koloniya/dashboard/colony/");
        return data ? [data as ColonyItem] : [];
      }

      case "PROVINCEADMIN": {
        const { data } = await $api.get("/common/object/dashboard/colony/");
        return data ? [data as ColonyItem] : [];
      }

      default:
        return [];
    }
  },

  async getObjectTypes(role: UserRole) {
    switch (role) {
      case "SUPERADMIN": {
        const { data } = await $api.get("/common/guin/dashboard/object-types/");
        return normalizeList<ObjectTypeItem>(data);
      }

      case "MINTAQA_ADMIN": {
        const { data } = await $api.get("/common/mintaqa/dashboard/object-types/");
        return normalizeList<ObjectTypeItem>(data);
      }

      case "KALONIYA_ADMIN": {
        const { data } = await $api.get("/common/manzil-koloniya/dashboard/object-types/");
        return normalizeList<ObjectTypeItem>(data);
      }

      case "PROVINCEADMIN": {
        const { data } = await $api.get("/common/object/dashboard/object-types/");
        return normalizeList<ObjectTypeItem>(data);
      }

      default:
        return [];
    }
  },

  async getObjects(role: UserRole) {
    switch (role) {
      case "SUPERADMIN": {
        const { data } = await $api.get("/common/guin/dashboard/objects/");
        return normalizeList<ObjectItem>(data);
      }

      case "MINTAQA_ADMIN": {
        const { data } = await $api.get("/common/mintaqa/dashboard/objects/");
        return normalizeList<ObjectItem>(data);
      }

      case "KALONIYA_ADMIN": {
        const { data } = await $api.get("/common/manzil-koloniya/dashboard/objects/");
        return normalizeList<ObjectItem>(data);
      }

      case "PROVINCEADMIN": {
        const { data } = await $api.get("/common/object/dashboard/objects/");
        return normalizeList<ObjectItem>(data);
      }

      default:
        return [];
    }
  },
};