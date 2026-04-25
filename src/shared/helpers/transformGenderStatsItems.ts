type GenderData = {
  total_count?: number;
  male_count?: number;
  female_count?: number;
} | undefined;

type GenderIcons = {
  UsersIcon: any;
  UserCheckIcon: any;
};

export function transformGenderStatsItems(
  data: GenderData,
  icons: GenderIcons
) {
  const { UsersIcon, UserCheckIcon } = icons;

  return [
    {
      id: "total",
      label: "Jami",
      value: data?.total_count ?? 0,
      icon: UsersIcon,
      iconColor: "#2D6CDF",
      valueColor: "black",
    },
    {
      id: "male",
      label: "Erkaklar",
      value: data?.male_count ?? 0,
      icon: UserCheckIcon,
      iconColor: "#2D6CDF",
      valueColor: "#2D6CDF",
    },
    {
      id: "female",
      label: "Ayollar",
      value: data?.female_count ?? 0,
      icon: UserCheckIcon,
      iconColor: "#1F9D63",
      valueColor: "#1F9D63",
    },
  ];
}