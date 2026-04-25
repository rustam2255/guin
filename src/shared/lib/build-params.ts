export function buildParams(filters: Record<string, unknown>) {
  const params: Record<string, string | boolean | number> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value as string | boolean | number;
    }
  });

  return params;
}