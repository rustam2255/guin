import $api from "../../../shared/api/api";
import type {
  PrisonerListResponse,
  PrisonerParams,
} from "../types/prisoner.types";

function getPrisonerEndpoint(role?: string) {
  if (role === "SUPERADMIN") return "/prisoners/guin/list/";
  if (role === "MINTAQA_ADMIN") return "/prisoners/mintaqa/list/";
  if (role === "KALONIYA_ADMIN") return "/prisoners/manzil-koloniya/list/";

  return "/prisoners/list/";
}

export const PrisonerService = {
  async getList(role: string | undefined, params: PrisonerParams) {
    const { data } = await $api.get<PrisonerListResponse>(
      getPrisonerEndpoint(role),
      { params }
    );

    return data;
  },
};