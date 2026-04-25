export type DashboardApiFilters = {
  search?: string;
  region?: string;
  province?: string;
  colony?: string;
  place_object?: string;
  object_type?: string;
  status?: string;
  gender?: string;
  danger_level?: string;
  active_prisoner?: boolean;
};

export type CommonReference = {
  id: number;
  name: string;
  unique_id?: number | null;
  guin?: string;
  region_id?: number;
  province_id?: number;
  colony_id?: number;
  capacity?: number;
  object_type?: {
    id?: number;
    name?: string;
    [key: string]: unknown;
  } | null;
};

export type RegionItem = CommonReference;

export type ProvinceItem = CommonReference & {
  region_id: number;
};

export type ColonyItem = CommonReference & {
  region_id: number;
  province_id: number;
};

export type ObjectTypeItem = CommonReference;

export type ObjectItem = CommonReference & {
  colony_id: number;
  object_type?: {
    id?: number;
    name?: string;
    [key: string]: unknown;
  } | null;
};

export type DashboardFilterForm = {
  region: string;
  province: string;
  colony: string;
  object_type: string;
  place_object: string;
};

export type SelectOption = {
  label: string;
  value: string;
};
export type DashboardFilters = {
  regionId: string;
  provinceId: string;
  colonyId: string;
  objectTypeId: string;
  placeObjectId: string;
};