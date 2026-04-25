type ObjectTypeItem = {
  total_count: number;
  object_type?: {
    name?: string;
  };
};

type ObjectTypeResponse = {
  items?: ObjectTypeItem[];
} | undefined;

export function transformObjectTypeCards(data: ObjectTypeResponse) {
  return (
    data?.items?.map((item) => ({
      count: item.total_count,
      title: item.object_type?.name ?? "Noma'lum",
    })) ?? []
  );
}