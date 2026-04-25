import $api from "../../../shared/api/api";
import { getDashboardGenderEndpoint } from "../../../shared/api/dashboard-role";

import { buildDashboardStatusParams } from "../../../shared/helpers/build-dashboard-status-params";
import { useAuthStore } from "../../auth/model/auth.store";
import type {  DashboardStatusParams } from "../../dashboardStatus/types/statusTypes";
import type { DashboardGenderResponse } from "../types/dashboard-gender.types";


export const DashboardService = {
  async getStatusCount(params: DashboardStatusParams = {}) {
    const profile = useAuthStore.getState().profile;

    const endpoint = getDashboardGenderEndpoint(profile?.role);
    const preparedParams = buildDashboardStatusParams(params, profile);

    const { data } = await $api.get<DashboardGenderResponse>(endpoint, {
      params: preparedParams,
    });

    return data;
  },
};