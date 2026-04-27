import { useQuery } from "@tanstack/react-query";
import { PrisonerService } from "./prisoner.service";
import type { PrisonerParams } from "../types/prisoner.types";

export function usePrisonersList(
  role: string | undefined,
  params: PrisonerParams
) {
  return useQuery({
    queryKey: ["prisoners-list", role, params],
    queryFn: () => PrisonerService.getList(role, params),
    enabled: Boolean(role),
  });
}
export function usePrisonerById(role: string | undefined, id?: string) {
  return useQuery({
    queryKey: ["prisoner-detail", role, id],
    queryFn: async () => {
      const data = await PrisonerService.getList(role, {
        limit: 1,
        offset: 0,
        search: id,
      });

      const prisoner = data.results.find((item) => String(item.id) === String(id));

      if (!prisoner) {
        throw new Error("Prisoner not found");
      }

      return prisoner;
    },
    enabled: Boolean(role && id),
  });
}