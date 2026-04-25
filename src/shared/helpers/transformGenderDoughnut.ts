type GenderData = {
  male_count?: number;
  female_count?: number;
  male_prosentage?: number;
  female_prosentage?: number;
} | undefined;

export function transformGenderDoughnutItems(data: GenderData) {
  return [
    {
      label: "Erkaklar",
      value: data?.male_count ?? 0,
      percent: `${data?.male_prosentage ?? 0}%`,
      color: "#2D6CDF",
    },
    {
      label: "Ayollar",
      value: data?.female_count ?? 0,
      percent: `${data?.female_prosentage ?? 0}%`,
      color: "#1F9D63",
    },
  ];
}