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
export type DashboardObjectTypeReference = {
  id: number;
  name: string;
};

export type DashboardObjectTypeCountItem = {
  object_type: DashboardObjectTypeReference;
  male_count: number;
  female_count: number;
  total_count: number;
};

export type DashboardObjectTypeResponse = {
  count: number;
  items: DashboardObjectTypeCountItem[];
};