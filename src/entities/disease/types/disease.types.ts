export type DashboardDiseaseFilter = {
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
}

export type DashboardDiseaseReference = {
  id: number;
  name: string | null;
};

export type DashboardDiseaseCountItem = {
  disease: DashboardDiseaseReference;
  male_count: number;
  female_count: number;
  total_count: number;
};

export type DashboardDiseaseCountResponse = {
  count: number;
  title: string;
  items: DashboardDiseaseCountItem[];
};