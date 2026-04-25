export type DashboardStatusReference = {
  id: string;
  name: string;
};

export type DashboardStatusCountItem = {
  status: DashboardStatusReference;
  male_count: number;
  female_count: number;
  total_count: number;
};

export type DashboardStatusCount = {
  count: number;
  title?: string;
  items: DashboardStatusCountItem[];
};

export type DashboardStatusParams = {
  lang?: string;
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
