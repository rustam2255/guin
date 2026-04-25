export type DashboardFilters = {
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

export type DashboardGenderResponse = {
  male_count: number;
  female_count: number;
  male_prosentage: number;
  female_prosentage: number;
  total_count: number;
};