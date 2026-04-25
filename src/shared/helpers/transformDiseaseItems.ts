type DiseaseItem = {
  total_count: number;
  disease?: {
    name?: string | null;
  };
};

type DiseaseResponse = {
  items?: DiseaseItem[];
} | undefined;

export function transformDiseaseItems(data: DiseaseResponse) {
  return (
    data?.items?.map((item) => ({
      count: item.total_count,
      title: item.disease?.name ?? "Noma'lum",
    })) ?? []
  );
}