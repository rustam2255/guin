import { useQuery } from "@tanstack/react-query";
import { FilterService, type UserRole } from "../api/filter.service";
import { useAuthStore } from "../../entities/auth/model/auth.store";

export function useFilterOptions() {
  const role = useAuthStore((state) => state.profile?.role) as UserRole | undefined;

  const regionsQuery = useQuery({
    queryKey: ["filter-regions", role],
    queryFn: () => FilterService.getRegions(role as UserRole),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
  });

  const provincesQuery = useQuery({
    queryKey: ["filter-provinces", role],
    queryFn: () => FilterService.getProvinces(role as UserRole),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
  });

  const coloniesQuery = useQuery({
    queryKey: ["filter-colonies", role],
    queryFn: () => FilterService.getColonies(role as UserRole),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
  });

  const objectTypesQuery = useQuery({
    queryKey: ["filter-object-types", role],
    queryFn: () => FilterService.getObjectTypes(role as UserRole),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
  });

  const objectsQuery = useQuery({
    queryKey: ["filter-objects", role],
    queryFn: () => FilterService.getObjects(role as UserRole),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
  });

  return {
    role,
    regions: regionsQuery.data ?? [],
    provinces: provincesQuery.data ?? [],
    colonies: coloniesQuery.data ?? [],
    objectTypes: objectTypesQuery.data ?? [],
    objects: objectsQuery.data ?? [],

    isLoading:
      regionsQuery.isLoading ||
      provincesQuery.isLoading ||
      coloniesQuery.isLoading ||
      objectTypesQuery.isLoading ||
      objectsQuery.isLoading,

    isError:
      regionsQuery.isError ||
      provincesQuery.isError ||
      coloniesQuery.isError ||
      objectTypesQuery.isError ||
      objectsQuery.isError,
  };
}